
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION, FALLBACK_MODELS, AGENT_PLATFORM_FALLBACK_MODELS, getModelConfigSafe, type AiProvider } from "../constants";
import { TitleAnalysisResult } from '../types';

// ============================================================
// CLIENT FACTORY — điểm duy nhất khởi tạo SDK (api.md §III)
// ============================================================
export const createGoogleAiClient = (
  apiKey: string,
  provider: AiProvider = 'gemini',
): GoogleGenAI => {
  if (provider === 'agent-platform') {
    // Cờ kỹ thuật của Google Gen AI SDK để định tuyến tới
    // aiplatform.googleapis.com trong chế độ API key.
    return new GoogleGenAI({ vertexai: true, apiKey });
  }
  return new GoogleGenAI({ apiKey });
};

// ============================================================
// PHÂN LOẠI LỖI (api.md §II — Lỗi được phép chuyển model vs dừng ngay)
// ============================================================
export type ApiErrorType =
  | 'MODEL_OVERLOADED'   // 500/503/504/overloaded → cho phép fallback
  | 'NOT_FOUND'          // 404 → cho phép fallback
  | 'STREAM_INTERRUPTED' // Phản hồi stream bị cắt giữa JSON → cho phép fallback
  | 'QUOTA_EXCEEDED'     // 429 → dừng ngay, KHÔNG đánh dấu key invalid
  | 'RATE_LIMIT'         // rate limit → dừng ngay
  | 'INVALID_API_KEY'    // 401/API_KEY_INVALID → dừng ngay
  | 'PERMISSION_DENIED'  // 403 → dừng ngay (Gemini), thử model tiếp (Agent Platform)
  | 'INVALID_ARGUMENT'   // 400 → dừng ngay
  | 'NETWORK_ERROR'      // kết nối → dừng ngay
  | 'UNKNOWN';

// Các lỗi CHO PHÉP chuyển model fallback
const FALLBACKABLE_ERRORS: ApiErrorType[] = ['MODEL_OVERLOADED', 'NOT_FOUND', 'STREAM_INTERRUPTED'];

export const parseApiError = (error: any): ApiErrorType => {
  const errorMessage = (error?.message || error?.toString() || '').toLowerCase();
  const statusCode = error?.status || error?.code || error?.httpCode || 0;
  const errorString = JSON.stringify(error).toLowerCase();

  // 500/503/504 hoặc text overloaded → MODEL_OVERLOADED (cho phép fallback)
  if (statusCode === 500 || statusCode === 503 || statusCode === 504 ||
    errorMessage.includes('internal') || errorMessage.includes('unavailable') ||
    errorMessage.includes('deadline_exceeded') ||
    errorMessage.includes('overloaded') || errorMessage.includes('high demand') ||
    errorMessage.includes('try again later') || errorMessage.includes('temporarily unavailable') ||
    errorString.includes('503') || errorString.includes('500')) {
    return 'MODEL_OVERLOADED';
  }

  // 404 NOT_FOUND → cho phép fallback
  if (statusCode === 404 || errorMessage.includes('not_found') ||
    errorMessage.includes('not found') || errorString.includes('404')) {
    return 'NOT_FOUND';
  }

  // SDK có thể ném lỗi này nếu kết nối stream bị đóng giữa một event JSON.
  // Đây là lỗi tạm thời của stream, không phải lỗi API key hay dữ liệu người dùng.
  if (errorMessage.includes('incomplete json segment') ||
    errorMessage.includes('unexpected end of json input') ||
    errorMessage.includes('unterminated string in json')) {
    return 'STREAM_INTERRUPTED';
  }

  // 401 / API_KEY_INVALID → dừng ngay
  if (statusCode === 401 || errorMessage.includes('api_key_invalid') ||
    errorMessage.includes('unauthorized')) {
    return 'INVALID_API_KEY';
  }

  // 403 / PERMISSION_DENIED → dừng ngay (riêng Agent Platform có thể thử model tiếp)
  if (statusCode === 403 || errorMessage.includes('permission_denied')) {
    return 'PERMISSION_DENIED';
  }

  // 429 / RESOURCE_EXHAUSTED → dừng ngay, KHÔNG đánh dấu key invalid
  if (statusCode === 429 || errorMessage.includes('quota') ||
    errorMessage.includes('resource_exhausted') || errorMessage.includes('exceeded')) {
    return 'QUOTA_EXCEEDED';
  }

  // Rate limit
  if (errorMessage.includes('rate') && errorMessage.includes('limit')) {
    return 'RATE_LIMIT';
  }

  // 400 / INVALID_ARGUMENT → dừng ngay
  if (statusCode === 400 || errorMessage.includes('invalid_argument') ||
    errorMessage.includes('bad request')) {
    return 'INVALID_ARGUMENT';
  }

  // Network error
  if (errorMessage.includes('network') || errorMessage.includes('fetch') ||
    errorMessage.includes('connection') || errorMessage.includes('econnrefused')) {
    return 'NETWORK_ERROR';
  }

  return 'UNKNOWN';
};

// Kiểm tra lỗi có được phép fallback sang model khác không
export const isFallbackableError = (errorType: ApiErrorType, provider: AiProvider = 'gemini'): boolean => {
  if (FALLBACKABLE_ERRORS.includes(errorType)) return true;
  // Agent Platform: có thể thử model tiếp khi PERMISSION_DENIED
  if (provider === 'agent-platform' && errorType === 'PERMISSION_DENIED') return true;
  return false;
};

// Hàm tạo thông báo lỗi thân thiện
export const getFriendlyErrorMessage = (error: any): { type: string; title: string; message: string; suggestions: string[] } => {
  const errorType = parseApiError(error);

  switch (errorType) {
    case 'MODEL_OVERLOADED':
      return {
        type: 'overloaded',
        title: '⚡ Model đang quá tải',
        message: 'Model đang quá tải; app đang tự động thử model dự phòng.',
        suggestions: [
          '🔄 App sẽ tự động chuyển sang model dự phòng',
          '⏳ Nếu tất cả model đều quá tải, vui lòng đợi vài phút rồi thử lại'
        ]
      };

    case 'NOT_FOUND':
      return {
        type: 'not_found',
        title: '🔍 Model không khả dụng',
        message: 'Model hoặc endpoint không còn khả dụng. App đang thử model khác.',
        suggestions: [
          '🔄 App sẽ tự động chuyển sang model dự phòng',
          '📋 Kiểm tra phiên bản model trong Cài đặt'
        ]
      };

    case 'STREAM_INTERRUPTED':
      return {
        type: 'stream_interrupted',
        title: '🔄 Phản hồi AI bị gián đoạn',
        message: 'Kết nối tới model bị ngắt khi đang nhận phản hồi. App đang thử model dự phòng.',
        suggestions: [
          '🔄 App sẽ tự động thử lại bằng model dự phòng',
          '⏳ Nếu vẫn lặp lại, hãy thử lại sau ít phút'
        ]
      };

    case 'QUOTA_EXCEEDED':
      return {
        type: 'quota',
        title: '⚠️ Đã hết quota hoặc vượt giới hạn tốc độ',
        message: 'Đã hết quota hoặc vượt giới hạn tốc độ API. Vui lòng đợi rồi thử lại.',
        suggestions: [
          '🔑 Đăng nhập Gmail khác tại aistudio.google.com/api-keys → Lấy API key mới → Dán vào app để dùng tiếp',
          '⏰ Hoặc đợi đến ngày hôm sau khi quota được reset (thường reset lúc 0h giờ Mỹ)',
          '🔄 Bấm "Thử lại (đổi key)" để app tự xoay sang key dự phòng',
          '💳 Nâng cấp tài khoản Google AI Studio để có thêm quota'
        ]
      };

    case 'RATE_LIMIT':
      return {
        type: 'rate_limit',
        title: '🚦 Đang gửi yêu cầu quá nhanh',
        message: 'Bạn đang gửi quá nhiều yêu cầu trong thời gian ngắn. Hãy chờ một chút rồi thử lại.',
        suggestions: [
          '⏳ Đợi 30-60 giây rồi thử lại',
          '🔄 Không bấm nút nhiều lần liên tiếp'
        ]
      };

    case 'INVALID_API_KEY':
      return {
        type: 'auth',
        title: '🔐 API Key không hợp lệ hoặc đã hết hạn',
        message: 'API Key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại trong Cài đặt.',
        suggestions: [
          '🔑 Kiểm tra lại API Key đã nhập',
          '🆕 Tạo API Key mới tại Google AI Studio',
          '📋 Đảm bảo copy đầy đủ API Key (không thừa/thiếu ký tự)'
        ]
      };

    case 'PERMISSION_DENIED':
      return {
        type: 'permission',
        title: '🚫 Không có quyền truy cập',
        message: 'API key không có quyền truy cập dịch vụ hoặc model này. Google đã nhận key nhưng dự án/key chưa được cấp quyền.',
        suggestions: [
          '🔧 Kiểm tra API đã được bật trong Google Cloud Console',
          '💳 Kiểm tra billing đã kích hoạt',
          '🔑 Kiểm tra API restrictions trên key',
          '📋 Nếu dùng Agent Platform: đảm bảo đã bật Agent Platform API'
        ]
      };

    case 'INVALID_ARGUMENT':
      return {
        type: 'invalid_arg',
        title: '⚙️ Lỗi tham số yêu cầu',
        message: 'Yêu cầu gửi tới AI có tham số không hợp lệ.',
        suggestions: [
          '🔄 Thử lại với nội dung ngắn hơn',
          '📋 Kiểm tra model đang chọn có hỗ trợ tính năng này không'
        ]
      };

    case 'NETWORK_ERROR':
      return {
        type: 'network',
        title: '🌐 Lỗi kết nối mạng',
        message: 'Không thể kết nối đến máy chủ Google AI. Hãy kiểm tra kết nối internet của bạn.',
        suggestions: [
          '📶 Kiểm tra kết nối WiFi/Internet',
          '🔄 Thử làm mới trang (F5)',
          '🌍 Thử sử dụng mạng khác'
        ]
      };

    default:
      return {
        type: 'unknown',
        title: '❌ Đã xảy ra lỗi',
        message: error?.message || 'Có lỗi không xác định xảy ra khi gọi AI.',
        suggestions: [
          '🔄 Thử làm mới trang và thực hiện lại',
          '🔑 Kiểm tra API Key',
          '⏰ Đợi một lúc rồi thử lại'
        ]
      };
  }
};

let chatSession: Chat | null = null;
let currentApiKey: string | null = null;
let currentSelectedModel: string | null = null;
let currentProvider: AiProvider = 'gemini';
let history: any[] = []; // Store history to restore when switching models

export const initializeGeminiChat = (apiKey: string, selectedModel?: string, provider?: AiProvider) => {
  currentApiKey = apiKey;
  currentSelectedModel = selectedModel || FALLBACK_MODELS[0];
  currentProvider = provider || 'gemini';
  chatSession = null;
  history = []; // Reset history on new initialization
};

// Lấy lịch sử chat để lưu phiên làm việc
export const getChatHistory = (): any[] => {
  return [...history];
};

// Khôi phục lịch sử chat từ phiên đã lưu
export const setChatHistory = (savedHistory: any[]) => {
  history = savedHistory || [];
};

// Lấy config phù hợp cho từng model — tự động xử lý 3.x vs 2.x
const getModelConfig = (model: string) => {
  const cfg = getModelConfigSafe(model);
  const config: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
    maxOutputTokens: cfg.maxOutputTokens,
  };
  // Sampling params — chỉ cho Gemini 2.x (3.x đã deprecated)
  if (cfg.temperature !== undefined) config.temperature = cfg.temperature;
  if (cfg.topK !== undefined) config.topK = cfg.topK;
  if (cfg.topP !== undefined) config.topP = cfg.topP;
  // Với Gemini 3.x: Chỉ nên để thinkingLevel là 'LOW' hoặc 'MEDIUM' để phản hồi nhanh, không nghẽn token
  if (cfg.thinkingLevel) {
    config.thinkingConfig = { thinkingLevel: 'LOW' }; // Thay vì 'HIGH'
  } else if (cfg.thinkingBudget) {
    config.thinkingConfig = { thinkingBudget: cfg.thinkingBudget };
  }
  // ⚠️ Lưu ý: Tạm tắt googleSearch nếu dùng key miễn phí vì googleSearch ngốn quota rất nhanh và làm trễ phản hồi
  // if (currentProvider !== 'agent-platform') {
  //   config.tools = [{ googleSearch: {} }];
  // }
  return config;
};

const createChatSession = (model: string) => {
  if (!currentApiKey) throw new Error("API Key not found");

  const ai = createGoogleAiClient(currentApiKey, currentProvider);

  return ai.chats.create({
    model: model,
    config: getModelConfig(model),
    history: history
  });
};

// Sắp xếp models — chọn fallback list theo provider
const getOrderedModels = (): string[] => {
  const fallbackList = currentProvider === 'agent-platform'
    ? [...AGENT_PLATFORM_FALLBACK_MODELS]
    : [...FALLBACK_MODELS];

  if (!currentSelectedModel) return fallbackList;

  // Đưa model được chọn lên đầu, loại trùng
  const orderedModels = [currentSelectedModel];
  for (const model of fallbackList) {
    if (model !== currentSelectedModel) {
      orderedModels.push(model);
    }
  }
  return orderedModels;
};

// ============================================================
// TIMEOUT & ABORT CONFIGURATION
// ============================================================
const FIRST_CHUNK_TIMEOUT_MS = 45_000;   // 45s chờ kết nối / chunk đầu tiên
const INTER_CHUNK_TIMEOUT_MS = 45_000;   // 45s chờ giữa các chunk
const TOTAL_STREAM_TIMEOUT_MS = 600_000; // 10 phút tổng thời gian stream

let currentAbortController: AbortController | null = null;

/** Hủy stream đang chạy (gọi từ UI khi user muốn dừng) */
export const abortCurrentStream = () => {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
    console.log('🛑 Đã hủy stream theo yêu cầu người dùng.');
  }
};

/** Kiểm tra stream có đang chạy không */
export const isStreamActive = (): boolean => {
  return currentAbortController !== null && !currentAbortController.signal.aborted;
};

/**
 * Tạo promise timeout — reject sau ms mili giây
 */
const createTimeout = (ms: number, label: string): { promise: Promise<never>; clear: () => void } => {
  let timerId: ReturnType<typeof setTimeout>;
  const promise = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`⏰ Timeout: ${label} (${Math.round(ms / 1000)}s). Vui lòng thử lại.`));
    }, ms);
  });
  return { promise, clear: () => clearTimeout(timerId) };
};

/** Làm sạch HTML tags thừa từ AI output (từ SKKNPROTHT2025) */
const sanitizeAIOutput = (text: string): string => {
  let clean = text;
  // Chuyển <br>, <br/>, <br /> thành newline
  clean = clean.replace(/<br\s*\/?>/gi, '\n');
  // Loại bỏ các HTML tags phổ biến khác (giữ nội dung bên trong)
  clean = clean.replace(/<\/?(p|div|span|b|i|em|strong|u|s|del|ins|mark|sub|sup|small|big|center)(\s[^>]*)?>/gi, '');
  return clean;
};

/**
 * Gửi prompt đơn lẻ với streaming - KHÔNG dùng chat session hay history.
 * Mỗi lần gọi hoàn toàn độc lập, tránh context window bị đầy.
 * Dùng cho phụ lục và các tác vụ cần prompt lớn mà không cần ngữ cảnh hội thoại.
 * (Backport từ SKKNPROTHT2025 với timeout mới)
 */
export const sendSinglePromptStream = async (message: string, onChunk: (text: string) => void): Promise<string> => {
  if (!currentApiKey) {
    throw new Error("Không có API Key. Vui lòng nhập API key trong phần Cài đặt.");
  }

  let lastError: any = null;
  const modelsToTry = getOrderedModels();

  console.log(`🚀 [SinglePrompt] Bắt đầu. Thử ${modelsToTry.length} model: ${modelsToTry.join(' → ')}`);

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      console.log(`🤖 [SinglePrompt] Đang thử model [${i + 1}/${modelsToTry.length}]: ${model}`);

      const ai = createGoogleAiClient(currentApiKey, currentProvider);

      // Timeout cho lần gửi
      const sendTimeout = createTimeout(FIRST_CHUNK_TIMEOUT_MS, `[SinglePrompt] Chờ phản hồi từ ${model}`);
      let response: any;
      try {
        response = await Promise.race([
          ai.models.generateContentStream({
            model: model,
            config: getModelConfig(model),
            contents: [{ role: 'user', parts: [{ text: message }] }]
          }),
          sendTimeout.promise,
        ]);
      } finally {
        sendTimeout.clear();
      }

      let fullResponse = "";
      let receivedFirstChunk = false;
      const totalTimeout = createTimeout(TOTAL_STREAM_TIMEOUT_MS, '[SinglePrompt] Tổng thời gian stream quá dài');
      
      try {
        const iterator = response[Symbol.asyncIterator]();
        
        while (true) {
          const timeoutMs = receivedFirstChunk ? INTER_CHUNK_TIMEOUT_MS : FIRST_CHUNK_TIMEOUT_MS;
          const chunkTimeout = createTimeout(timeoutMs, `[SinglePrompt] Chờ chunk từ ${model}`);
          
          let result: IteratorResult<any>;
          try {
            result = await Promise.race([
              iterator.next(),
              chunkTimeout.promise,
              totalTimeout.promise,
            ]);
          } finally {
            chunkTimeout.clear();
          }
          
          if (result.done) break;
          
          const chunk = result.value;
          if (chunk.text) {
            receivedFirstChunk = true;
            const cleanText = sanitizeAIOutput(chunk.text);
            onChunk(cleanText);
            fullResponse += cleanText;
          }
        }
      } finally {
        totalTimeout.clear();
      }

      console.log(`✅ [SinglePrompt] Thành công với model ${model}, ${fullResponse.length} chars`);
      return fullResponse;

    } catch (error: any) {
      lastError = error;
      const errorType = parseApiError(error);
      console.error(`❌ [SinglePrompt] Model ${model} thất bại (${errorType}):`, error.message);

      if (errorType === 'INVALID_API_KEY') break;
      if (errorType === 'PERMISSION_DENIED' && currentProvider !== 'agent-platform') break;

      // Timeout → cho phép fallback
      if (error.message?.includes('Timeout')) {
        console.log(`⏭️ [SinglePrompt] Timeout — thử model tiếp theo...`);
        continue;
      }

      if (!isFallbackableError(errorType, currentProvider)) break;
      continue;
    }
  }

  console.error(`💀 [SinglePrompt] Tất cả models đều thất bại.`);
  throw lastError || new Error("Tất cả models đều thất bại. Vui lòng thử lại sau.");
};

export const sendMessageStream = async (
  message: string,
  onChunk: (text: string) => void,
  onRetry?: () => void,
) => {
  if (!currentApiKey) {
    throw new Error("Không có API Key. Vui lòng nhập API key trong phần Cài đặt.");
  }

  abortCurrentStream();
  const abortController = new AbortController();
  currentAbortController = abortController;

  let lastError: any = null;
  const modelsToTry = getOrderedModels();

  for (const model of modelsToTry) {
    if (abortController.signal.aborted) {
      throw new Error('Đã hủy yêu cầu.');
    }

    try {
      console.log(`🤖 Đang thử model: ${model}`);
      const ai = createGoogleAiClient(currentApiKey, currentProvider);
      chatSession = ai.chats.create({
        model: model,
        config: getModelConfig(model),
        history: history
      });

      // 1. Chờ kết nối ban đầu (tối đa 45s)
      const connectTimeout = createTimeout(45_000, `Kết nối tới model ${model}`);
      let responseStream: any;
      try {
        responseStream = await Promise.race([
          chatSession.sendMessageStream({ message }),
          connectTimeout.promise,
        ]);
      } finally {
        connectTimeout.clear();
      }

      let fullResponse = "";
      let receivedFirstChunk = false;

      // 2. Đọc từng chunk với Timeout cho mỗi chunk (tối đa 45s giữa 2 chunk)
      const iterator = responseStream[Symbol.asyncIterator]();
      while (true) {
        if (abortController.signal.aborted) {
          throw new Error('Đã hủy yêu cầu.');
        }

        const chunkTimeout = createTimeout(45_000, `Chờ phản hồi tiếp theo từ ${model}`);
        let chunkResult: IteratorResult<any>;
        try {
          chunkResult = await Promise.race([
            iterator.next(),
            chunkTimeout.promise
          ]);
        } finally {
          chunkTimeout.clear();
        }

        if (chunkResult.done) break;

        const chunk = chunkResult.value;
        if (chunk?.text) {
          if (!receivedFirstChunk) {
            receivedFirstChunk = true;
          }
          const cleanText = sanitizeAIOutput(chunk.text);
          onChunk(cleanText);
          fullResponse += cleanText;
        }
      }

      if (!fullResponse.trim()) {
        throw new Error("Model không phản hồi nội dung văn bản (hoặc bị chặn nội dung).");
      }

      history.push({ role: 'user', parts: [{ text: message }] });
      history.push({ role: 'model', parts: [{ text: fullResponse }] });
      currentAbortController = null;
      return;

    } catch (error: any) {
      console.error(`❌ Model ${model} thất bại:`, error.message || error);
      lastError = error;

      if (abortController.signal.aborted) {
        currentAbortController = null;
        throw new Error('Đã hủy yêu cầu.');
      }

      const errorType = parseApiError(error);
      if (!isFallbackableError(errorType, currentProvider) && !error.message?.includes('Timeout')) {
        currentAbortController = null;
        throw error;
      }
      onRetry?.();
      console.log(`⏭️ Lỗi ${errorType} — thử model tiếp theo...`);
      continue;
    }
  }

  currentAbortController = null;
  throw lastError || new Error("Tất cả models đều thất bại. Vui lòng kiểm tra lại quota hoặc thử lại sau.");
};

// Phân tích tài liệu để trích xuất thông tin cho SKKN (không dùng chat session)
export const analyzeDocumentForSKKN = async (
  apiKey: string,
  documentContent: string,
  documentType: 'reference' | 'template',
  selectedModel?: string,
  provider?: AiProvider
): Promise<string> => {
  const actualProvider: AiProvider = provider || (localStorage.getItem('google_ai_provider') as AiProvider) || 'gemini';
  const ai = createGoogleAiClient(apiKey, actualProvider);

  // Giới hạn nội dung để tránh vượt token limit
  const truncatedContent = documentContent.substring(0, 20000);

  const prompt = documentType === 'reference'
    ? `Bạn là chuyên gia phân tích tài liệu giáo dục. Hãy phân tích TÀI LIỆU THAM KHẢO sau và trích xuất thông tin hữu ích cho việc viết SKKN (Sáng kiến Kinh nghiệm):

📚 **TÀI LIỆU THAM KHẢO:**
${truncatedContent}

---

Hãy phân tích và trả về kết quả theo format sau:

## 📖 1. NỘI DUNG CHÍNH
- Liệt kê các chủ đề, khái niệm, kiến thức quan trọng
- Tóm tắt ý chính của tài liệu

## 🔧 2. PHƯƠNG PHÁP / KỸ THUẬT (nếu có)
- Các phương pháp dạy học được đề cập
- Kỹ thuật, chiến lược giảng dạy

## 📊 3. SỐ LIỆU / DỮ LIỆU QUAN TRỌNG (nếu có)
- Thống kê, bảng biểu
- Kết quả nghiên cứu, khảo sát

## 💡 4. GỢI Ý ÁP DỤNG CHO SKKN
- Cách tận dụng tài liệu này vào đề tài SKKN
- Các điểm có thể tham khảo, trích dẫn
- Ý tưởng phát triển giải pháp

⚠️ Lưu ý: Trả lời ngắn gọn, súc tích, tập trung vào thông tin hữu ích nhất.`
    : `Bạn là chuyên gia về quy trình viết SKKN. Hãy phân tích MẪU YÊU CẦU SKKN sau và trích xuất thông tin quan trọng:

📋 **MẪU YÊU CẦU SKKN:**
${truncatedContent}

---

Hãy phân tích và trả về kết quả theo format sau:

## 📝 1. CẤU TRÚC YÊU CẦU
- Các phần bắt buộc phải có
- Thứ tự các mục
- Quy định về format

## ⭐ 2. TIÊU CHÍ ĐÁNH GIÁ (nếu có)
- Các tiêu chí chấm điểm
- Thang điểm
- Trọng số các phần

## 📏 3. YÊU CẦU ĐẶC BIỆT
- Độ dài tối thiểu/tối đa
- Font chữ, cỡ chữ, căn lề
- Quy định về trích dẫn, tài liệu tham khảo

## ⚠️ 4. LƯU Ý QUAN TRỌNG
- Các điểm cần tuân thủ nghiêm ngặt
- Lỗi thường gặp cần tránh
- Điểm khác biệt so với mẫu chuẩn (nếu có)

⚠️ Lưu ý: Trả lời ngắn gọn, súc tích, tập trung vào thông tin cần thiết nhất.`;

  const fallbackList = actualProvider === 'agent-platform'
    ? [...AGENT_PLATFORM_FALLBACK_MODELS]
    : [...FALLBACK_MODELS];

  const modelsToTry = selectedModel
    ? [selectedModel, ...fallbackList.filter(m => m !== selectedModel)]
    : [...fallbackList];

  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt
      });

      return response.text || 'Không thể phân tích tài liệu. Vui lòng thử lại.';
    } catch (error: any) {
      lastError = error;
      const errorType = parseApiError(error);
      if (errorType === 'INVALID_API_KEY') break;
      if (errorType === 'PERMISSION_DENIED' && actualProvider !== 'agent-platform') break;
      if (i < modelsToTry.length - 1) continue;
    }
  }

  console.error('Lỗi phân tích tài liệu:', lastError);
  throw new Error(getFriendlyErrorMessage(lastError).message);
};

// Interface cho cấu trúc mục SKKN (import từ types.ts nếu cần)
interface SKKNSection {
  id: string;
  level: number;
  title: string;
  suggestedContent?: string;
}

// Trích xuất cấu trúc mục từ mẫu SKKN
export const extractSKKNStructure = async (
  apiKey: string,
  templateContent: string,
  selectedModel?: string,
  provider?: AiProvider
): Promise<{ sections: SKKNSection[], contentGuidelines?: string, pageLimitFromTemplate?: number, headerFields?: Record<string, string> }> => {
  const actualProvider: AiProvider = provider || (localStorage.getItem('google_ai_provider') as AiProvider) || 'gemini';
  const ai = createGoogleAiClient(apiKey, actualProvider);

  // Giới hạn nội dung để tránh vượt token limit
  const truncatedContent = templateContent.substring(0, 25000);

  const prompt = `Bạn là chuyên gia phân tích cấu trúc tài liệu SKKN (Sáng kiến Kinh nghiệm).

NHIỆM VỤ: Phân tích MẪU YÊU CẦU SKKN sau và TRÍCH XUẤT ĐẦY ĐỦ thông tin.

═══════════════════════════════════════════════════════════════
MẪU SKKN CẦN PHÂN TÍCH:
═══════════════════════════════════════════════════════════════
${truncatedContent}
═══════════════════════════════════════════════════════════════

TRẢ VỀ JSON OBJECT với format CHÍNH XÁC sau (KHÔNG có text khác, CHỈ JSON):

{
  "sections": [
    {"id": "1", "level": 1, "title": "I. Mô tả giải pháp đã biết", "suggestedContent": "Nêu rõ giải pháp/cách làm cũ đang được áp dụng..."},
    {"id": "2", "level": 1, "title": "II. Nội dung giải pháp đề nghị công nhận sáng kiến", "suggestedContent": ""},
    {"id": "2.1", "level": 2, "title": "II.1 Nội dung giải pháp đề nghị công nhận sáng kiến", "suggestedContent": "Trình bày chi tiết nội dung giải pháp mới"},
    ...
  ],
  "contentGuidelines": "Tóm tắt ngắn gọn các hướng dẫn viết nội dung nếu mẫu có ghi (VD: yêu cầu mô tả giải pháp cũ, nêu tính mới, so sánh trước sau...)",
  "pageLimitFromTemplate": 0,
  "headerFields": {
    "hoTen": "Họ và tên",
    "chucVu": "Chức vụ, đơn vị công tác",
    "tenSangKien": "Tên sáng kiến",
    "linhVuc": "Lĩnh vực áp dụng sáng kiến",
    "donViApDung": "Đơn vị áp dụng sáng kiến",
    "thoiGian": "Thời gian áp dụng"
  }
}

QUY TẮC QUAN TRỌNG TỐI CAO:

📋 PHẦN sections:
1. BỎ QUA CÁC THÔNG TIN HÀNH CHÍNH trong sections (Họ tên, Chức vụ, Đơn vị...) - đưa chúng vào headerFields.
2. CHỈ TRÍCH XUẤT cấu trúc phần NỘI DUNG CỐT LÕI cần viết (Mô tả giải pháp, Nội dung giải pháp, Tính mới, Hiệu quả, Khả năng nhân rộng...)
3. level 1: Phần lớn nhất. level 2: Mục con cấp 1. level 3: Mục con cấp 2.
4. Giữ NGUYÊN tiêu đề gốc trong mẫu.
5. suggestedContent: Tóm tắt hướng dẫn viết nếu mẫu có ghi cho mục đó.

📄 PHẦN contentGuidelines:
- Tóm tắt toàn bộ hướng dẫn/yêu cầu viết mà mẫu đề cập (nếu có).
- VD: "Mẫu yêu cầu mô tả giải pháp cũ trước, sau đó nêu giải pháp mới, so sánh tính mới, nêu hiệu quả..."

📏 PHẦN pageLimitFromTemplate:
- Nếu mẫu có ghi rõ giới hạn số trang (VD: "không quá 15 trang", "từ 10-20 trang"), trả về số trang tối đa.
- Nếu không ghi, trả về 0.

👤 PHẦN headerFields:
- Trích xuất TÊN các trường thông tin hành chính mà mẫu yêu cầu điền (Họ tên, Chức vụ, Đơn vị, Lĩnh vực...).
- Key: tên viết tắt camelCase. Value: tên đầy đủ tiếng Việt như mẫu ghi.
- CHỈ lấy các trường mà MẪU thực sự có, KHÔNG tự bịa thêm.

CHỈ TRẢ VỀ JSON OBJECT, KHÔNG giải thích, KHÔNG markdown code block.

BẮT ĐẦU JSON NGAY:`;

  const fallbackList = actualProvider === 'agent-platform'
    ? [...AGENT_PLATFORM_FALLBACK_MODELS]
    : [...FALLBACK_MODELS];

  const modelsToTry = selectedModel
    ? [selectedModel, ...fallbackList.filter(m => m !== selectedModel)]
    : [...fallbackList];

  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt
      });

      const responseText = response.text || '{}';

      // Cố gắng parse JSON từ response
      let jsonText = responseText.trim();

      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Try to find JSON object first
      const jsonObjMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonObjMatch) {
        jsonText = jsonObjMatch[0];
      }

      const parsed = JSON.parse(jsonText);

      // Nếu AI trả về object có sections
      if (parsed && parsed.sections && Array.isArray(parsed.sections)) {
        const sections: SKKNSection[] = parsed.sections.filter(
          (s: any) => s.id && s.title && typeof s.level === 'number'
        );
        return {
          sections,
          contentGuidelines: parsed.contentGuidelines || '',
          pageLimitFromTemplate: typeof parsed.pageLimitFromTemplate === 'number' ? parsed.pageLimitFromTemplate : 0,
          headerFields: parsed.headerFields || {},
        };
      }

      // Fallback: Nếu AI vẫn trả về array cũ
      if (Array.isArray(parsed)) {
        const sections: SKKNSection[] = parsed.filter(
          (s: any) => s.id && s.title && typeof s.level === 'number'
        );
        return { sections };
      }

      return { sections: [] };

    } catch (error: any) {
      lastError = error;
      const errorType = parseApiError(error);
      if (errorType === 'INVALID_API_KEY') break;
      if (errorType === 'PERMISSION_DENIED' && actualProvider !== 'agent-platform') break;
      if (i < modelsToTry.length - 1) continue;
    }
  }

  console.error('Lỗi trích xuất cấu trúc SKKN:', lastError);
  return { sections: [] };
};

/**
 * Phân tích tên đề tài SKKN
 * Theo quy trình kiểm tra 3 lớp từ quy trinh kiem tra.txt
 */
export const analyzeTitleSKKN = async (
  apiKey: string,
  title: string,
  subject?: string,
  level?: string,
  selectedModel?: string,
  provider?: AiProvider
): Promise<TitleAnalysisResult> => {
  const actualProvider: AiProvider = provider || (localStorage.getItem('google_ai_provider') as AiProvider) || 'gemini';
  const ai = createGoogleAiClient(apiKey, actualProvider);

  const prompt = `Bạn là chuyên gia phân tích tên đề tài Sáng kiến kinh nghiệm (SKKN) với 20 năm kinh nghiệm.

## THÔNG TIN ĐỀ TÀI CẦN PHÂN TÍCH:
- Tên đề tài: "${title}"
${subject ? `- Môn học/Lĩnh vực: ${subject}` : ''}
${level ? `- Cấp học: ${level}` : ''}

## QUY TRÌNH KIỂM TRA 3 LỚP:

### LỚP 1: DATABASE NỘI BỘ (Đề tài phổ biến)
So sánh với database đề tài tích hợp:

🔴 TRÙNG LẶP CAO (80-90%):
- "Ứng dụng AI trong dạy học môn [X]"
- "Sử dụng ChatGPT hỗ trợ [công việc Y]"
- "Ứng dụng Canva thiết kế bài giảng"
- "Sử dụng Kahoot/Quizizz tăng tính tương tác"
- "Dạy học trực tuyến qua Google Meet/Zoom"
- "Ứng dụng Google Classroom quản lý lớp học"

🟡 TRÙNG LẶP TRUNG BÌNH (60-70%):
- "Dạy học theo dự án (PBL) môn [X]"
- "Phương pháp dạy học tích cực môn [X]"
- "Dạy học theo nhóm hiệu quả"
- "Phát triển năng lực tự học của học sinh"

🟢 TRÙNG LẶP THẤP (20-40%):
- "Kết hợp AI và PBL trong dạy STEM lớp 8"
- Các đề tài kết hợp nhiều phương pháp
- Đề tài có đối tượng đặc biệt (HS khuyết tật, vùng cao)

### LỚP 2: TÌM KIẾM ONLINE (Mô phỏng)
Ước tính số lượng đề tài tương tự trên:
- Cổng SKKN Bộ GD&ĐT
- Sở GD&ĐT các tỉnh
- Tạp chí Giáo dục
- Google Scholar

### LỚP 3: WEBSITE CHUYÊN NGÀNH
- violet.vn, tailieu.vn, 123doc.net
- thuvienvatly.com, giaoducthoidai.vn

## CHẤM ĐIỂM (TỔNG 100 ĐIỂM):

1. **Độ cụ thể (max 25đ)**:
   - 25: Có đầy đủ: môn học, cấp học, công cụ, phạm vi cụ thể
   - 20: Có 3/4 yếu tố
   - 15: Có 2/4 yếu tố
   - 10: Chỉ có 1 yếu tố cụ thể
   - 5: Quá chung chung

2. **Tính mới (max 30đ)**:
   - 30: Chưa ai làm, hoàn toàn mới
   - 25: Kết hợp 2-3 yếu tố mới
   - 20: Có 1 điểm mới rõ ràng
   - 15: Cải tiến từ đề tài cũ
   - 10: Đã có nhiều người làm
   - 5: Trùng lặp hoàn toàn

3. **Tính khả thi (max 25đ)**:
   - 25: Rất dễ thực hiện, nguồn lực sẵn có
   - 20: Khả thi, cần chuẩn bị ít
   - 15: Khả thi nhưng cần thời gian/chi phí
   - 10: Khó khăn, cần nhiều nguồn lực
   - 5: Không khả thi

4. **Độ rõ ràng (max 20đ)**:
   - 20: Tên ngắn gọn, dễ hiểu, có từ khóa rõ
   - 15: Rõ ràng nhưng hơi dài
   - 10: Có thể hiểu nhưng chưa tối ưu
   - 5: Khó hiểu, rườm rà

## PHÁT HIỆN VẤN ĐỀ:
- Từ ngữ chung chung: "ứng dụng công nghệ", "nâng cao chất lượng", "một số biện pháp"
- Từ quá tham vọng: "toàn diện", "cách mạng hóa", "đột phá"
- Công cụ lỗi thời: "băng hình", "đĩa CD", "máy chiếu overhead"
- Công cụ quá phổ biến: "ChatGPT", "Kahoot", "Google Classroom"

## ĐỀ XUẤT 5 TÊN THAY THẾ (Công thức):
1. Cụ thể hóa: Thêm [Cấp học] + [Bối cảnh đặc biệt]
2. Kết hợp: [Công nghệ A] + [Phương pháp B] + [Môn học C]
3. Đối tượng đặc biệt: [Phương pháp] + [HS đặc thù] + [Mục tiêu]
4. Bài học cụ thể: [Phương pháp] + [Bài/Chương cụ thể] + [Công cụ]
5. Tạo công cụ mới: Thiết kế [Công cụ tự tạo] + [Mục đích]

TRẢ VỀ JSON (KHÔNG có markdown code block, CHỈ JSON thuần):
{
  "structure": {
    "action": "Từ khóa hành động (hoặc rỗng)",
    "tool": "Công cụ/Phương tiện (hoặc rỗng)",
    "subject": "Môn học/Lĩnh vực",
    "scope": "Phạm vi (lớp, cấp học)",
    "purpose": "Mục đích"
  },
  "duplicateLevel": "Cao|Trung bình|Thấp",
  "duplicateDetails": "Giải thích chi tiết về mức độ trùng lặp",
  "scores": {
    "specificity": <điểm>,
    "novelty": <điểm>,
    "feasibility": <điểm>,
    "clarity": <điểm>,
    "total": <tổng điểm>
  },
  "scoreDetails": [
    { "category": "Độ cụ thể", "score": <điểm>, "maxScore": 25, "reason": "lý do" },
    { "category": "Tính mới", "score": <điểm>, "maxScore": 30, "reason": "lý do" },
    { "category": "Tính khả thi", "score": <điểm>, "maxScore": 25, "reason": "lý do" },
    { "category": "Độ rõ ràng", "score": <điểm>, "maxScore": 20, "reason": "lý do" }
  ],
  "problems": ["Vấn đề 1", "Vấn đề 2"],
  "suggestions": [
    { "title": "Tên đề tài thay thế 1", "strength": "Điểm mạnh", "predictedScore": <điểm dự kiến> },
    { "title": "Tên đề tài thay thế 2", "strength": "Điểm mạnh", "predictedScore": <điểm dự kiến> },
    { "title": "Tên đề tài thay thế 3", "strength": "Điểm mạnh", "predictedScore": <điểm dự kiến> },
    { "title": "Tên đề tài thay thế 4", "strength": "Điểm mạnh", "predictedScore": <điểm dự kiến> },
    { "title": "Tên đề tài thay thế 5", "strength": "Điểm mạnh", "predictedScore": <điểm dự kiến> }
  ],
  "relatedTopics": ["Đề tài mới nổi 1", "Đề tài mới nổi 2", "Đề tài mới nổi 3"],
  "overallVerdict": "Kết luận tổng quan và lời khuyên"
}

BẮT ĐẦU JSON NGAY:`;

  const fallbackList = actualProvider === 'agent-platform'
    ? [...AGENT_PLATFORM_FALLBACK_MODELS]
    : [...FALLBACK_MODELS];

  const modelsToTry = selectedModel
    ? [selectedModel, ...fallbackList.filter(m => m !== selectedModel)]
    : [...fallbackList];

  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      console.log(`🤖 [analyzeTitleSKKN] Đang phân tích bằng model [${i + 1}/${modelsToTry.length}]: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt
      });

      const responseText = response.text || '{}';

      // Xử lý response để lấy JSON
      let jsonText = responseText.trim();

      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Find JSON object in response
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const result: TitleAnalysisResult = JSON.parse(jsonText);
      console.log(`✅ [analyzeTitleSKKN] Phân tích thành công bằng model: ${model}`);
      return result;

    } catch (error: any) {
      lastError = error;
      const errorType = parseApiError(error);
      console.warn(`⚠️ [analyzeTitleSKKN] Model ${model} gặp lỗi (${errorType}):`, error?.message || error);

      // Nếu lỗi auth dừng ngay
      if (errorType === 'INVALID_API_KEY') {
        break;
      }
      if (errorType === 'PERMISSION_DENIED' && actualProvider !== 'agent-platform') {
        break;
      }

      // Nếu còn model dự phòng, tự động chuyển sang model tiếp theo
      if (i < modelsToTry.length - 1) {
        console.log(`🔄 [analyzeTitleSKKN] Tự động thử model dự phòng [${i + 2}/${modelsToTry.length}]: ${modelsToTry[i + 1]}`);
        continue;
      }
    }
  }

  console.error('Lỗi phân tích đề tài (đã thử tất cả model dự phòng):', lastError);
  throw new Error(getFriendlyErrorMessage(lastError).message);
};
