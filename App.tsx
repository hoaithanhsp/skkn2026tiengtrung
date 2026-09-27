import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { UserInfo, GenerationStep, GenerationState, SKKNTemplate, SolutionsState, WizardStep } from './types';

import { STEPS_INFO, SOLUTION_MODE_PROMPT, FALLBACK_MODELS, AGENT_PLATFORM_MODELS, HIGHER_ED_LEVELS, HIGHER_ED_SYSTEM_INSTRUCTION, type AiProvider } from './constants';

import { initializeGeminiChat, sendMessageStream, getFriendlyErrorMessage, parseApiError, getChatHistory, setChatHistory, abortCurrentStream } from './services/geminiService';

import { apiKeyManager } from './services/apiKeyManager';

import { getSubjectInfo } from './data/subjectsData';

import { curriculumValidator } from './services/curriculumValidator';

import { OUTLINE_GUIDE, INTRO_GUIDE, THEORY_GUIDE, REALITY_GUIDE, RESULT_GUIDE, CONCLUSION_GUIDE, APPENDIX_GUIDE, NATURAL_WRITING_TECHNIQUES } from './data/skknKnowledgeBase';
import { STANDARD_MOET_TIENG_TRUNG_TEMPLATE } from './data/standardMoetTiengTrungTemplate';
import { OFFICIAL_TIENG_TRUNG_DOCS_BUNDLE } from './data/officialTiengTrungDocuments';

import { SKKNForm } from './components/SKKNForm';

import { TemplateUploadStep } from './components/TemplateUploadStep';

import { DocumentPreview } from './components/DocumentPreview';

import { Button } from './components/Button';

import { ApiKeyModal } from './components/ApiKeyModal';

import { Download, ChevronRight, Wand2, FileText, CheckCircle, RefreshCw, Settings, AlertTriangle, Save, Trash2 } from 'lucide-react';



import { LockScreen } from './components/LockScreen';



// Helper: Truncate text dài cho AI prompt - giữ phần đầu (nội dung chính) và thông báo lược bớt

const MAX_REF_DOCS_FOR_PROMPT = 80000; // ~80K ký tự tối đa cho tài liệu tham khảo trong prompt

const VIETNAMESE_MENU_LABELS: Record<string, string> = {
  '1': 'THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM',
  '2': 'TÓM TẮT SÁNG KIẾN',
  '3': 'CHƯƠNG I: MỞ ĐẦU',
  '3.1': '1. Lý do chọn đề tài',
  '3.2': '2. Mục đích và nhiệm vụ nghiên cứu',
  '3.3': '3. Đối tượng và phạm vi nghiên cứu',
  '3.4': '4. Phương pháp nghiên cứu',
  '3.5': '5. Điểm mới và đóng góp khoa học',
  '4': 'CHƯƠNG II: CƠ SỞ LÝ LUẬN',
  '4.1': '1. Cơ sở lý thuyết',
  '4.2': '2. Cơ sở pháp lý và yêu cầu chương trình',
  '5': 'CHƯƠNG III: THỰC TRẠNG VẤN ĐỀ',
  '6': 'CHƯƠNG IV: CÁC GIẢI PHÁP',
  '6.1': '1. Phân tích nguyên nhân lỗi',
  '6.2': '2. Giải pháp 1',
  '6.3': '3. Giải pháp 2',
  '6.4': '4. Giải pháp 3',
  '6.5': '5. Giải pháp 4',
  '6.6': '6. Giải pháp 5',
  '7': 'CHƯƠNG V: HIỆU QUẢ VÀ KẾT LUẬN',
  '7.1': '1. Kết quả thực nghiệm',
  '7.2': '2. Đánh giá định tính',
  '7.3': '3. Bài học kinh nghiệm và khả năng nhân rộng',
  '7.4': '4. Kết luận và khuyến nghị',
  '8': 'TÀI LIỆU THAM KHẢO',
  '9': 'PHỤ LỤC SÁNG KIẾN KINH NGHIỆM',
};



const truncateForPrompt = (text: string, maxChars: number = MAX_REF_DOCS_FOR_PROMPT): string => {

  if (!text || text.length <= maxChars) return text;



  const truncated = text.substring(0, maxChars);

  const removedChars = text.length - maxChars;

  const estimatedPages = Math.round(removedChars / 2500); // ~2500 ký tự/trang A4



  return truncated + `\n\n[... ĐÃ LƯỢC BỚT ${removedChars.toLocaleString()} KĐ TỰ (~${estimatedPages} trang) DO QUĐ DÀI. Nội dung phía trên đã đủ để tham khảo các ý chính ...]`;

};



// SessionStorage key cho tài liệu tham khảo lớn

const SESSION_REF_DOCS_KEY = 'skkn_ref_docs';

const SESSION_REF_NAMES_KEY = 'skkn_ref_file_names';



// LocalStorage key cho lưu/khôi phục phiên làm việc

const SESSION_SAVE_KEY = 'skkn_session_data';

const AUTO_WRITE_NEXT_KEY = 'skkn_auto_write_next';



// Interface cho session data

interface SessionData {

  userInfo: Omit<UserInfo, 'referenceDocuments'> & { hasReferenceDocuments: boolean };

  state: {

    step: GenerationStep;

    messages: Array<{ role: string; text: string }>;

    fullDocument: string;

  };

  solutionsState: SolutionsState;

  appendixDocument: string;

  outlineFeedback: string;

  chatHistory: any[];

  savedAt: string;

}



const App: React.FC = () => {

  // Lock Screen State

  const [isUnlocked, setIsUnlocked] = useState(false);

  const [checkingAuth, setCheckingAuth] = useState(true);



  // Wizard Step State (Template-First flow)

  const [wizardStep, setWizardStep] = useState<WizardStep>(WizardStep.UPLOAD_TEMPLATE);

  const [templateFileName, setTemplateFileName] = useState('');

  const [templateSectionsCount, setTemplateSectionsCount] = useState(0);



  // Session Restore State

  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const [pendingSessionData, setPendingSessionData] = useState<SessionData | null>(null);

  const [sessionSavedAt, setSessionSavedAt] = useState<string | null>(null);



  // API Key State

  const [apiKey, setApiKey] = useState('');

  const [showApiModal, setShowApiModal] = useState(false);

  const [selectedModel, setSelectedModel] = useState(FALLBACK_MODELS[0]);
  const [currentProvider, setCurrentProvider] = useState<AiProvider>('gemini');



  // Check LocalStorage on Mount

  useEffect(() => {

    const authState = localStorage.getItem('skkn_app_unlocked');

    if (authState === 'true') {

      setIsUnlocked(true);

    }



    // Load API key từ localStorage hoặc .env

    const savedKey = localStorage.getItem('gemini_api_key');

    const savedModel = localStorage.getItem('selected_model');



    if (savedKey) {

      setApiKey(savedKey);

    } else {

      // Thử lấy key từ biến môi trưĐng (.env)

      const envKeys = (import.meta.env.VITE_GEMINI_API_KEYS || '').split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);

      if (envKeys.length > 0) {

        const firstEnvKey = envKeys[0];

        setApiKey(firstEnvKey);

        localStorage.setItem('gemini_api_key', firstEnvKey);

        console.log('🔑 Tự động sử dụng API key từ biến môi trưĐng');

      } else {

        // Không có key nào → hiển thị modal bắt buộc nhập

        setShowApiModal(true);

      }

    }



    // Load provider
    const savedProvider = (localStorage.getItem('google_ai_provider') || 'gemini') as AiProvider;
    setCurrentProvider(savedProvider);

    // Đồng bộ key đã lưu vào apiKeyManager để tránh xoay nhầm sang backup key cũ
    if (savedKey && savedProvider === 'gemini') {
      apiKeyManager.addKey(savedKey, 'Key của tôi');
      apiKeyManager.setActiveKey(savedKey);
    }

    if (savedModel) {
      const validModels = savedProvider === 'agent-platform' ? [...AGENT_PLATFORM_MODELS] : FALLBACK_MODELS;
      if (validModels.includes(savedModel)) {
        setSelectedModel(savedModel);
      }
    }



    // Kiểm tra phiên làm việc đã lưu

    try {

      const savedSession = localStorage.getItem(SESSION_SAVE_KEY);

      if (savedSession) {

        const sessionData: SessionData = JSON.parse(savedSession);

        // Chỉ hiện modal khôi phục nếu phiên có tiến trình (step > INPUT_FORM)

        if (sessionData.state && sessionData.state.step > GenerationStep.INPUT_FORM) {

          setPendingSessionData(sessionData);

          setShowRestoreModal(true);

        }

      }

    } catch (e) {

      console.warn('Không thể đĐc phiên đã lưu:', e);

      localStorage.removeItem(SESSION_SAVE_KEY);

    }



    setCheckingAuth(false);

  }, []);



  const handleSaveApiKey = (key: string, model: string, provider?: AiProvider) => {
    const resolvedProvider = provider || 'gemini';
    // Key đã được lưu riêng theo provider bởi ApiKeyModal
    setApiKey(key);
    setSelectedModel(model);
    setCurrentProvider(resolvedProvider);
    setShowApiModal(false);

    // 🆕 ĐỒNG BỘ VÀO apiKeyManager để không bị xoay nhầm sang key cũ đã chết
    if (resolvedProvider === 'gemini') {
      apiKeyManager.addKey(key, 'Key của tôi');
      apiKeyManager.setActiveKey(key);
    }

    // Reinitialize chat với provider mới
    if (state.error) {
      setState(prev => ({ ...prev, error: null }));
    }
    initializeGeminiChat(key, model, resolvedProvider);
  };



  const handleLogin = (username: string) => {

    localStorage.setItem('skkn_app_unlocked', 'true');

    localStorage.setItem('skkn_logged_user', username);

    setIsUnlocked(true);

  };



  const [userInfo, setUserInfo] = useState<UserInfo>({

    topic: '',

    subject: '',

    level: '',

    grade: '',

    school: '',

    location: '',

    facilities: '',

    textbook: '',

    researchSubjects: '',

    timeframe: '',

    applyAI: '',

    focus: '',

    referenceDocuments: '',

    skknTemplate: '',

    specialRequirements: '',

    pageLimit: '', // Số trang giới hạn (để trống = không giới hạn)

    includePracticalExamples: false, // Thêm ví dụ thực tế

    includeStatistics: false, // Bổ sung bảng biểu thống kê

    requirementsConfirmed: false, // Đã xác nhận yêu cầu

    numSolutions: 3, // Mặc định viết 3 giải pháp

    customTemplate: undefined // Cấu trúc mẫu SKKN tùy chỉnh (đã trích xuất)

  });



  // Khôi phục referenceDocuments từ sessionStorage khi mount

  useEffect(() => {

    try {

      const savedRefDocs = sessionStorage.getItem(SESSION_REF_DOCS_KEY);

      if (savedRefDocs && !userInfo.referenceDocuments) {

        setUserInfo(prev => ({ ...prev, referenceDocuments: savedRefDocs }));

        console.log(`📄 Đã khôi phục tài liệu tham khảo từ session (${(savedRefDocs.length / 1024).toFixed(1)}KB)`);

      }

    } catch (e) {

      console.warn('Không thể khôi phục tài liệu tham khảo:', e);

    }

  }, []);



  // Lưu referenceDocuments vào sessionStorage khi thay đổi

  useEffect(() => {

    try {

      if (userInfo.referenceDocuments) {

        sessionStorage.setItem(SESSION_REF_DOCS_KEY, userInfo.referenceDocuments);

      } else {

        sessionStorage.removeItem(SESSION_REF_DOCS_KEY);

      }

    } catch (e) {

      console.warn('Text quá lớn cho sessionStorage, bĐ qua persistence:', e);

    }

  }, [userInfo.referenceDocuments]);



  const [state, setState] = useState<GenerationState>({

    step: GenerationStep.INPUT_FORM,

    messages: [],

    fullDocument: '',

    isStreaming: false,

    error: null

  });



  const [outlineFeedback, setOutlineFeedback] = useState("");

  const [autoWriteNext, setAutoWriteNext] = useState(() => localStorage.getItem(AUTO_WRITE_NEXT_KEY) === 'true');
  const autoWriteNextRef = useRef(autoWriteNext);
  const autoWriteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestGenerateNextSectionRef = useRef<() => Promise<void>>(async () => {});



  // Phụ lục riêng biệt

  const [appendixDocument, setAppendixDocument] = useState('');

  const [isAppendixLoading, setIsAppendixLoading] = useState(false);



  // State quản lý từng giải pháp riêng biệt

  const [solutionsState, setSolutionsState] = useState<SolutionsState>({

    solution1: null,

    solution2: null,

    solution3: null,

    solution4: null,

    solution5: null,

  });



  // ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

  // CUSTOM TEMPLATE DYNAMIC STEPS LOGIC

  // ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

  const customTemplateData = useMemo(() => {

    try {

      return userInfo.customTemplate ? JSON.parse(userInfo.customTemplate) as SKKNTemplate : null;

    } catch { return null; }

  }, [userInfo.customTemplate]);



  const validCustomSections = useMemo(() => {

    if (!customTemplateData || !customTemplateData.sections) return [];



    // Thuật toán gộp mục an toàn tối đa: 

    // - Lấy mục Level 1 NẾU nó KHÔNG có mục con (thuộc mĐi level cao hơn nó).

    // - Lấy mục Level >= 2, nhưng sẽ BỎ QUA TẤT CẢ mục con bên trong nó (để tránh băm quá nát như tiểu mục a,b,c).

    // Thuật toán này sẽ chạy đúng ngay cả khi AI đánh nhầm Level của II.1 thành Level 3 thay vì Level 2.

    const result = [];

    const sections = customTemplateData.sections;



    for (let i = 0; i < sections.length; i++) {

      const current = sections[i];



      let hasChild = false;

      if (i + 1 < sections.length && sections[i + 1].level > current.level) {

        hasChild = true;

      }



      if (current.level === 1) {

        if (!hasChild) {

          result.push(current);

        }

      } else {

        // Push mục hiện tại (>= 2)

        result.push(current);



        // BĐ qua tất cả các mục con của nó

        let nextIdx = i + 1;

        while (nextIdx < sections.length && sections[nextIdx].level > current.level) {

          nextIdx++;

        }

        i = nextIdx - 1; // Sẽ được i++ bởi vòng lặp for

      }

    }



    return result.length > 0 ? result : sections;

  }, [customTemplateData]);



  const isCustomFlow = validCustomSections.length > 0;

  const isChineseSimplifiedHighSchoolSkkn = useMemo(() => {
    const context = `${userInfo.subject} ${userInfo.level} ${customTemplateData?.name || ''}`.toLocaleLowerCase('vi-VN');
    return userInfo.level === 'THPT' && (
      context.includes('tiếng trung') ||
      context.includes('tiếng hán') ||
      context.includes('中文') ||
      context.includes('汉语')
    );
  }, [customTemplateData?.name, userInfo.level, userInfo.subject]);

  useEffect(() => {
    autoWriteNextRef.current = autoWriteNext;
    localStorage.setItem(AUTO_WRITE_NEXT_KEY, String(autoWriteNext));

    if (!autoWriteNext && autoWriteTimerRef.current) {
      clearTimeout(autoWriteTimerRef.current);
      autoWriteTimerRef.current = null;
    }

    return () => {
      if (autoWriteTimerRef.current) {
        clearTimeout(autoWriteTimerRef.current);
        autoWriteTimerRef.current = null;
      }
    };
  }, [autoWriteNext]);

  const currentStepsInfo = useMemo(() => {

    if (!isCustomFlow) return STEPS_INFO;



    const info: Record<number, { label: string, description: string }> = {

      0: { label: "Thông tin", description: "Thiết lập thông tin cơ bản" },

      1: { label: "Lập Dàn Ý", description: "Xây dựng khung sườn cho SKKN" },

    };



    validCustomSections.forEach((section: any, idx: number) => {

      info[2 + idx] = {

        label: VIETNAMESE_MENU_LABELS[section.id] || (section.title.length > 25 ? section.title.substring(0, 25) + '...' : section.title),

        description: `Viết mục: ${VIETNAMESE_MENU_LABELS[section.id] || section.title}`

      };

    });



    const appendixStep = 2 + validCustomSections.length;

    const completedStep = appendixStep + 1;

    info[appendixStep] = { label: "Tạo Phụ lục", description: "Tài liệu phụ lục" };

    info[completedStep] = { label: "Hoàn tất", description: "Đã xong" };



    return info;

  }, [isCustomFlow, validCustomSections]);



  const COMPLETED_STEP_ID = isCustomFlow ? 2 + validCustomSections.length + 1 : GenerationStep.COMPLETED;

  const scheduleAutoWriteNext = useCallback((nextStep: number) => {
    if (!autoWriteNextRef.current || nextStep >= COMPLETED_STEP_ID) return;

    if (autoWriteTimerRef.current) {
      clearTimeout(autoWriteTimerRef.current);
    }

    autoWriteTimerRef.current = setTimeout(() => {
      autoWriteTimerRef.current = null;
      if (autoWriteNextRef.current) {
        latestGenerateNextSectionRef.current();
      }
    }, 800);
  }, [COMPLETED_STEP_ID]);

  useEffect(() => {
    if (autoWriteNext && state.step === GenerationStep.OUTLINE && !state.isStreaming && state.fullDocument.trim()) {
      scheduleAutoWriteNext(state.step + 1);
    }
  }, [autoWriteNext, scheduleAutoWriteNext, state.fullDocument, state.isStreaming, state.step]);





  // ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

  // SESSION PERSISTENCE: Tự động lưu phiên vào localStorage

  // ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



  // Hàm lưu phiên

  const saveSession = useCallback(() => {

    // Chỉ lưu khi đã bắt đầu làm việc (không lưu khi đang ở form nhập)

    if (state.step <= GenerationStep.INPUT_FORM || state.isStreaming) return;



    try {

      const sessionData: SessionData = {

        userInfo: {

          ...userInfo,

          referenceDocuments: '', // Không lưu ref docs (quá lớn, đã có sessionStorage)

          hasReferenceDocuments: !!userInfo.referenceDocuments,

        } as any,

        state: {

          step: state.step,

          messages: state.messages,

          fullDocument: state.fullDocument,

        },

        solutionsState,

        appendixDocument,

        outlineFeedback,

        chatHistory: getChatHistory(),

        savedAt: new Date().toISOString(),

      };



      localStorage.setItem(SESSION_SAVE_KEY, JSON.stringify(sessionData));

      setSessionSavedAt(new Date().toLocaleTimeString('vi-VN'));

      console.log('💾 Đã lưu phiên làm việc:', sessionData.state.step);

    } catch (e) {

      console.warn('Không thể lưu phiên (có thể do dữ liệu quá lớn):', e);

    }

  }, [state.step, state.messages, state.fullDocument, state.isStreaming, userInfo, solutionsState, appendixDocument, outlineFeedback]);



  // Tự động lưu khi state thay đổi (debounce 2 giây)

  useEffect(() => {

    if (state.step <= GenerationStep.INPUT_FORM || state.isStreaming) return;



    const timer = setTimeout(() => {

      saveSession();

    }, 2000);



    return () => clearTimeout(timer);

  }, [state.step, state.fullDocument, solutionsState, appendixDocument, saveSession]);



  // Hàm khôi phục phiên

  const restoreSession = useCallback((sessionData: SessionData) => {

    try {

      // Khôi phục userInfo (trừ referenceDocuments)

      const { hasReferenceDocuments, ...savedUserInfo } = sessionData.userInfo as any;

      setUserInfo(prev => ({

        ...prev,

        ...savedUserInfo,

        referenceDocuments: prev.referenceDocuments || '', // Giữ ref docs từ sessionStorage

      }));



      // Khôi phục GenerationState

      setState({

        step: sessionData.state.step,

        messages: (sessionData.state.messages || []) as any,

        fullDocument: sessionData.state.fullDocument || '',

        isStreaming: false,

        error: null,

      });



      // Skip wizard upload step khi restore session

      setWizardStep(WizardStep.SETUP_INFO);



      // Khôi phục solutions

      if (sessionData.solutionsState) {

        setSolutionsState(sessionData.solutionsState);

      }



      // Khôi phục phụ lục

      if (sessionData.appendixDocument) {

        setAppendixDocument(sessionData.appendixDocument);

      }



      // Khôi phục outline feedback

      if (sessionData.outlineFeedback) {

        setOutlineFeedback(sessionData.outlineFeedback);

      }



      // Khôi phục chat history cho Gemini

      if (sessionData.chatHistory && sessionData.chatHistory.length > 0) {

        setChatHistory(sessionData.chatHistory);

      }



      // Initialize Gemini chat với API key

      const savedKey = localStorage.getItem('gemini_api_key');

      const savedModel = localStorage.getItem('selected_model');

      if (savedKey) {

        initializeGeminiChat(savedKey, savedModel || undefined, (localStorage.getItem('google_ai_provider') || 'gemini') as AiProvider);

        // Khôi phục history SAU khi init (vì init reset history)

        if (sessionData.chatHistory && sessionData.chatHistory.length > 0) {

          setChatHistory(sessionData.chatHistory);

        }

      }



      console.log('✅ Đã khôi phục phiên làm việc thành công!');

    } catch (e) {

      console.error('Lỗi khôi phục phiên:', e);

      setState(prev => ({ ...prev, error: 'Không thể khôi phục phiên làm việc. Vui lòng bắt đầu lại.' }));

    }

  }, []);



  // Hàm xóa phiên đã lưu

  const clearSavedSession = useCallback(() => {

    localStorage.removeItem(SESSION_SAVE_KEY);

    setSessionSavedAt(null);

    console.log('🗑 Đã xóa phiên làm việc đã lưu');

  }, []);



  // State cho popup review giải pháp

  const [showSolutionReview, setShowSolutionReview] = useState(false);

  const [currentSolutionNumber, setCurrentSolutionNumber] = useState(0);

  const [currentSolutionContent, setCurrentSolutionContent] = useState('');

  const [isRevisingSolution, setIsRevisingSolution] = useState(false);



  // Helper: Tính toán phân bổ trang cho từng phần SKKN

  const getPageAllocation = useCallback(() => {

    if (!userInfo.pageLimit || typeof userInfo.pageLimit !== 'number') return null;



    const pages = userInfo.pageLimit;

    const wordsPerPage = 350; // 1 trang A4 ≈ 350 từ (font 13pt, line spacing 1.5)

    const charsPerPage = 2500;

    const numSolutions = userInfo.numSolutions || 3;



    // Phân bổ: I&II (5%), III (5%), IV-GP (85%), V&VI (5%)

    const partI_II_pages = Math.max(1, Math.round(pages * 0.05));

    const partIII_pages = Math.max(1, Math.round(pages * 0.05));

    const partIV_pages = Math.max(numSolutions * 3, Math.round(pages * 0.85));

    const partV_VI_pages = Math.max(1, pages - partI_II_pages - partIII_pages - partIV_pages);

    const pagesPerSolution = Math.max(2, Math.floor(partIV_pages / numSolutions));



    return {

      totalPages: pages,

      wordsPerPage,

      charsPerPage,

      totalWords: pages * wordsPerPage,

      totalChars: pages * charsPerPage,

      numSolutions,

      partI_II: { pages: partI_II_pages, words: partI_II_pages * wordsPerPage, chars: partI_II_pages * charsPerPage },

      partIII: { pages: partIII_pages, words: partIII_pages * wordsPerPage, chars: partIII_pages * charsPerPage },

      partIV: { pages: partIV_pages, words: partIV_pages * wordsPerPage, chars: partIV_pages * charsPerPage },

      perSolution: { pages: pagesPerSolution, words: pagesPerSolution * wordsPerPage, chars: pagesPerSolution * charsPerPage },

      partV_VI: { pages: partV_VI_pages, words: partV_VI_pages * wordsPerPage, chars: partV_VI_pages * charsPerPage },

    };

  }, [userInfo.pageLimit, userInfo.numSolutions]);



  // Helper: Tạo prompt giới hạn số từ/trang cho MỘT phần cụ thể đang viết

  const getSectionPagePrompt = useCallback((sectionName: string, sectionKey: 'partI_II' | 'partIII' | 'perSolution' | 'partV_VI') => {

    const alloc = getPageAllocation();

    if (!alloc) return '';



    const section = alloc[sectionKey];

    return `

🚨 GIỚI HẠN SĐ TRANG CHO PHẦN NÀY(BẮT BUỘC):

📌 ${sectionName}: PHẢI viết khoảng ${section.pages} TRANG(≈ ${section.words.toLocaleString()} từ ≈ ${section.chars.toLocaleString()} ký tự)

⚠Đ Trong tổng ${alloc.totalPages} trang SKKN, phần này chiếm ${section.pages} trang.

🚫 KHÔNG viết quá ${Math.ceil(section.pages * 1.15)} trang và KHÔNG viết dưới ${Math.max(1, Math.floor(section.pages * 0.85))} trang.

✅ Viết CÔ ĐỌNG, SÚC TĐCH nhưng ĐẦY ĐỦ NỘI DUNG.Ưu tiên bảng biểu để tiết kiệm không gian.

`;

  }, [getPageAllocation]);



  // Helper function để tạo prompt nhắc lại các yêu cầu đặc biệt

  const getPageLimitPrompt = useCallback(() => {

    // Kiểm tra xem ngưĐi dùng đã xác nhận yêu cầu chưa

    if (!userInfo.requirementsConfirmed) return '';



    const requirements: string[] = [];



    // 1. Giới hạn số trang - TĐNH TOĐN CHI TIẾT

    const alloc = getPageAllocation();

    if (alloc) {

      requirements.push(`

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

🚨🚨🚨 GIỚI HẠN SĐ TRANG - BẮT BUỘC TUYỆT ĐĐI 🚨🚨🚨

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



📌 TỔNG SĐ TRANG YÊU CẦU: ${alloc.totalPages} TRANG (không tính Dàn ý và Phụ lục)



Đ QUY ĐỔI CHUẨN (Font 13pt, Line spacing 1.5):

• 1 trang A4 ≈ ${alloc.wordsPerPage} từ ≈ ${alloc.charsPerPage} ký tự

• TỔNG CHO ${alloc.totalPages} TRANG: ≈ ${alloc.totalWords.toLocaleString()} từ ≈ ${alloc.totalChars.toLocaleString()} ký tự



📊 PHÂN BỔ CHI TIẾT TỪNG PHẦN:

┌──────────────────────────────────────────────────────────────────Đ

│ PHẦN                │ SĐ TRANG  │ SĐ TỪ         │ SĐ KĐ TỰ       │

├──────────────────────────────────────────────────────────────────┤

│ Phần I & II         │ ${alloc.partI_II.pages} trang    │ ~${alloc.partI_II.words.toLocaleString()} từ      │ ~${alloc.partI_II.chars.toLocaleString()} ký tự     │

│ Phần III            │ ${alloc.partIII.pages} trang    │ ~${alloc.partIII.words.toLocaleString()} từ      │ ~${alloc.partIII.chars.toLocaleString()} ký tự     │

│ Phần IV(${alloc.numSolutions} GP)    │ ${alloc.partIV.pages} trang   │ ~${alloc.partIV.words.toLocaleString()} từ     │ ~${alloc.partIV.chars.toLocaleString()} ký tự    │

│  → Mỗi giải pháp   │ ${alloc.perSolution.pages} trang    │ ~${alloc.perSolution.words.toLocaleString()} từ      │ ~${alloc.perSolution.chars.toLocaleString()} ký tự     │

│ Phần V & VI + KL    │ ${alloc.partV_VI.pages} trang    │ ~${alloc.partV_VI.words.toLocaleString()} từ      │ ~${alloc.partV_VI.chars.toLocaleString()} ký tự     │

└──────────────────────────────────────────────────────────────────┘



⚠Đ QUY TẮC KIỂM SOĐT SĐ TRANG NGHIÊM NGẶT:

1. TRƯỚC KHI VIẾT: Tính toán số từ cần viết cho phần HIỆN TẠI dựa trên bảng phân bổ.

2. TRONG KHI VIẾT: Đếm số từ đã viết, DỪNG NGAY khi đạt đủ số từ phân bổ.

3. SAU KHI VIẾT: Tự đánh giá số từ đã viết so với phân bổ. Nếu vượt > 15% → CẮT BỚT.

4. MỖI ĐOẠN VĂN: Tối đa 3-4 câu (≈ 60-80 từ)

5. MỖI MỤC NHỎ: Tối đa 5-7 đoạn văn

6. KHÔNG lặp lại ý, KHÔNG viết dư thừa

7. VĐ DỤ MINH HỌA: Chỉ 1-2 ví dụ ngắn gĐn / giải pháp

8. BẢNG BIỂU: Giúp tiết kiệm không gian - ưu tiên sử dụng



🚫🚫🚫 CẢNH BĐO NGHIÊM NGẶT:

- NẾU VƯỢT QUĐ ${alloc.totalPages} TRANG (≈ ${alloc.totalWords.toLocaleString()} từ) → HOÀN TOÀN KHÔNG CHẤP NHẬN ĐƯỢC!

- NẾU VIẾT THIẾU DƯỚI ${Math.max(1, Math.floor(alloc.totalPages * 0.8))} TRANG → CŨNG KHÔNG ĐẠT YÊU CẦU!

- SĐ TRANG LÀ YÊU CẦU CĐT LÕI CỦA NGƯỜI DÙNG, PHẢI TUÂN THỦ 100%.

✅ MỤC TIÊU: Viết ĐÚNG số trang yêu cầu, CÔ ĐỌNG, SÚC TĐCH nhưng vẫn ĐẦY ĐỦ NỘI DUNG.`);

    }



    // 2. Thêm bài toán thực tế, ví dụ minh hĐa

    if (userInfo.includePracticalExamples) {

      requirements.push(`

📊 YÊU CẦU THÊM BÀI TOĐN THỰC TẾ, VĐ DỤ MINH HỌA:

- Mỗi giải pháp PHẢI có ít nhất 2 - 3 ví dụ thực tế cụ thể

  - Bài toán thực tế phải gắn với đĐi sống, công việc, nghĐ nghiệp

    - Ví dụ minh hĐa phải chi tiết, có thể áp dụng ngay

      - Ưu tiên các ví dụ từ SGK ${userInfo.textbook || "hiện hành"} `);

    }



    // 3. Bổ sung bảng biểu, số liệu thống kê

    if (userInfo.includeStatistics) {

      requirements.push(`

📈 YÊU CẦU BỔ SUNG BẢNG BIỂU, SĐ LIỆU THĐNG KÊ:

- Mỗi phần quan trĐng PHẢI có bảng biểu hoặc số liệu minh hĐa

  - Sử dụng số liệu lẻ tự nhiên(42.3 %, 67.8 %) thay vì số tròn

    - Bảng số liệu phải rõ ràng, format Markdown chuẩn

      - Có biểu đồ gợi ý khi cần thiết

        - Số liệu phải logic và nhất quán trong toàn bài`);

    }



    // 4. Yêu cầu bổ sung khác

    if (userInfo.specialRequirements && userInfo.specialRequirements.trim()) {

      requirements.push(`

ĐĐ YÊU CẦU BỔ SUNG TỪ NGƯỜI DÙNG:

${userInfo.specialRequirements}

Hãy áp dụng CHĐNH XĐC các yêu cầu trên vào phần đang viết!`);

    }



    if (requirements.length === 0) return '';



    return `

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

⚠Đ CĐC YÊU CẦU ĐẶC BIỆT ĐÃ XĐC NHẬN(BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

${requirements.join('\n')}

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

`;

  }, [userInfo.requirementsConfirmed, userInfo.pageLimit, userInfo.includePracticalExamples, userInfo.includeStatistics, userInfo.specialRequirements, userInfo.textbook, userInfo.numSolutions, getPageAllocation]);



  // Helper function để tạo prompt cấu trúc từ mẫu SKKN đã trích xuất

  const getCustomTemplatePrompt = useCallback(() => {

    if (!userInfo.customTemplate) return null;



    try {

      const template: SKKNTemplate = JSON.parse(userInfo.customTemplate);

      if (!template.sections || template.sections.length === 0) return null;



      // Tạo chuỗi hiển thị cấu trúc

      const structureText = template.sections.map(s => {

        const indent = '  '.repeat(s.level - 1);

        const prefix = s.level === 1 ? '📌' : s.level === 2 ? '•' : '○';

        return `${indent}${prefix} ${s.id}. ${s.title} `;

      }).join('\n');



      return `

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

🚨🚨🚨 CẤU TRÚC MẪU SKKN TỪ ${template.name || 'Sở/Phòng GD'} (BẮT BUỘC TUYỆT ĐĐI) 🚨🚨🚨

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

⚠Đ CẢNH BĐO: Đây là CẤU TRÚC DUY NHẤT được phép sử dụng.

🚫 TUYỆT ĐĐI KHÔNG sử dụng cấu trúc SKKN mặc định / chuẩn.

✅ BẮT BUỘC TẠO DÀN Đ VÀ NỘI DUNG THEO ĐÚNG CẤU TRÚC NÀY:



${structureText}



QUY TẮC BẮT BUỘC:

1. TẠO DÀN Đ theo ĐÚNG thứ tự và tên các phần / mục như trên

2. KHÔNG thay đổi tên các phần lớn(level 1)

3. CĐC MỤC CON có thể điĐu chỉnh nội dung cho phù hợp đĐ tài nhưng PHẢI giữ nguyên cấu trúc

4. ĐiĐn nội dung phù hợp với đĐ tài vào TỪNG MỤC

5. KHÔNG sử dụng cấu trúc "Phần I, II, III, IV, V, VI" mặc định nếu mẫu có cấu trúc khác

6. Số lượng giải pháp, tên các phần, thứ tự trình bày PHẢI theo mẫu này



[HẾT CẤU TRÚC MẪU - MỌI NỘI DUNG PHẢI TUÂN THỦ CẤU TRÚC TRÊN]

`;

    } catch (e) {

      console.error('Lỗi parse customTemplate:', e);

      return null;

    }

  }, [userInfo.customTemplate]);



  // Handle Input Changes

  const handleUserChange = (field: keyof UserInfo, value: string) => {

    setUserInfo(prev => {

      const updated = { ...prev, [field]: value };

      // Reset grade khi đổi cấp hĐc giữa bậc phổ thông và bậc cao

      if (field === 'level') {

        const wasHigherEd = HIGHER_ED_LEVELS.includes(prev.level);

        const isHigherEd = HIGHER_ED_LEVELS.includes(value as string);

        if (wasHigherEd !== isHigherEd) {

          updated.grade = '';

        }

      }

      return updated;

    });

  };



  // Handle Manual Document Edit

  const handleDocumentUpdate = (newContent: string) => {

    setState(prev => ({ ...prev, fullDocument: newContent }));

  };



  // Handle Manual Outline Submission (Skip Generation)

  const handleManualOutlineSubmit = (content: string) => {

    if (!apiKey) {

      setShowApiModal(true);

      return;

    }



    // Initialize chat session silently so it's ready for next steps

    initializeGeminiChat(apiKey, selectedModel, currentProvider);



    setState(prev => ({

      ...prev,

      fullDocument: content,

      step: GenerationStep.OUTLINE, // Go to Outline step so user can Review/Confirm

      isStreaming: false,

      error: null

    }));

  };



  // Start the Generation Process

  const startGeneration = async () => {

    if (!apiKey) {

      setShowApiModal(true);

      return;

    }



    try {

      setState(prev => ({ ...prev, step: GenerationStep.OUTLINE, isStreaming: true, error: null, fullDocument: '' }));



      initializeGeminiChat(apiKey, selectedModel, currentProvider);



      const isHigherEd = HIGHER_ED_LEVELS.includes(userInfo.level);

      const learnerTerm = isHigherEd ? 'sinh viên' : 'hĐc sinh';

      const teacherTerm = isHigherEd ? 'giảng viên' : 'giáo viên';

      const schoolTerm = isHigherEd ? 'trưĐng/hĐc viện' : 'trưĐng';

      const textbookTerm = isHigherEd ? 'giáo trình' : 'SGK';



      const initMessage = `

Bạn là chuyên gia giáo dục cấp quốc gia, có 20 + năm kinh nghiệm viết, thẩm định và chấm điểm Sáng kiến Kinh nghiệm(SKKN) đạt giải cấp Bộ, cấp tỉnh tại Việt Nam.

  ${isHigherEd ? `

⚠Đ LƯU Đ QUAN TRỌNG: Đây là SKKN dành cho BẬC ${userInfo.level.toUpperCase()} - KHÔNG PHẢI PHỔ THÔNG.

Phải sử dụng thuật ngữ phù hợp: "sinh viên" thay "hĐc sinh", "giảng viên" thay "giáo viên", "giáo trình" thay "SGK", v.v.

` : ''

        }

NHIỆM VỤ CỦA BẠN:

Lập DÀN Ý CHI TIẾT cho một đề tài SKKN dựa trên thông tin tôi cung cấp. Dàn ý phải đầy đủ, cụ thể, có độ sâu và đảm bảo 4 tiêu chí: Tính MỚI, Tính KHOA HỌC, Tính KHẢ THI, Tính HIỆU QUẢ.

🌐 QUY ĐỊNH NGÔN NGỮ KHI LẬP DÀN Ý (BẮT BUỘC TUÂN THỦ):
- BẢN DÀN Ý NÀY PHẢI ĐƯỢC VIẾT HOÀN TOÀN BẰNG TIẾNG VIỆT (để giáo viên và hội đồng chấm thẩm định khung sườn logic và cấu trúc phương pháp).
- Quy định khi triển khai chi tiết:
  + Mục I (THÔNG TIN CHUNG VỀ SÁNG KIẾN): Sẽ viết bằng TIẾNG VIỆT.
  + Bắt đầu từ TÓM TẮT SÁNG KIẾN (中文摘要) và toàn bộ các chương tiếp theo (Chương I, Chương II, Chương III, Chương IV, Chương V, Tài liệu tham khảo, Phụ lục): BẮT BUỘC SẼ VIẾT HOÀN TOÀN BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文).
  + Với SKKN Tiếng Trung THPT: từ 中文摘要 trở đi, không được chèn phụ đề, bản dịch, chú thích hoặc bất kỳ chữ tiếng Việt nào.




ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

Đ 10 NGUYÊN TẮC VÀNG CHĐNG ĐẠO VĂN & NÂNG TẦM CHẤT LƯỢNG(BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



⚠Đ CẢNH BĐO: Bạn PHẢI tuân thủ 10 nguyên tắc sau để SKKN có tính "CON NGƯỜI", giĐng điệu tự nhiên như một giáo viên thực sự đang viết sáng kiến của chính hĐ - là tâm huyết và sáng tạo của hĐ.



1Đ⃣ KHÔNG SAO CHÉP TRỰC TIẾP(Zero Copy - Paste):

   Đ SAI: Copy nguyên văn định nghĩa từ Wikipedia, sách giáo khoa.

   ✅ ĐÚNG: ĐĐc hiểu ý tưởng → Tóm tắt theo tư duy riêng → Viết bằng ngôn ngữ và văn phong riêng biệt.



2Đ⃣ TƯ DUY VIẾT HOÀN TOÀN MỚI(Unique Thinking):

   Đ SAI: "Giáo dục là quốc sách hàng đầu", "Thầy cô là ngưĐi lái đò"(sáo rỗng).

   ✅ ĐÚNG: Viết câu có chiĐu sâu, phản ánh tư duy cá nhân của ngưĐi viết.



3Đ⃣ XỬ LĐ LĐ THUYẾT GIĐO DỤC:

   Công thức: [Diễn giải lý thuyết theo cách mới] + [Đ nghĩa với giáo dục VN hiện tại] + [Liên hệ trực tiếp đĐ tài tại trưĐng cụ thể].



4Đ⃣ XỬ LĐ VĂN BẢN PHĐP LUẬT:

   KHÔNG trích dẫn nguyên văn các ĐiĐu, Khoản.Hãy TÓM TẮT NỘI HÀM theo cách riêng.



5Đ⃣ TẠO SĐ LIỆU ĐỘC BẢN & HỢP LĐ:

- Dùng số lẻ tự nhiên(42.3 %, 68.7 %) thay vì số tròn(40 %, 50 %).

   - Tổng tỷ lệ phải = 100 %.Kết quả "Sau" tốt hơn "Trước" nhưng không tuyệt đối hóa.



6Đ⃣ GIẢI PHĐP CỤ THỂ HÓA:

   Đ Tránh: "Đổi mới phương pháp dạy hĐc"(chung chung).

   ✅ Phải: Đặt tên giải pháp ấn tượng và cụ thể(VD: "Thiết kế chuỗi hoạt động theo mô hình 5E kết hợp Padlet").



7Đ⃣ KỸ THUẬT PARAPHRASE 5 CẤP ĐỘ:

1. Thay đổi từ vựng(HĐc sinh → NgưĐi hĐc, Giáo viên → Nhà giáo dục).

   2. Đổi cấu trúc câu chủ động ↔ bị động.

   3. Kết hợp 2 - 3 câu đơn thành câu phức.

   4. Thêm trạng từ / tính từ biểu cảm.

   5. Đảo ngữ nhấn mạnh.



8Đ⃣ CẤU TRÚC CÂU PHỨC HỢP:

   Ưu tiên câu ghép, câu phức có nhiĐu mệnh đĐ để thể hiện tư duy logic chặt chẽ.



9Đ⃣ NGÔN NGỮ CHUYÊN NGÀNH:

   Sử dụng từ khóa "đắt" giá: Hiện thực hóa, Tối ưu hóa, Cá nhân hóa, Tích hợp liên môn, Phẩm chất cốt lõi, Năng lực đặc thù, Tư duy đa chiĐu, Chuyển đổi số, Hệ sinh thái hĐc tập...



🔟 TỰ KIỂM TRA:

   Trong quá trình viết, liên tục tự hĐi: "Đoạn này có quá giống văn mẫu không?".Nếu có → Viết lại ngay.



💡 GIỌNG ĐIỆU YÊU CẦU:

- Viết như một GIĐO VIÊN THỰC SỰ đang chia sẻ sáng kiến của chính mình.

- Thể hiện TÂM HUYẾT, TRĂN TRỞ với nghĐ và với hĐc sinh.

- Dùng ngôn ngữ TỰ NHIÊN, CHÂN THÀNH, không máy móc hay khuôn mẫu.

- Xen kẽ những suy nghĩ cá nhân, những quan sát thực tế từ lớp học.



BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái Bước 2(Lập Dàn Ý - Đang thực hiện).



  ${isHigherEd ? HIGHER_ED_SYSTEM_INSTRUCTION : ''}



${OUTLINE_GUIDE}



${(() => {
  const gradeMatch = userInfo.grade.match(/\d+/);
  const gradeNum = gradeMatch ? gradeMatch[0] : '';
  if (gradeNum && !isHigherEd) {
    return curriculumValidator.generateCurriculumPrompt(userInfo.subject, gradeNum);
  }
  return '';
})()}

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

THÔNG TIN ĐỀ TÀI:

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



• Tên đĐ tài: ${userInfo.topic}

• Môn hĐc / Lĩnh vực: ${userInfo.subject}${(() => {

          const info = getSubjectInfo(userInfo.subject); return info ? `

  → Nhóm: ${info.group}

  → Đặc trưng: ${info.description}

  → Hãy viết nội dung SKKN bám sát đặc thù lĩnh vực "${info.name}" thuộc nhóm "${info.group}"` : '';

        })()

        }

• Cấp hĐc: ${userInfo.level}

• Khối lớp / Đối tượng: ${userInfo.grade}

• Tên ${schoolTerm}: ${userInfo.school}

• Địa điểm: ${userInfo.location}

• ĐiĐu kiện CSVC: ${userInfo.facilities}

• ${textbookTerm}: ${userInfo.textbook || "Không đĐ cập"}

• Đối tượng nghiên cứu: ${userInfo.researchSubjects || (isHigherEd ? "Sinh viên tại đơn vị" : "HĐc sinh tại đơn vị")}

• ThĐi gian thực hiện: ${userInfo.timeframe || "Năm hĐc hiện tại"}

• Đặc thù / Công nghệ / AI: ${userInfo.applyAI ? userInfo.applyAI : ''} ${userInfo.focus ? `- ${userInfo.focus}` : ''}



${userInfo.referenceDocuments ? `ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

TÀI LIỆU THAM KHẢO (DO GIĐO VIÊN CUNG CẤP):

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

Dưới đây là nội dung các tài liệu tham khảo mà giáo viên đã tải lên. BẮT BUỘC phải bám sát vào nội dung này để viết SKKN phù hợp và chính xác:



${truncateForPrompt(userInfo.referenceDocuments)}



[HẾT TÀI LIỆU THAM KHẢO]

` : ''

        }



${userInfo.customTemplate ? getCustomTemplatePrompt() : (userInfo.skknTemplate ? `ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

🚨🚨🚨 MẪU YÊU CẦU SKKN TỪ SỞ/PHÒNG GD (BẮT BUỘC TUYỆT ĐĐI) 🚨🚨🚨

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

⚠Đ CẢNH BĐO QUAN TRỌNG NHẤT: Giáo viên đã cung cấp MẪU YÊU CẦU SKKN chính thức bên dưới.



🚫 BẠN TUYỆT ĐĐI KHÔNG ĐƯỢC sử dụng bất kỳ cấu trúc SKKN mặc định/chuẩn nào.

✅ BẠN BẮT BUỘC PHẢI viết HOÀN TOÀN theo cấu trúc và mẫu này:



1. Tạo dàn ý và viết nội dung ĐÚNG CHĐNH XĐC theo cấu trúc, các mục, các phần trong mẫu này

2. Tuân theo ĐÚNG trình tự, tên gĐi, cách đánh số các mục như trong mẫu

3. KHÔNG tự ý thay đổi tên mục, KHÔNG bĐ qua mục nào, KHÔNG thêm mục nếu mẫu không yêu cầu

4. KHÔNG sử dụng cấu trúc "Phần I, II, III, IV, V, VI" mặc định nếu mẫu có cấu trúc khác

5. Số lượng giải pháp, tên các phần lớn, thứ tự trình bày ĐỀU PHẢI theo mẫu này

6. Viết đúng theo format và quy cách mẫu đĐ ra



NỘI DUNG MẪU SKKN (ĐÂY LÀ CẤU TRÚC DUY NHẤT ĐƯỢC PHÉP SỬ DỤNG):

${userInfo.skknTemplate}



[HẾT MẪU SKKN - MỌI NỘI DUNG PHẢI TUÂN THỦ CẤU TRÚC TRÊN]

` : '')

        }



${userInfo.specialRequirements ? `ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

Đ YÊU CẦU ĐẶC BIỆT TỪ GIĐO VIÊN (BẮT BUỘC THỰC HIỆN):

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

⚠Đ QUAN TRỌNG: Giáo viên đã đưa ra các yêu cầu đặc biệt sau.

BẠN BẮT BUỘC PHẢI TUÂN THỦ NGHIÊM NGẶT:



${userInfo.specialRequirements}



Hãy phân tích kỹ các yêu cầu trên và áp dụng CHĐNH XĐC vào toàn bộ bài viết.



📌 HƯỚNG DẪN XỬ LĐ GIỚI HẠN SĐ TRANG:

- Nếu yêu cầu "giới hạn X trang" → Số trang này tính từ PHẦN I & II đến hết PHẦN V, VI & KẾT LUẬN

- KHÔNG tính dàn ý vào giới hạn số trang

- KHÔNG tính Phụ lục vào giới hạn số trang (Phụ lục được tạo riêng, không giới hạn)

- Phân bổ số trang hợp lý cho NỘI DUNG CHĐNH (không tính Phụ lục):

  + Phần I & II: TĐI ĐA 4 trang (khoảng 10%)

  + Phần III (Thực trạng): TĐI ĐA 3 trang (khoảng 7-8%)

  + Phần IV (Giải pháp): khoảng 55-65% tổng số trang (phần quan trĐng nhất)

  + Phần V, VI & Kết luận: khoảng 15-20% tổng số trang



Ví dụ: Nếu giới hạn 40 trang (KHÔNG tính Phụ lục):

  + Phần I & II: 3-4 trang (TĐI ĐA 4 trang)

  + Phần III: 2-3 trang (TĐI ĐA 3 trang)

  + Phần IV: 24-28 trang

  + Phần V, VI & Kết luận: 6-8 trang

  + Phụ lục: TĐNH RIÊNG (không giới hạn)



Các yêu cầu khác:

- Nếu yêu cầu "viết ngắn gĐn phần lý thuyết" → Tóm tắt cô đĐng phần cơ sở lý luận

- Nếu yêu cầu "thêm nhiĐu bài toán thực tế" → Bổ sung ví dụ toán thực tế phong phú

- Nếu yêu cầu "tập trung vào giải pháp" → Ưu tiên phần IV với nhiĐu chi tiết hơn



[HẾT YÊU CẦU ĐẶC BIỆT]

` : ''

        }



ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

⚠Đ YÊU CẦU ĐỊNH DẠNG OUTPUT(BẮT BUỘC):

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

1. SAU MỖI CÂU: Phải xuống dòng(Enter 2 lần).

2. SAU MỖI ĐOẠN: Cách 1 dòng trống.

3. KHÔNG viết dính liĐn(wall of text).

4. Sử dụng gạch đầu dòng và tiêu đĐ rõ ràng.



  ${(userInfo.skknTemplate || userInfo.customTemplate) ? '' : (isHigherEd ? `

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

CẤU TRÚC SKKN BẬC CAO (TRUNG CẤP / CAO ĐẲNG / ĐẠI HỌC):

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



📋 MÔ TẢ SĐNG KIẾN



1. BĐI CẢNH VÀ LĐ DO NGHIÊN CỨU (3-4 trang)



   1.1. Bối cảnh giáo dục đại hĐc Việt Nam hiện nay

        → Nghị quyết 29-NQ/TW vĐ đổi mới căn bản, toàn diện giáo dục

        → Luật Giáo dục đại hĐc 2018 (sửa đổi 2024)

        → Yêu cầu đổi mới phương pháp giảng dạy ${userInfo.subject} bậc ${userInfo.level}

        → Xu hướng chuyển đổi số, chuẩn đầu ra CDIO/ABET

        → Cách mạng công nghiệp 4.0 và yêu cầu nguồn nhân lực chất lượng cao

        

   1.2. Xuất phát từ thực tiễn giảng dạy

        → Thực trạng giảng dạy ${userInfo.subject} tại ${userInfo.school}

        → Đặc điểm ${userInfo.grade}: năng lực đầu vào, động lực hĐc tập

        → Hạn chế của phương pháp giảng dạy truyĐn thống ở bậc ${userInfo.level}

        → Khoảng cách giữa đào tạo và nhu cầu thị trưĐng lao động



2. TỔNG QUAN TÀI LIỆU & CƠ SỞ LĐ LUẬN (5-7 trang)



   2.1. Tổng quan nghiên cứu (Literature Review)

        → Các nghiên cứu trong nước liên quan (ít nhất 3-5 nghiên cứu)

        → Các nghiên cứu quốc tế liên quan (ít nhất 3-5 nghiên cứu)

        → Phân tích khoảng trống nghiên cứu (Research Gap)

        → Trích dẫn chuẩn APA: (Tác giả, Năm)

        

   2.2. Khung lý thuyết (Theoretical Framework)

        → Andragogy - Lý thuyết hĐc tập ngưĐi lớn (Knowles)

        → Experiential Learning - HĐc qua trải nghiệm (Kolb)

        → Constructive Alignment - Căn chỉnh kiến tạo (Biggs)

        → Bloom's Taxonomy bậc cao (Analyze, Evaluate, Create)

        → Outcome-based Education (OBE)

        [Phân tích sâu + Liên hệ đĐ tài tại ${userInfo.school}]

        

   2.3. Cơ sở pháp lý

        → Luật Giáo dục đại hĐc 2018, sửa đổi bổ sung

        → Thông tư quy định vĐ chuẩn chương trình đào tạo

        → Quy chế đào tạo trình độ ${userInfo.level}



3. PHÂN TĐCH HIỆN TRẠNG & ĐĐNH GIĐ NHU CẦU (5-6 trang)



   3.1. Hiện trạng tổng quan

        → ĐiĐu kiện CSVC tại ${userInfo.school} (${userInfo.facilities})

        → Đặc thù đào tạo ngành/chuyên ngành liên quan

        → Chuẩn đầu ra chương trình đào tạo hiện hành

        

   3.2. Khảo sát giảng viên

        → Bảng khảo sát giảng viên (n=X, sử dụng thang Likert 5 điểm)

        → Phương pháp giảng dạy hiện tại

        → Thuận lợi - Khó khăn trong giảng dạy bậc ${userInfo.level}

        → Cronbach's Alpha kiểm tra độ tin cậy

        

   3.3. Khảo sát sinh viên

        → Bảng khảo sát sinh viên ${userInfo.grade} (n=Y)  

        → Kết quả hĐc tập trước khi áp dụng sáng kiến

        → Mức độ hài lòng, động lực hĐc tập

        → Kỹ năng tự hĐc, nghiên cứu

        → Nhu cầu đổi mới phương pháp

        

   → Phân tích nguyên nhân bằng mô hình Fishbone/SWOT



4. CĐC GIẢI PHĐP, BIỆN PHĐP THỰC HIỆN (12-18 trang - PHẦN QUAN TRỌNG NHẤT)



   ⚠Đ MỖI GIẢI PHĐP PHẢI CÓ CƠ SỞ NGHIÊN CỨU KHOA HỌC RÕ RÀNG.



   GIẢI PHĐP 1: [Tên giải pháp - dựa trên nghiên cứu khoa hĐc]

   

        1.1. Mục tiêu giải pháp (gắn với Chuẩn đầu ra / Learning Outcomes)

             → Mục tiêu vĐ kiến thức chuyên ngành

             → Mục tiêu vĐ năng lực nghĐ nghiệp

             → Mục tiêu vĐ kỹ năng mĐm, tư duy phản biện

             

        1.2. Cơ sở khoa hĐc & Nghiên cứu liên quan

             → Trích dẫn 2-3 nghiên cứu hỗ trợ (APA)

             → Phân tích mô hình quốc tế tương tự

             → Điểm mới, sáng tạo so với nghiên cứu trước

             

        1.3. Thiết kế nghiên cứu & Quy trình

             → Thiết kế: thực nghiệm/bán thực nghiệm/nghiên cứu hành động

             → Nhóm thực nghiệm (n=?) và nhóm đối chứng (n=?)

             → Quy trình thực hiện chi tiết (5-7 bước)

             → Công cụ đánh giá: rubric, bài thi, khảo sát

             

        1.4. Ví dụ minh hĐa cụ thể

             → Bài giảng/hĐc phần cụ thể trong giáo trình ${userInfo.textbook || "hiện hành"}

             → Hoạt động giảng dạy chi tiết

             → Sản phẩm sinh viên mẫu / Đồ án / Tiểu luận

             

        1.5. ĐiĐu kiện thực hiện & Hạn chế

             → Yêu cầu vĐ CSVC (tận dụng ${userInfo.facilities})

             → Hạn chế của phương pháp (phản biện)

             → ĐiĐu kiện nhân rộng



   GIẢI PHĐP 2: [Tên giải pháp - dựa trên nghiên cứu khoa hĐc]

        [Cấu trúc tương tự, triển khai đầy đủ 5 mục]



   GIẢI PHĐP 3: [Tên giải pháp - dựa trên nghiên cứu khoa hĐc]

        [Cấu trúc tương tự, triển khai đầy đủ 5 mục]

   ${(userInfo.numSolutions || 3) > 3 ? `

   GIẢI PHĐP 4: [Tên giải pháp nâng cao - ứng dụng công nghệ]

        [Giải pháp tích hợp LMS, AI, Virtual Lab...]

   ${(userInfo.numSolutions || 3) > 4 ? `

   GIẢI PHĐP 5: [Tên giải pháp phát triển - hợp tác doanh nghiệp]

        [Giải pháp gắn kết đào tạo với thị trưĐng lao động]

   ` : ''}

   ` : ''}

   → MĐI LIÊN HỆ HỆ THĐNG GIỮA CĐC GIẢI PHĐP



5. KẾT QUẢ NGHIÊN CỨU & ĐĐNH GIĐ (5-6 trang)



   5.1. Mục đích & Phương pháp đánh giá

        → Thiết kế thực nghiệm: Pre-test / Post-test

        → Công cụ thu thập dữ liệu: Bài thi, bảng hĐi Likert, phĐng vấn sâu

        

   5.2. Kết quả định lượng

        → Đối tượng: ${userInfo.researchSubjects || "Sinh viên tại đơn vị"}

        → ThĐi gian: ${userInfo.timeframe || "Năm hĐc hiện tại"}

        → Bảng kết quả kèm phân tích thống kê (Mean, SD, t-value, p-value)

        → Effect size (Cohen's d)

        → Biểu đồ so sánh nhóm thực nghiệm vs đối chứng

        

   5.3. Kết quả định tính

        → PhĐng vấn sinh viên, giảng viên

        → Quan sát lớp hĐc / giảng đưĐng

        → Phân tích sản phẩm sinh viên

        → Đ kiến phản hồi từ chuyên gia, đồng nghiệp



6. ĐIỀU KIỆN NHÂN RỘNG & PHĐT TRIỂN (1-2 trang)



   → ĐiĐu kiện vĐ CSVC, công nghệ

   → ĐiĐu kiện vĐ năng lực giảng viên, bồi dưỡng

   → Phạm vi áp dụng: các trưĐng ${userInfo.level} khác

   → Hướng nghiên cứu phát triển tiếp theo



ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



📌 KẾT LUẬN VÀ KHUYẾN NGHỊ (2-3 trang)



1. Kết luận

   → Tóm tắt đóng góp chính của sáng kiến

   → Tính mới và giá trị khoa hĐc

   → Giá trị thực tiễn cho đào tạo bậc ${userInfo.level}



2. Khuyến nghị  

   → Với nhà trưĐng / Ban giám hiệu

   → Với khoa / bộ môn

   → Với giảng viên

   → Với Bộ GD&ĐT / Hội đồng khoa hĐc

   → Hướng nghiên cứu phát triển tiếp



ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



📚 TÀI LIỆU THAM KHẢO

   → Liệt kê 10-15 tài liệu theo chuẩn APA (gồm tiếng Việt và tiếng Anh)



📎 PHỤ LỤC

   → Phiếu khảo sát (Likert scale)

   → ĐĐ cương bài giảng minh hĐa

   → Rubric đánh giá

   → Sản phẩm sinh viên

   → Kết quả phân tích thống kê chi tiết

` : `

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

CẤU TRÚC SKKN CHUẨN (ĐP DỤNG KHI KHÔNG CÓ MẪU RIÊNG):

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



📋 MÔ TẢ SĐNG KIẾN



1. HOÀN CẢNH NẢY SINH SĐNG KIẾN (3-4 trang)



   1.1. Xuất phát từ mục tiêu của giáo dục Việt Nam trong thĐi kì hiện nay

        → Nghị quyết 29-NQ/TW vĐ đổi mới căn bản, toàn diện giáo dục

        → Chương trình GDPT 2018 - định hướng phát triển năng lực, phẩm chất

        → Yêu cầu đổi mới dạy hĐc môn ${userInfo.subject}

        → Xu hướng chuyển đổi số trong giáo dục

        

   1.2. Xuất phát từ thực tiễn dạy - hĐc hiện nay

        → Thực trạng dạy hĐc môn ${userInfo.subject} tại ${userInfo.school}

        → Khó khăn, thách thức của hĐc sinh ${userInfo.grade}

        → Hạn chế của phương pháp dạy hĐc truyĐn thống

        → Nhu cầu cấp thiết đổi mới để nâng cao chất lượng



2. CƠ SỞ LĐ LUẬN CỦA VẤN ĐỀ (4-5 trang)



   2.1. Các khái niệm cơ bản liên quan đến đĐ tài

        → Định nghĩa, thuật ngữ then chốt (DIỄN GIẢI theo cách riêng, không copy)

        

   2.2. Cơ sở pháp lý (TÓM TẮT TINH THẦN, không trích nguyên văn)

        → Luật Giáo dục 2019

        → Thông tư hướng dẫn liên quan

        → Công văn chỉ đạo của Bộ/Sở GD&ĐT

        

   2.3. Cơ sở lý luận giáo dục (ChĐn 2-3 lý thuyết PHÙ HỢP)

        → Lý thuyết kiến tạo (Piaget, Vygotsky)

        → Lý thuyết hĐc tập qua trải nghiệm (Kolb)

        → Dạy hĐc phát triển năng lực

        [Diễn giải LĐ THUYẾT + Liên hệ đĐ tài tại ${userInfo.school}]



3. THỰC TRẠNG VẤN ĐỀ CẦN NGHIÊN CỨU (5-6 trang)



   3.1. Thực trạng chung

        → ĐiĐu kiện CSVC tại ${userInfo.school} (${userInfo.facilities})

        → Đặc điểm địa phương ${userInfo.location}

        → Xu hướng dạy hĐc hiện nay

        

   3.2. Thực trạng đối với giáo viên

        → Bảng khảo sát giáo viên (n=X)

        → Thuận lợi - Khó khăn trong giảng dạy

        → Phương pháp đang sử dụng

        

   3.3. Thực trạng đối với hĐc sinh

        → Bảng khảo sát hĐc sinh ${userInfo.grade} (n=Y)  

        → Kết quả hĐc tập trước khi áp dụng sáng kiến

        → Thái độ, hứng thú với môn hĐc

        → Những khó khăn hĐc sinh gặp phải

        

   → Phân tích nguyên nhân (khách quan + chủ quan)



4. CĐC GIẢI PHĐP, BIỆN PHĐP THỰC HIỆN (12-15 trang - PHẦN QUAN TRỌNG NHẤT)



   ⚠Đ CHỈ ĐỀ XUẤT 3 GIẢI PHĐP TRỌNG TÂM, ĐẶC SẮC NHẤT - làm hoàn thiện, chỉn chu từng giải pháp.



   GIẢI PHĐP 1: [Tên giải pháp cụ thể, ấn tượng]

   

        1.1. Mục tiêu của giải pháp

             → Mục tiêu vĐ kiến thức

             → Mục tiêu vĐ năng lực

             → Mục tiêu vĐ phẩm chất

             

        1.2. Nội dung và cách thực hiện

             → Mô tả chi tiết bản chất giải pháp

             → Cơ sở khoa hĐc của giải pháp

             → Điểm mới, sáng tạo

             

        1.3. Quy trình thực hiện (5-7 bước cụ thể)

             Bước 1: [Tên bước] - [Chi tiết cách làm]

             Bước 2: [Tên bước] - [Chi tiết cách làm]

             Bước 3: [Tên bước] - [Chi tiết cách làm]

             Bước 4: [Tên bước] - [Chi tiết cách làm]

             Bước 5: [Tên bước] - [Chi tiết cách làm]

             

        1.4. Ví dụ minh hĐa cụ thể

             → Bài hĐc trong SGK ${userInfo.textbook || "hiện hành"}

             → Hoạt động chi tiết với thĐi lượng

             → Sản phẩm hĐc sinh mẫu

             

        1.5. ĐiĐu kiện thực hiện & Lưu ý

             → Yêu cầu vĐ CSVC (tận dụng ${userInfo.facilities})

             → ĐiĐu kiện thành công

             → Những lưu ý quan trĐng



   GIẢI PHĐP 2: [Tên giải pháp cụ thể, ấn tượng]

        [Cấu trúc tương tự giải pháp 1, triển khai đầy đủ 5 mục]



   GIẢI PHĐP 3: [Tên giải pháp cụ thể, ấn tượng]

        [Cấu trúc tương tự giải pháp 1, triển khai đầy đủ 5 mục]

   ${(userInfo.numSolutions || 3) > 3 ? `

   GIẢI PHĐP 4: [Tên giải pháp mở rộng/nâng cao]

        [Giải pháp bổ trợ, ứng dụng công nghệ nâng cao]

   ${(userInfo.numSolutions || 3) > 4 ? `

   GIẢI PHĐP 5: [Tên giải pháp mở rộng/nâng cao]

        [Giải pháp phát triển, mở rộng đối tượng áp dụng]

   ` : ''}

   ` : ''}

   → MĐI LIÊN HỆ GIỮA CĐC GIẢI PHĐP (giải thích tính hệ thống, logic)



5. KẾT QUẢ ĐẠT ĐƯỢC (4-5 trang)



   5.1. Mục đích thực nghiệm

        → Kiểm chứng tính hiệu quả của sáng kiến

        → Đánh giá mức độ phù hợp với thực tiễn

        

   5.2. Nội dung thực nghiệm

        → Đối tượng: ${userInfo.researchSubjects || "HĐc sinh tại đơn vị"}

        → ThĐi gian: ${userInfo.timeframe || "Năm hĐc hiện tại"}

        → Phạm vi áp dụng

        

   5.3. Tổ chức thực nghiệm

        → Bảng so sánh kết quả TRƯỚC - SAU (dùng số liệu lẻ: 42.3%, 67.8%)

        → Biểu đồ minh hĐa

        → Phân tích, nhận xét kết quả

        → Đ kiến phản hồi từ hĐc sinh, đồng nghiệp



6. ĐIỀU KIỆN ĐỂ SĐNG KIẾN ĐƯỢC NHÂN RỘNG (1-2 trang)



   → ĐiĐu kiện vĐ CSVC

   → ĐiĐu kiện vĐ năng lực giáo viên

   → ĐiĐu kiện vĐ đối tượng hĐc sinh

   → Khả năng áp dụng tại các trưĐng khác



ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



📌 KẾT LUẬN VÀ KHUYẾN NGHỊ (2-3 trang)



1. Kết luận

   → Tóm tắt những đóng góp chính của sáng kiến

   → Điểm mới, điểm sáng tạo

   → Giá trị thực tiễn



2. Khuyến nghị  

   → Với nhà trưĐng

   → Với tổ chuyên môn

   → Với giáo viên

   → Với Phòng/Sở GD&ĐT

   → Hướng phát triển tiếp theo



ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



📚 TÀI LIỆU THAM KHẢO

   → Liệt kê 8-12 tài liệu theo chuẩn trích dẫn



📎 PHỤ LỤC

   → Phiếu khảo sát

   → Giáo án minh hĐa

   → Hình ảnh hoạt động

   → Sản phẩm hĐc sinh

`)

        }



ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ${(() => {
          const supplementary: string[] = [];
          if (userInfo.textbook) supplementary.push(`- 📚 Sách giáo khoa: "${userInfo.textbook}" → BẮT BUỘC mọi ví dụ, bài học minh họa phải theo đúng bộ sách "${userInfo.textbook}", TUYỆT ĐỐI KHÔNG ĐƯỢC dùng bộ sách khác`);
          if (userInfo.researchSubjects) supplementary.push(`- 👥 Đối tượng nghiên cứu: "${userInfo.researchSubjects}" → BẮT BUỘC đề cập chính xác thông tin này`);
          if (userInfo.timeframe) supplementary.push(`- 📅 Thời gian thực hiện: "${userInfo.timeframe}" → BẮT BUỘC sử dụng đúng mốc thời gian này`);
          if (userInfo.applyAI) supplementary.push(`- 🤖 Ứng dụng AI/Công nghệ: "${userInfo.applyAI}" → BẮT BUỘC tích hợp các công nghệ này vào giải pháp`);
          if (userInfo.focus) supplementary.push(`- 🎯 Đặc thù/Trọng tâm đề tài: "${userInfo.focus}" → BẮT BUỘC phản ánh trọng tâm này trong dàn ý`);

          if (supplementary.length === 0) return '';

          return `
═══════════════════════════════════════════
🚨🚨🚨 THÔNG TIN BỔ SUNG - BẮT BUỘC SỬ DỤNG CHÍNH XÁC 🚨🚨🚨
═══════════════════════════════════════════

⚠️ CẢNH BÁO NGHIÊM NGẶT: Giáo viên đã khai báo các thông tin bổ sung sau.
BẠN PHẢI SỬ DỤNG CHÍNH XÁC từng thông tin, TUYỆT ĐỐI KHÔNG ĐƯỢC:
- Thay thế bằng thông tin khác
- Bịa đặt hoặc tự ý thay đổi
- Bỏ qua bất kỳ thông tin nào

${supplementary.join('\n')}

🚫 VÍ DỤ LỖI NGHIÊM TRỌNG: Nếu giáo viên ghi sách "Kết nối tri thức" mà bạn viết "Cánh diều" → SAI HOÀN TOÀN!
✅ PHẢI dùng ĐÚNG NGUYÊN VĂN thông tin giáo viên đã cung cấp.
`;
        })()}

═══════════════════════════════════════════

YÊU CẦU DÀN Đ(NGẮN GỌN - CHỈ ĐẦU MỤC):

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



⚠Đ QUAN TRỌNG: Dàn ý phải NGẮN GỌN, chỉ liệt kê CĐC ĐẦU MỤC CHĐNH.

Nội dung chi tiết sẽ được triển khai ở các bước viết sau.



✓ ${userInfo.numSolutions || 3} GIẢI PHĐP - liệt kê TÊN giải pháp, không triển khai chi tiết

✓ Mỗi phần chỉ ghi tiêu đĐ mục và các ý chính(1 - 2 dòng mỗi ý)

✓ KHÔNG viết đoạn văn dài trong dàn ý

✓ KHÔNG triển khai chi tiết nội dung - chỉ gợi ý hướng đi

✓ Gợi ý danh sách phụ lục cần tạo(dựa trên các giải pháp)

✓ Phù hợp với đặc thù môn ${userInfo.subject} và cấp ${userInfo.level}

${isHigherEd ? `✓ SỬ DỤNG THUẬT NGỮ BẬC CAO: "sinh viên", "giảng viên", "giáo trình", "hĐc phần", "chuẩn đầu ra"

✓ Giải pháp phải có CƠ SỞ NGHIÊN CỨU KHOA HỌC, trích dẫn APA

✓ Cấu trúc chặt chẽ hơn: có Literature Review, Thiết kế nghiên cứu, Phân tích thống kê` : ''

        }

✓ Có thể triển khai ngay ở các bước sau



${getPageLimitPrompt() ? `

${getPageLimitPrompt()}



📋 LƯU Ý KHI LẬP DÀN Ý VỚI GIỚI HẠN TRANG:

- Dàn ý phải TƯƠNG XỨNG với số trang cho phép

- Nếu ít trang (≤25): Giảm số mục con, mỗi giải pháp chỉ 3-4 ý chính

- Nếu trung bình (25-40): Số mục con vừa phải, mỗi giải pháp 5-6 ý chính

- Nếu nhiều trang (>40): Có thể mở rộng, mỗi giải pháp 6-8 ý chính

- Đảm bảo dàn ý phản ánh đúng quy mô nội dung sẽ viết

` : ''

        }



ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

ĐỊNH DẠNG ĐẦU RA:

ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



Trình bày theo cấu trúc phân cấp rõ ràng(Markdown):

1. TÊN PHẦN LỚN

1.1.Tên mục nhĐ

        • Đ chi tiết 1

        • Đ chi tiết 2





Sử dụng icon để dễ nhìn: ✓ → • ○ ▪ ■



QUAN TRỌNG:

1. HIỂN THỊ "📱 MENU NAVIGATION" ĐẦU TIÊN(Bước 2: Đang thực hiện).

2. Cuối dàn ý, hiển thị hộp thoại xác nhận:

> ✅ **Đồng ý dàn ý này?**
>
> ✏️ Bạn có thể **CHỈNH SỬA** trực tiếp bằng nút "Chỉnh sửa" ở phía trên.

`;



      let generatedText = "";

      await sendMessageStream(initMessage, (chunk) => {

        generatedText += chunk;

        setState(prev => ({

          ...prev,

          fullDocument: generatedText // Initial document is just the outline

        }));

      }, () => {
        generatedText = "";
        setState(prev => ({ ...prev, fullDocument: '' }));
      });

      // Post-validation: Kiểm tra dàn ý có chứa nội dung vượt cấp không
      const gradeMatch = userInfo.grade.match(/\d+/);
      const gradeNum = gradeMatch ? gradeMatch[0] : '';
      if (gradeNum && !isHigherEd) {
        const validation = curriculumValidator.validateOutline(
          userInfo.subject, gradeNum, generatedText
        );
        if (!validation.isValid) {
          const warningText = `\n\n---\n⚠️ **CẢNH BÁO KIỂM TRA TỰ ĐỘNG:** ${validation.issues.join('. ')}.\n${validation.suggestions.join(' ')}\n\nVui lòng kiểm tra lại dàn ý và chỉnh sửa nếu cần.`;
          generatedText += warningText;
          setState(prev => ({ ...prev, fullDocument: generatedText }));
        }
      }

      setState(prev => ({ ...prev, isStreaming: false }));



    } catch (error: any) {

      // Thử xoay API key nếu lỗi quota/rate limit

      const errorType = parseApiError(error);

      if (errorType === 'QUOTA_EXCEEDED' || errorType === 'RATE_LIMIT') {

        const rotation = apiKeyManager.markKeyError(apiKey, errorType);

        if (rotation.success && rotation.newKey) {

          console.log(`🔄 Tự động xoay key: ${rotation.message} `);

          setApiKey(rotation.newKey);

          localStorage.setItem('gemini_api_key', rotation.newKey);

          initializeGeminiChat(rotation.newKey, selectedModel, currentProvider);

          // Tự động thử lại với key mới

          setState(prev => ({ ...prev, isStreaming: false, error: null }));

          setTimeout(() => startGeneration(), 500);

          return;

        }

      }

      setState(prev => ({ ...prev, isStreaming: false, error: error.message || "Failed to generate." }));

    }

  };



  // Regenerate Outline based on feedback

  const regenerateOutline = async () => {

    if (!outlineFeedback.trim()) return;



    try {

      setState(prev => ({ ...prev, isStreaming: true, error: null, fullDocument: '' }));



      const feedbackMessage = `

      BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái Bước 2(Lập Dàn Ý - Đang thực hiện).



      Dựa trên dàn ý đã lập, người dùng có yêu cầu chỉnh sửa sau:

"${outlineFeedback}"

      

      Hãy viết lại TOÀN BỘ Dàn ý chi tiết mới đã được cập nhật theo yêu cầu trên. 

      Vẫn đảm bảo cấu trúc chuẩn SKKN.

      

      Lưu ý các quy tắc định dạng:

- Xuống dòng sau mỗi câu.

      - Tách đoạn rõ ràng.

      

      Kết thúc phần dàn ý, hãy xuống dòng và hiển thị hộp thoại:

> ✅ **Đồng ý dàn ý này?**
>
> ✏️ Bạn có thể **CHỈNH SỬA** trực tiếp bằng nút "Chỉnh sửa" ở phía trên.

`;



      let generatedText = "";

      await sendMessageStream(feedbackMessage, (chunk) => {

        generatedText += chunk;

        setState(prev => ({

          ...prev,

          fullDocument: generatedText

        }));

      }, () => {
        generatedText = "";
        setState(prev => ({ ...prev, fullDocument: '' }));
      });

      // Post-validation cho dàn ý chỉnh sửa
      const gradeMatch2 = userInfo.grade.match(/\d+/);
      const gradeNum2 = gradeMatch2 ? gradeMatch2[0] : '';
      if (gradeNum2 && !isHigherEd) {
        const validation2 = curriculumValidator.validateOutline(
          userInfo.subject, gradeNum2, generatedText
        );
        if (!validation2.isValid) {
          const warningText = `\n\n---\n⚠️ **CẢNH BÁO KIỂM TRA TỰ ĐỘNG:** ${validation2.issues.join('. ')}.\n${validation2.suggestions.join(' ')}\n\nVui lòng kiểm tra lại dàn ý và chỉnh sửa nếu cần.`;
          generatedText += warningText;
          setState(prev => ({ ...prev, fullDocument: generatedText }));
        }
      }

      setState(prev => ({ ...prev, isStreaming: false }));

      setOutlineFeedback(""); // Clear feedback after sending



    } catch (error: any) {

      setState(prev => ({ ...prev, isStreaming: false, error: error.message }));

    }

  };



  // Generate Next Section

  const generateNextSection = async () => {

    let currentStepPrompt = "";

    let nextStepEnum = GenerationStep.PART_I_II;

    let shouldAppend = true; // Mặc định append nội dung vào fullDocument



    // Logic for OUTLINE step specifically handles manual edits synchronization

    if (state.step === GenerationStep.OUTLINE) {

      if (isCustomFlow) {

        const firstSection = validCustomSections[0];

        currentStepPrompt = `

BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái Bước 3(Viết ${firstSection.title} - Đang thực hiện).



Đây là bản DÀN Đ CHĐNH THỨC mà tôi đã chốt:

---

  ${state.fullDocument}

---



  NHIỆM VỤ TIẾP THEO:

Hãy bắt tay vào viết chi tiết phần đầu tiên theo cấu trúc mẫu: ** ${firstSection.title}**.



⚠️ BÁM SÁT MẪU YÊU CẦU:

Phần này trong mẫu gốc được định nghĩa là: ${firstSection.suggestedContent || "Không có hướng dẫn phụ"}

🌐 QUY ĐỊNH NGÔN NGỮ CHO PHẦN NÀY:
Phần này là "THÔNG TIN CHUNG VỀ SÁNG KIẾN" nên BẮT BUỘC PHẢI ĐƯỢC VIẾT BẰNG TIẾNG VIỆT (Trình bày đầy đủ: 1. Tên sáng kiến; 2. Lĩnh vực áp dụng; 3. Tác giả, chức vụ, đơn vị công tác; 4. Đối tượng áp dụng; 5. Thời gian áp dụng...).
Bắt đầu từ phần tiếp theo (Tóm tắt sáng kiến) mới bắt đầu viết bằng Tiếng Trung Giản Thể.
${isChineseSimplifiedHighSchoolSkkn ? `Không được chèn 中文摘要 hoặc bất kỳ nội dung tiếng Trung nào ở bước này.` : ''}



${SOLUTION_MODE_PROMPT}



⚠Đ LƯU Đ FORMAT:

- Viết từng câu xuống dòng riêng.

- Tách đoạn rõ ràng.

- Đảm bảo mạch lạc, ngôn ngữ hĐc thuật.

- KHÔNG viết dính chữ.



  ${getPageLimitPrompt()}

`;

        nextStepEnum = 2; // Step 2 is the first dynamic section

      } else {

        // We inject the CURRENT fullDocument (which might have been edited by user) into the prompt

        // This ensures the AI uses the user's finalized outline.

        currentStepPrompt = `

        BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái Bước 3(Viết Phần I & II - Đang thực hiện).

        

        Đây là bản DÀN Đ CHĐNH THỨC mà tôi đã chốt(tôi có thể đã chỉnh sửa trực tiếp). 

        Hãy DÙNG CHĐNH XĐC NỘI DUNG NÀY để làm cơ sở triển khai các phần tiếp theo, không tự ý thay đổi cấu trúc của nó:



--- BẮT ĐẦU DÀN Đ CHĐNH THỨC-- -

  ${state.fullDocument}

--- KẾT THÚC DÀN Đ CHĐNH THỨC-- -



  NHIỆM VỤ TIẾP THEO:

        Hãy tiếp tục BƯỚC 3: Viết chi tiết PHẦN I(Đặt vấn đĐ) và PHẦN II(Cơ sở lý luận).



  ${INTRO_GUIDE}



${THEORY_GUIDE}

        

        ⚠Đ LƯU Đ FORMAT:

- Viết từng câu xuống dòng riêng.

        - Tách đoạn rõ ràng.

        - Không viết dính chữ.

        - Menu Navigation: Đánh dấu Bước 2 đã xong(✅), Bước 3 đang làm(🔵).

        

        Viết sâu sắc, hĐc thuật, đúng cấu trúc đã đĐ ra.Lưu ý bám sát thông tin vĐ trưĐng và địa phương đã cung cấp.



        ⚠Đ NHẮC LẠI THÔNG TIN QUAN TRỌNG(BẮT BUỘC BĐM SĐT):

- Cấp hĐc: ${userInfo.level}

- Khối lớp / Đối tượng: ${userInfo.grade}

- Môn hĐc: ${userInfo.subject}

- TrưĐng: ${userInfo.school}

- Địa phương: ${userInfo.location}

        🚫 TUYỆT ĐĐI KHÔNG dùng thông tin của cấp hĐc khác(THPT, THCS...) nếu đĐ tài là cấp ${userInfo.level} !

  MĐi ví dụ, số liệu, thuật ngữ PHẢI phù hợp với cấp ${userInfo.level}, khối ${userInfo.grade}.



  ${getPageLimitPrompt()}

  ${getSectionPagePrompt('Phần I (Đặt vấn đĐ) + Phần II (Cơ sở lý luận)', 'partI_II')} `;



        nextStepEnum = GenerationStep.PART_I_II;

      }

    } else if (isCustomFlow && state.step >= 2) {

      const sectionIdx = state.step - 2;

      const appendixStep = 2 + validCustomSections.length;



      if (sectionIdx < validCustomSections.length - 1) {

        // Có phần tiếp theo

        const nextSection = validCustomSections[sectionIdx + 1];

        currentStepPrompt = `

BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái Bước ${state.step + 2} (Viết ${nextSection.title} - Đang thực hiện).



╔ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ╗

║  THÔNG TIN ĐỀ TÀI (BẮT BUỘC BĐM SĐT)                 ║

╚ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

ĐĐ tài: "${userInfo.topic}"

Môn: ${userInfo.subject} - Lớp: ${userInfo.grade} - Cấp: ${userInfo.level}

TrưĐng: ${userInfo.school}, ${userInfo.location}

SGK: ${userInfo.textbook} (🚨 BẮT BUỘC dùng đúng bộ sách này, KHÔNG dùng bộ sách khác)

CSVC: ${userInfo.facilities}



Tiếp tục viết chi tiết nội dung phần tiếp theo của SKKN: **${nextSection.title}**.



(Hướng dẫn từ mẫu gốc: ${nextSection.suggestedContent || "Không có hướng dẫn phụ"})

🌐 QUY ĐỊNH NGÔN NGỮ BẮT BUỘC (BẮT ĐẦU TỪ TÓM TẮT SÁNG KIẾN TRỞ ĐI):
Từ phần này trở đi (bao gồm Tóm tắt sáng kiến và tất cả các Chương I, II, III, IV, V, Tài liệu tham khảo, Phụ lục), TOÀN BỘ NỘI DUNG PHẢI ĐƯỢC VIẾT HOÀN TOÀN BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)!
- Văn phong: Ngữ văn học thuật Hán ngữ chuẩn mực, câu văn lưu loát, thuật ngữ sư phạm Hán ngữ chính xác.
- Nội dung: Toàn bộ các đề mục, nội dung phân tích, luận cứ lý luận, phân tích lỗi sai ngôn ngữ, giải pháp sư phạm, bài tập thực hành, bảng số liệu thực nghiệm và kết luận... ĐỀU PHẢI VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体字).
- Tiêu đề mục: Chỉ dùng tiếng Trung giản thể, không kèm phụ đề tiếng Việt; ví dụ: 中文摘要, 第一章 引言.
- Không được viết bất kỳ chữ tiếng Việt nào trong phần này, kể cả câu dẫn, chú thích, bản dịch, bảng biểu, tài liệu tham khảo và phụ lục.



${SOLUTION_MODE_PROMPT}



⚠Đ SĐ LƯỢNG GIẢI PHĐP ĐÃ CHỌN: ${userInfo.numSolutions || 3} GIẢI PHĐP

Nếu phần này liên quan đến mô tả giải pháp/biện pháp, BẮT BUỘC phải viết ĐỦ ${userInfo.numSolutions || 3} giải pháp.

Mỗi giải pháp phải có NỘI DUNG VÀ QUY TRÌNH chi tiết, VĐ DỤ MINH HỌA cụ thể.



${state.fullDocument ? `DÀN Đ ĐÃ DUYỆT (BẮT BUỘC BĐM SĐT):

${state.fullDocument.substring(0, 2000)}



⚠Đ Tên giải pháp, cấu trúc PHẢI TRÙNG KHỚP với dàn ý trên.` : ''}



${NATURAL_WRITING_TECHNIQUES}



⚠Đ LƯU Đ FORMAT:

- Viết từng câu xuống dòng riêng.

- Tách đoạn rõ ràng.

- Liên kết logic với phần trước đó.

- KHÔNG viết dính chữ.



  ${getPageLimitPrompt()}

`;

        nextStepEnum = state.step + 1;

      } else if (sectionIdx === validCustomSections.length - 1) {

        // Xong section cuối -> Sang Completed

        currentStepPrompt = `

✅ SKKN ĐÃ HOÀN THÀNH!



Bạn đã viết xong toàn bộ nội dung chính của SKKN theo đúng cấu trúc mẫu.



📌 BÂY GIỜ BẠN CÓ THỂ:

1. Xuất file Word để chỉnh sửa chi tiết

2. Tạo PHỤ LỤC chi tiết bằng nút "TẠO PHỤ LỤC"

  `;

        nextStepEnum = appendixStep + 1; // Completed step

        shouldAppend = false;

      }

    } else {

      // Standard flow for other steps

      const nextStepMap: Record<number, { prompt: string, nextStep: GenerationStep, skipAppend?: boolean }> = {

        [GenerationStep.PART_I_II]: {

          prompt: `

              BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái Bước 4(Viết Phần III - Đang thực hiện).



  ${REALITY_GUIDE}



              Tiếp tục BƯỚC 3(tiếp): Viết chi tiết PHẦN III(Thực trạng vấn đĐ). 

              Nhớ tạo bảng số liệu khảo sát giả định logic phù hợp với đối tượng nghiên cứu là: ${userInfo.researchSubjects || "HĐc sinh"}.

              Phân tích nguyên nhân và thực trạng tại ${userInfo.school}, ${userInfo.location} và điĐu kiện CSVC thực tế: ${userInfo.facilities}.

              

              ⚠Đ NHẮC LẠI: Đây là SKKN cấp ${userInfo.level}, khối ${userInfo.grade}, môn ${userInfo.subject}.

              MĐi nội dung, ví dụ, số liệu, đối tượng khảo sát PHẢI phù hợp với cấp ${userInfo.level}.

              🚫 TUYỆT ĐĐI KHÔNG nhầm sang THPT, THCS hoặc cấp hĐc khác nếu đĐ tài không thuộc cấp đó!

              

              ⚠Đ LƯU Đ FORMAT:

- Viết từng câu xuống dòng riêng.

              - Tách đoạn rõ ràng.

              - Bảng số liệu phải tuân thủ format Markdown chuẩn: | Tiêu đĐ | Số liệu |.

              

              🖼Đ GỢI Đ HÌNH ẢNH MINH HỌA(BẮT BUỘC):

              Trong phần Thực trạng, hãy gợi ý 1 - 2 vị trí nên đặt hình ảnh minh hĐa với format:

              ** [🖼Đ GỢI Đ HÌNH ẢNH: Mô tả chi tiết hình ảnh cần chụp / tạo - Đặt sau phần nào] **

  Ví dụ:

              ** [🖼Đ GỢI Đ HÌNH ẢNH: Biểu đồ cột thể hiện tỉ lệ hĐc sinh yếu / trung bình / khá / giĐi trước khi áp dụng sáng kiến - Đặt sau bảng khảo sát đầu năm] **

              ** [🖼Đ GỢI Đ HÌNH ẢNH: Ảnh chụp thực tế lớp hĐc / phòng thí nghiệm tại ${userInfo.school} - Đặt phần đặc điểm nhà trưĐng] **



  ${getPageLimitPrompt()}

  ${getSectionPagePrompt('Phần III (Thực trạng vấn đĐ)', 'partIII')} `,

          nextStep: GenerationStep.PART_III

        },

        [GenerationStep.PART_III]: {

          // ULTRA MODE INJECTION FOR PART IV START

          prompt: `

              BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái Bước 5(Viết Phần IV - Đang thực hiện).



  ${SOLUTION_MODE_PROMPT}

      

              ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

              🚀 THỰC THI NHIỆM VỤ(PHẦN IV - GIẢI PHĐP 1)

              ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

              

              Thông tin đĐ tài: "${userInfo.topic}"

Môn: ${userInfo.subject} - Lớp: ${userInfo.grade} - Cấp: ${userInfo.level}

TrưĐng: ${userInfo.school}, ${userInfo.location}

SGK: ${userInfo.textbook} (🚨 BẮT BUỘC dùng đúng bộ sách này, KHÔNG dùng bộ sách khác)

              Công nghệ / AI: ${userInfo.applyAI}

              CSVC hiện có: ${userInfo.facilities}

              TrĐng tâm đĐ tài: ${userInfo.focus || 'Theo dàn ý đã duyệt'}

              

              ╔ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ╗

              ║  🚨 DÀN Đ ĐÃ DUYỆT - BẮT BUỘC BĐM SĐT 🚨          ║

              ╚ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

              ${state.fullDocument ? `Dưới đây là DÀN Đ ĐÃ ĐƯỢC DUYỆT. Giải pháp 1 PHẢI viết ĐÚNG theo tên và nội dung đã ghi trong dàn ý:

              

${state.fullDocument.substring(0, 3000)}



⚠Đ BẮT BUỘC:

- Tên giải pháp PHẢI TRÙNG KHỚP với tên giải pháp trong dàn ý trên.

- Nội dung giải pháp PHẢI xoay quanh đĐ tài "${userInfo.topic}" và phù hợp với môn ${userInfo.subject}, cấp ${userInfo.level}.

- TUYỆT ĐĐI KHÔNG viết giải pháp lạc đĐ hoặc không liên quan đến đĐ tài.

- MĐi ví dụ, bài hĐc minh hĐa phải thuộc môn ${userInfo.subject}, khối ${userInfo.grade}.` : 'Chưa có dàn ý - viết theo đĐ tài.'}

              

              YÊU CẦU:

              Hãy viết chi tiết GIẢI PHĐP 1(Giải pháp trĐng tâm nhất) tuân thủ nghiêm ngặt 10 NGUYÊN TẮC VÀNG.

              Giải pháp phải khả thi với điĐu kiện CSVC: ${userInfo.facilities}.

              

              QUAN TRỌNG: Tuân thủ "YÊU CẦU ĐỊNH DẠNG OUTPUT" vừa cung cấp:

1. Xuống dòng sau mỗi câu.

              2. Xuống 2 dòng sau mỗi đoạn.

              3. Sử dụng Format "KẾT THÚC GIẢI PHĐP" ở cuối.

              

              Lưu ý đặc biệt: Phải có VĐ DỤ MINH HỌA(Giáo án / Hoạt động) cụ thể theo SGK ${userInfo.textbook}.

              Menu Navigation: Đánh dấu Bước 5 đang làm(🔵).

              

              🖼Đ GỢI Đ HÌNH ẢNH MINH HỌA(BắT BUỘC):

              Trong GIẢI PHĐP 1, hãy gợi ý 1 - 2 vị trí nên đặt hình ảnh minh hĐa với format:

              ** [🖼Đ GỢI Đ HÌNH ẢNH: Mô tả chi tiết hình ảnh - Đặt sau phần nào] **

  Ví dụ gợi ý cho Giải pháp 1:

              ** [🖼Đ GỢI Đ HÌNH ẢNH: Sơ đồ quy trình thực hiện giải pháp(5 - 7 bước) dạng flowchart - Đặt đầu mục Quy trình thực hiện] **

              ** [🖼Đ GỢI Đ HÌNH ẢNH: Ảnh chụp hĐc sinh thực hiện hoạt động / Ảnh miĐn hĐa hoạt động mẫu - Đặt trong phần Ví dụ minh hĐa] **



  ${getPageLimitPrompt()}

  ${getSectionPagePrompt('Giải pháp 1', 'perSolution')} `,

          nextStep: GenerationStep.PART_IV_SOL1

        },

        // GP1 → GP2 (viết liên tục, không review)
        [GenerationStep.PART_IV_SOL1]: (userInfo.numSolutions || 3) > 1
          ? {
            prompt: `
              BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái(Viết Giải pháp 2 - Đang thực hiện).

              Tiếp tục giữ vững vai trò CHUYÊN GIA GIÁO DỤC(ULTRA MODE).
              
              Nhiệm vụ: Viết chi tiết GIẢI PHÁP 2 cho đề tài: "${userInfo.topic}".
              Môn: ${userInfo.subject} - Lớp: ${userInfo.grade} - Cấp: ${userInfo.level}
              Trường: ${userInfo.school}, ${userInfo.location}
              
              ╔═══════════════════════════════════════════════════════════╗
              ║  🚨 NHẮC LẠI DÀN Ý - BẮT BUỘC BÁM SÁT 🚨          ║
              ╚══════════════════════════════════════════════════════════╝
              ⚠️ BẮT BUỘC: Tên GIẢI PHÁP 2 PHẢI TRÙNG KHỚP với tên giải pháp 2 trong dàn ý đã duyệt ở trên.
              Nội dung PHẢI xoay quanh đề tài "${userInfo.topic}", phù hợp môn ${userInfo.subject}.
              TUYỆT ĐỐI KHÔNG viết lạc đề hoặc chuyển sang chủ đề khác.
              
              Yêu cầu:
1. Nội dung độc đáo, KHÔNG trùng lặp với Giải pháp 1.
2. Tận dụng tối đa CSVC: ${userInfo.facilities}.
3. BẮT BUỘC TUÂN THỦ FORMAT "YÊU CẦU ĐỊNH DẠNG OUTPUT":
- Xuống dòng sau mỗi câu.
                 - Xuống 2 dòng sau mỗi đoạn.
                 - Có khung "KẾT THÚC GIẢI PHÁP" ở cuối.
              4. Phải có VÍ DỤ MINH HỌA cụ thể theo SGK ${userInfo.textbook} (🚨 ĐÚNG bộ sách này, KHÔNG dùng bộ sách khác).
              
              🖼️ GỢI Ý HÌNH ẢNH MINH HỌA(BẮT BUỘC):
              Trong GIẢI PHÁP 2, hãy gợi ý 1 - 2 vị trí nên đặt hình ảnh minh họa với format:
              ** [🖼️ GỢI Ý HÌNH ẢNH: Mô tả chi tiết hình ảnh - Đặt sau phần nào] **

  ${getPageLimitPrompt()}
  ${getSectionPagePrompt('Giải pháp 2', 'perSolution')} `,
            nextStep: GenerationStep.PART_IV_SOL2
          }
          : {
            prompt: `
                BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái(Kết luận & Khuyến nghị - Đang thực hiện).

  ${RESULT_GUIDE}

${CONCLUSION_GUIDE}

                Tiếp tục viết:

5. KẾT QUẢ ĐẠT ĐƯỢC(4 - 5 trang):
- 5.1.Mục đích thực nghiệm
  - 5.2.Nội dung thực nghiệm
    - 5.3.Tổ chức thực nghiệm(Bảng so sánh TRƯỚC - SAU với số liệu lẻ)

6. ĐIỀU KIỆN ĐỂ SÁNG KIẾN ĐƯỢC NHÂN RỘNG(1 - 2 trang)
                
                KẾT LUẬN VÀ KHUYẾN NGHỊ(2 - 3 trang)
                
                TÀI LIỆU THAM KHẢO(8 - 12 tài liệu)
                
                Đảm bảo số liệu phần Kết quả phải LOGIC.Sử dụng số liệu lẻ.
                
                🖼️ GỢI Ý HÌNH ẢNH MINH HỌA.

  ${getPageLimitPrompt()}
  ${getSectionPagePrompt('Kết quả + Kết luận + Khuyến nghị + Tài liệu tham khảo', 'partV_VI')} `,
            nextStep: GenerationStep.PART_V_VI
          },

        // GP2 → GP3 (viết liên tục, không review)
        [GenerationStep.PART_IV_SOL2]: (userInfo.numSolutions || 3) > 2
          ? {
            prompt: `
              BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái(Viết Giải pháp 3 - Đang thực hiện).

              Tiếp tục giữ vững vai trò CHUYÊN GIA GIÁO DỤC(ULTRA MODE).
              
              Nhiệm vụ: Viết chi tiết GIẢI PHÁP 3 cho đề tài: "${userInfo.topic}".
              Môn: ${userInfo.subject} - Lớp: ${userInfo.grade} - Cấp: ${userInfo.level}
              Trường: ${userInfo.school}, ${userInfo.location}
              
              ╔═══════════════════════════════════════════════════════════╗
              ║  🚨 NHẮC LẠI DÀN Ý - BẮT BUỘC BÁM SÁT 🚨          ║
              ╚══════════════════════════════════════════════════════════╝
              ⚠️ BẮT BUỘC: Tên GIẢI PHÁP 3 PHẢI TRÙNG KHỚP với tên giải pháp 3 trong dàn ý đã duyệt.
              Nội dung PHẢI xoay quanh đề tài "${userInfo.topic}", phù hợp môn ${userInfo.subject}.
              TUYỆT ĐỐI KHÔNG viết lạc đề hoặc chuyển sang chủ đề khác.
              
              Yêu cầu:
1. Nội dung độc đáo, KHÔNG trùng lặp với Giải pháp 1 và 2.
2. Tận dụng tối đa CSVC: ${userInfo.facilities}.
3. BẮT BUỘC TUÂN THỦ FORMAT "YÊU CẦU ĐỊNH DẠNG OUTPUT":
- Xuống dòng sau mỗi câu.
                 - Xuống 2 dòng sau mỗi đoạn.
                 - Có khung "KẾT THÚC GIẢI PHÁP" ở cuối.
              4. Phải có VÍ DỤ MINH HỌA cụ thể theo SGK ${userInfo.textbook} (🚨 ĐÚNG bộ sách này, KHÔNG dùng bộ sách khác).
              
              🖼️ GỢI Ý HÌNH ẢNH MINH HỌA(BẮT BUỘC):
              Trong GIẢI PHÁP 3, hãy gợi ý 1 - 2 vị trí nên đặt hình ảnh minh họa.

  ${getPageLimitPrompt()}
  ${getSectionPagePrompt('Giải pháp 3', 'perSolution')} `,
            nextStep: GenerationStep.PART_IV_SOL3
          }
          : {
            prompt: `
                BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái(Kết luận & Khuyến nghị - Đang thực hiện).

  ${RESULT_GUIDE}

${CONCLUSION_GUIDE}

                Tiếp tục viết:

5. KẾT QUẢ ĐẠT ĐƯỢC(4 - 5 trang):
- 5.1.Mục đích thực nghiệm
  - 5.2.Nội dung thực nghiệm
    - 5.3.Tổ chức thực nghiệm(Bảng so sánh TRƯỚC - SAU với số liệu lẻ)

6. ĐIỀU KIỆN ĐỂ SÁNG KIẾN ĐƯỢC NHÂN RỘNG(1 - 2 trang)
                
                KẾT LUẬN VÀ KHUYẾN NGHỊ(2 - 3 trang)
                
                TÀI LIỆU THAM KHẢO(8 - 12 tài liệu)
                
                Đảm bảo số liệu phần Kết quả phải LOGIC.Sử dụng số liệu lẻ.
                
                🖼️ GỢI Ý HÌNH ẢNH MINH HỌA.

  ${getPageLimitPrompt()}
  ${getSectionPagePrompt('Kết quả + Kết luận + Khuyến nghị + Tài liệu tham khảo', 'partV_VI')} `,
            nextStep: GenerationStep.PART_V_VI
          },

        // GP3 → GP4 hoặc PART_V_VI (viết liên tục)
        [GenerationStep.PART_IV_SOL3]: (userInfo.numSolutions || 3) > 3
          ? {
            prompt: `
                BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái(Viết Giải pháp 4 - Đang thực hiện).



                Tiếp tục giữ vững vai trò CHUYÊN GIA GIĐO DỤC(ULTRA MODE).

                

                Nhiệm vụ: Viết chi tiết GIẢI PHĐP 4(Mở rộng / Nâng cao) cho đĐ tài: "${userInfo.topic}".

                Môn: ${userInfo.subject} - Lớp: ${userInfo.grade} - Cấp: ${userInfo.level}

                

                ⚠Đ BẮT BUỘC: Tên GIẢI PHĐP 4 PHẢI TRÙNG KHỚP với dàn ý đã duyệt.

                Nội dung PHẢI xoay quanh đĐ tài "${userInfo.topic}", phù hợp môn ${userInfo.subject}.

                

                ⚠Đ LƯU Đ: Đây là giải pháp MỞ RỘNG và NÂNG CAO.

                Có thể là: Ứng dụng công nghệ / AI nâng cao, phát triển mở rộng đối tượng...

                

                Yêu cầu:

1. Nội dung độc đáo, KHÔNG trùng lặp với Giải pháp 1, 2, 3.

2. Tận dụng tối đa CSVC: ${userInfo.facilities}.

3. BẮT BUỘC TUÂN THỦ FORMAT.

                4. Phải có VĐ DỤ MINH HỌA cụ thể.



  ${getPageLimitPrompt()}

  ${getSectionPagePrompt('Giải pháp 4', 'perSolution')} `,

            nextStep: GenerationStep.PART_IV_SOL4

          }

          : {

            prompt: `

                BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái(Kết luận & Khuyến nghị - Đang thực hiện).



                Tiếp tục viết:



5. KẾT QUẢ ĐẠT ĐƯỢC(4 - 5 trang):

- 5.1.Mục đích thực nghiệm

  - 5.2.Nội dung thực nghiệm

    - 5.3.Tổ chức thực nghiệm(Bảng so sánh TRƯỚC - SAU với số liệu lẻ)



6. ĐIỀU KIỆN ĐỂ SĐNG KIẾN ĐƯỢC NHÂN RỘNG(1 - 2 trang)

                

                KẾT LUẬN VÀ KHUYẾN NGHỊ(2 - 3 trang)

                

                TÀI LIỆU THAM KHẢO(8 - 12 tài liệu)

                

                Đảm bảo số liệu phần Kết quả phải LOGIC.Sử dụng số liệu lẻ(42.3 %, 67.8 %).

                

                🖼Đ GỢI Đ HÌNH ẢNH MINH HỌA.



  ${getPageLimitPrompt()}

  ${getSectionPagePrompt('Kết quả + Kết luận + Khuyến nghị + Tài liệu tham khảo', 'partV_VI')} `,
            nextStep: GenerationStep.PART_V_VI
          },

        // GP4 → GP5 hoặc PART_V_VI (viết liên tục)
        [GenerationStep.PART_IV_SOL4]: (userInfo.numSolutions || 3) > 4
          ? {
            prompt: `
              BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái(Viết Giải pháp 5 - Đang thực hiện).
              Tiếp tục giữ vững vai trò CHUYÊN GIA GIÁO DỤC(ULTRA MODE).
              Nhiệm vụ: Viết chi tiết GIẢI PHÁP 5(Mở rộng cuối cùng) cho đề tài: "${userInfo.topic}".
              ⚠️ LƯU Ý: Đây là giải pháp MỞ RỘNG cuối cùng.
              Yêu cầu:
1. Nội dung độc đáo, KHÔNG trùng lặp với các giải pháp trước.
              2. Kết thúc bằng MỐI LIÊN HỆ GIỮA TẤT CẢ 5 GIẢI PHÁP(tính hệ thống, logic).
              3. BẮT BUỘC TUÂN THỦ FORMAT.
  ${getPageLimitPrompt()}
  ${getSectionPagePrompt('Giải pháp 5', 'perSolution')} `,
            nextStep: GenerationStep.PART_IV_SOL5
          }
          : {
            prompt: `
                BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái(Kết luận & Khuyến nghị - Đang thực hiện).
  ${RESULT_GUIDE}
${CONCLUSION_GUIDE}
                Tiếp tục viết:
5. KẾT QUẢ ĐẠT ĐƯỢC(4 - 5 trang):
- 5.1.Mục đích thực nghiệm
  - 5.2.Nội dung thực nghiệm
    - 5.3.Tổ chức thực nghiệm(Bảng so sánh TRƯỚC - SAU với số liệu lẻ)
6. ĐIỀU KIỆN ĐỂ SÁNG KIẾN ĐƯỢC NHÂN RỘNG(1 - 2 trang)
                KẾT LUẬN VÀ KHUYẾN NGHỊ(2 - 3 trang)
                TÀI LIỆU THAM KHẢO(8 - 12 tài liệu)
                Đảm bảo số liệu phần Kết quả phải LOGIC. Sử dụng số liệu lẻ.
                🖼️ GỢI Ý HÌNH ẢNH MINH HỌA.
  ${getPageLimitPrompt()}
  ${getSectionPagePrompt('Kết quả + Kết luận + Khuyến nghị + Tài liệu tham khảo', 'partV_VI')} `,
            nextStep: GenerationStep.PART_V_VI
          },

        // GP5 → PART_V_VI (viết liên tục)
        [GenerationStep.PART_IV_SOL5]: {
          prompt: `
              BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái(Kết luận & Khuyến nghị - Đang thực hiện).
  ${RESULT_GUIDE}
${CONCLUSION_GUIDE}
              Tiếp tục viết:
5. KẾT QUẢ ĐẠT ĐƯỢC(4 - 5 trang):
- 5.1.Mục đích thực nghiệm
  - 5.2.Nội dung thực nghiệm
    - 5.3.Tổ chức thực nghiệm(Bảng so sánh TRƯỚC - SAU với số liệu lẻ)
6. ĐIỀU KIỆN ĐỂ SÁNG KIẾN ĐƯỢC NHÂN RỘNG(1 - 2 trang)
              KẾT LUẬN VÀ KHUYẾN NGHỊ(2 - 3 trang)
              TÀI LIỆU THAM KHẢO(8 - 12 tài liệu)
              Đảm bảo số liệu phần Kết quả phải LOGIC. Sử dụng số liệu lẻ.
              🖼️ GỢI Ý HÌNH ẢNH MINH HỌA.
  ${getPageLimitPrompt()}
  ${getSectionPagePrompt('Kết quả + Kết luận + Khuyến nghị + Tài liệu tham khảo', 'partV_VI')} `,
          nextStep: GenerationStep.PART_V_VI
        },


        // PART_V_VI → COMPLETED

        [GenerationStep.PART_V_VI]: {

          prompt: `

              ✅ SKKN ĐÃ HOÀN THÀNH!

              

              Bạn đã viết xong toàn bộ nội dung chính của SKKN.

              Bao gồm: Đặt vấn đĐ, Cơ sở lý luận, Thực trạng, Giải pháp, Kết quả và Kết luận.

              

              📌 BÂY GIỜ BẠN CÓ THỂ:

1. Xuất file Word để chỉnh sửa chi tiết

2. Tạo PHỤ LỤC chi tiết bằng nút "TẠO PHỤ LỤC"

3. Kiểm tra lại nội dung và định dạng

              

              Chúc mừng bạn đã hoàn thành bản thảo SKKN!`,

          nextStep: GenerationStep.COMPLETED,

          skipAppend: true // Không append thông báo hoàn thành vào fullDocument

        }

      };

      const stepConfig = nextStepMap[state.step];

      if (!stepConfig) return;

      currentStepPrompt = stepConfig.prompt;

      nextStepEnum = stepConfig.nextStep;

      // Các bước chuyển tiếp (HOÀN THÀNH GP, COMPLETED) không append vào fullDocument

      shouldAppend = !stepConfig.skipAppend;

    }



    if (!currentStepPrompt) return;



    setState(prev => ({ ...prev, isStreaming: true, error: null, step: nextStepEnum }));



    try {

      let sectionText = "\n\n---\n\n"; // Separator

      await sendMessageStream(currentStepPrompt, (chunk) => {

        sectionText += chunk;

        if (shouldAppend) {

          setState(prev => ({

            ...prev,

            fullDocument: prev.fullDocument + chunk

          }));

        }

      });



      // Just set streaming to false, step was already set

      setState(prev => ({ ...prev, isStreaming: false }));
      scheduleAutoWriteNext(nextStepEnum);



    } catch (error: any) {

      // Thử xoay API key nếu lỗi quota/rate limit

      const errorType = parseApiError(error);

      if (errorType === 'QUOTA_EXCEEDED' || errorType === 'RATE_LIMIT') {

        const rotation = apiKeyManager.markKeyError(apiKey, errorType);

        if (rotation.success && rotation.newKey) {

          console.log(`🔄 Tự động xoay key: ${rotation.message} `);

          setApiKey(rotation.newKey);

          localStorage.setItem('gemini_api_key', rotation.newKey);

          initializeGeminiChat(rotation.newKey, selectedModel, currentProvider);

          // Tự động thử lại với key mới

          setState(prev => ({ ...prev, isStreaming: false, error: null }));

          setTimeout(() => generateNextSection(), 500);

          return;

        }

      }

      setState(prev => ({ ...prev, isStreaming: false, error: error.message }));

    }

  };


  latestGenerateNextSectionRef.current = generateNextSection;


  // Export to Word

  const exportToWord = async () => {

    try {

      const { exportMarkdownToDocx } = await import('./services/docxExporter');

      const filename = `SKKN_${userInfo.topic.substring(0, 30).replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_')}.docx`;

      // TruyĐn headerFields để tạo phần đầu SKKN trong Word

      const templateHeaderFields = customTemplateData?.headerFields || {};

      await exportMarkdownToDocx(state.fullDocument, filename, templateHeaderFields, {

        topic: userInfo.topic,

        school: userInfo.school,

        location: userInfo.location,

        subject: userInfo.subject,

      });

    } catch (error: any) {

      console.error('Export error:', error);

      alert('Có lỗi khi xuất file. Vui lòng thử lại.');

    }

  };















  // Generate Appendix - Function riêng để tạo phụ lục

  const generateAppendix = async () => {

    if (!apiKey) {

      setShowApiModal(true);

      return;

    }



    setIsAppendixLoading(true);



    // Khởi tạo lại chat session với API key hiện tại (quan trĐng khi user thay đổi API key)

    initializeGeminiChat(apiKey, selectedModel, currentProvider);



    try {

      const appendixPrompt = `

        BẮT ĐẦU phản hồi bằng MENU NAVIGATION trạng thái Bước 8(Tạo Phụ lục chi tiết - Đang thực hiện).



        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        📎 NHIỆM VỤ: TẠO ĐẦY ĐỦ CĐC TÀI LIỆU PHỤ LỤC

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        

        ⚠Đ QUAN TRỌNG: Bạn PHẢI dựa vào NỘI DUNG SKKN ĐÃ VIẾT bên dưới để tạo phụ lục.

        Các phụ lục phải KHỚP với nội dung, số liệu, giải pháp đã đĐ cập trong SKKN.

        KHÔNG tạo phụ lục liên quan đến hình ảnh, video(vì không thể hiển thị).

        

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        📄 NỘI DUNG SKKN ĐÃ VIẾT(ĐỌC KỸ ĐỂ TẠO PHỤ LỤC PHÙ HỢP):

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        

        ${state.fullDocument}

        

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        📋 THÔNG TIN ĐỀ TÀI:

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

- Tên đĐ tài: ${userInfo.topic}

- Môn hĐc: ${userInfo.subject}

- Cấp hĐc: ${userInfo.level}

- Khối lớp: ${userInfo.grade}

- TrưĐng: ${userInfo.school}

- Địa điểm: ${userInfo.location}

- CSVC: ${userInfo.facilities}

- SGK: ${userInfo.textbook || "Hiện hành"}

        

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        📎 YÊU CẦU TẠO PHỤ LỤC:

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ



${APPENDIX_GUIDE}

        

        Dựa trên NỘI DUNG SKKN ĐÃ VIẾT ở trên, hãy tạo ĐẦY ĐỦ, CHI TIẾT từng tài liệu phụ lục sau:



        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        📋 PHỤ LỤC 1: PHIẾU KHẢO SĐT ĐĐNH GIĐ MỨC ĐỘ HỨNG THÚ VÀ HIỆU QUẢ HỌC TẬP CỦA HỌC SINH

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        

        ** PHẦN A: PHIẾU KHẢO SĐT TRƯỚC KHI ĐP DỤNG SĐNG KIẾN **



  Tạo bảng khảo sát với format:

        | STT | Nội dung khảo sát | 1 | 2 | 3 | 4 | 5 |

        | -----| -------------------| ---| ---| ---| ---| ---|

        | 1 | [Nội dung câu hĐi vĐ mức độ hứng thú với môn ${userInfo.subject}] | | | | | |

        | 2 | [Nội dung câu hĐi vĐ khó khăn khi hĐc] | | | | | |

        ...

        

        Ghi chú: 1 = Rất không đồng ý, 2 = Không đồng ý, 3 = Bình thưĐng, 4 = Đồng ý, 5 = Rất đồng ý

        

        Nội dung câu hĐi(10 - 12 câu):

- Mức độ hứng thú với môn hĐc

  - Cảm nhận vĐ phương pháp dạy hĐc hiện tại

    - Mức độ tham gia hoạt động hĐc tập

      - Khả năng tự hĐc, tự nghiên cứu

        - Mức độ khó khăn khi tiếp thu kiến thức

          - Hiệu quả ghi nhớ kiến thức

            - Kỹ năng vận dụng kiến thức vào thực tế



              ** PHẦN B: PHIẾU KHẢO SĐT SAU KHI ĐP DỤNG SĐNG KIẾN **



                Tạo bảng khảo sát tương tự với 12 - 15 câu hĐi vĐ:

- Mức độ hứng thú sau khi áp dụng sáng kiến

  - Hiệu quả của phương pháp mới

    - Khả năng tiếp thu kiến thức

      - Sự cải thiện kết quả hĐc tập

        - Mong muốn tiếp tục hĐc theo phương pháp mới



        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        📋 PHỤ LỤC 2: PHIẾU KHẢO SĐT GIĐO VIÊN VỀ THỰC TRẠNG DẠY HỌC

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

- Viết phiếu khảo sát HOÀN CHỈNH với 10 - 15 câu hĐi

  - Dạng câu hĐi: Trắc nghiệm mức độ(Rất thưĐng xuyên / ThưĐng xuyên / Thỉnh thoảng / Hiếm khi / Không bao giĐ)

    - Nội dung: Khảo sát thực trạng sử dụng phương pháp / công nghệ liên quan đến "${userInfo.topic}"

      - Format: Bảng Markdown chuẩn với đầy đủ các cột

        | STT | Nội dung | Rất thưĐng xuyên | ThưĐng xuyên | Thỉnh thoảng | Hiếm khi | Không bao giĐ |

        | -----| ----------| ------------------| --------------| --------------| ----------| ---------------|

        

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        📋 PHỤ LỤC 3: GIĐO ĐN MINH HỌA(Theo Công văn 5512 / BGDĐT ngày 18 / 12 / 2020)

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        

        ** KHUNG KẾ HOẠCH BÀI DẠY **

  (Kèm theo Công văn số 5512 / BGDĐT - GDTrH ngày 18 tháng 12 năm 2020 của Bộ GDĐT)



TrưĐng: ${userInfo.school}

Tổ: [Tổ chuyên môn]

        HĐ và tên giáo viên: ……………………

        

        ** TÊN BÀI DẠY: [ChĐn một bài cụ thể từ SGK ${userInfo.textbook || "hiện hành"} phù hợp với đĐ tài] **

  Môn hĐc: ${userInfo.subject}; Lớp: ${userInfo.grade}

        ThĐi gian thực hiện: [Số tiết]



  ** I.MỤC TIÊU **



    1. VĐ kiến thức:

- Nêu cụ thể nội dung kiến thức hĐc sinh cần hĐc



2. VĐ năng lực:

- Năng lực chung: [Tự chủ và tự hĐc, giao tiếp và hợp tác, giải quyết vấn đĐ]

  - Năng lực đặc thù: [Năng lực đặc thù môn ${userInfo.subject}]



3. VĐ phẩm chất:

- Trách nhiệm, chăm chỉ, trung thực trong hĐc tập



  ** II.THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU **

    - Giáo viên: [Liệt kê thiết bị, tài liệu GV chuẩn bị]

      - HĐc sinh: [Liệt kê những gì HS cần chuẩn bị]

        - ĐiĐu kiện CSVC: ${userInfo.facilities}

        

        ** III.TIẾN TRÌNH DẠY HỌC **

        

        ** 1. Hoạt động 1: Mở đầu / Khởi động(...phút) **

  a) Mục tiêu: Tạo hứng thú, xác định vấn đĐ / nhiệm vụ hĐc tập

        b) Nội dung: [Mô tả cụ thể hoạt động]

        c) Sản phẩm: [Kết quả hĐc sinh đạt được]

        d) Tổ chức thực hiện:

- Giao nhiệm vụ: [GV giao nhiệm vụ cụ thể]

  - Thực hiện: [HS thực hiện, GV theo dõi hỗ trợ]

    - Báo cáo, thảo luận: [HS báo cáo, GV tổ chức thảo luận]

      - Kết luận, nhận định: [GV kết luận, chuyển tiếp]



        ** 2. Hoạt động 2: Hình thành kiến thức mới(...phút) **

          a) Mục tiêu: Giúp HS chiếm lĩnh kiến thức mới

        b) Nội dung: [Mô tả cụ thể các nhiệm vụ hĐc tập]

        c) Sản phẩm: [Kiến thức, kỹ năng HS cần đạt được]

        d) Tổ chức thực hiện:

- Giao nhiệm vụ: [Chi tiết]

  - Thực hiện: [Chi tiết - TĐCH HỢP CÔNG CỤ / PHƯƠNG PHĐP CỦA GIẢI PHĐP 1]

    - Báo cáo, thảo luận: [Chi tiết]

      - Kết luận, nhận định: [Chi tiết]



        ** 3. Hoạt động 3: Luyện tập(...phút) **

          a) Mục tiêu: Củng cố, vận dụng kiến thức đã hĐc

        b) Nội dung: [Hệ thống câu hĐi, bài tập]

        c) Sản phẩm: [Đáp án, lĐi giải của HS]

        d) Tổ chức thực hiện: [Chi tiết các bước]



  ** 4. Hoạt động 4: Vận dụng(...phút) **

    a) Mục tiêu: Phát triển năng lực vận dụng vào thực tiễn

        b) Nội dung: [Nhiệm vụ / tình huống thực tiễn]

        c) Sản phẩm: [Báo cáo, sản phẩm của HS]

        d) Tổ chức thực hiện: [Giao vĐ nhà hoặc thực hiện trên lớp]



        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        📋 PHỤ LỤC 4: PHIẾU HỌC TẬP / RUBRIC ĐĐNH GIĐ

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

- Phiếu hĐc tập mẫu cho hoạt động nhóm

  - Rubric đánh giá sản phẩm hĐc sinh(theo 4 mức: Tốt, Khá, Đạt, Chưa đạt)

    - Bảng tiêu chí đánh giá với các mức độ rõ ràng



        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        📋 PHỤ LỤC 5: BÀI TẬP MẪU / CÂU HỎI ÔN TẬP

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

- 5 - 7 bài tập mẫu / câu hĐi ôn tập

  - Có đáp án và hướng dẫn chấm điểm

    - Nếu môn Toán: Sử dụng LaTeX cho công thức



        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        📋 PHỤ LỤC 6: BẢNG TỔNG HỢP KẾT QUẢ KHẢO SĐT(MINH CHỨNG CHO BẢNG DỮ LIỆU SKKN)

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

- Bảng tổng hợp kết quả khảo sát TRƯỚC thực nghiệm(số lượng, tỷ lệ %)

  - Bảng tổng hợp kết quả khảo sát SAU thực nghiệm

    - Bảng so sánh kết quả TRƯỚC - SAU để minh chứng cho các bảng số liệu trong SKKN

      - Số liệu phải LOGIC và KHỚP với các bảng trong phần Kết quả của SKKN



        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        ⚠Đ YÊU CẦU FORMAT VÀ NỘI DUNG(BẮT BUỘC):

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        

        📌 VỀ NỘI DUNG:

- VIẾT ĐẦY ĐỦ NỘI DUNG thực tế cho từng phụ lục, KHÔNG viết tắt hay bĐ sót

  - Phiếu khảo sát phải có ĐẦY ĐỦ 10 - 15 câu hĐi cụ thể(không ghi "...")

    - Giáo án minh hĐa phải VIẾT CHI TIẾT từng hoạt động, có lĐi thoại GV - HS mẫu

      - Rubric phải có ĐẦY ĐỦ tiêu chí và mô tả các mức độ

        - Bài tập mẫu phải có ĐẦY ĐỦ đĐ bài và đáp án / hướng dẫn giải

          - Số liệu bảng tổng hợp phải KHỚP với số liệu trong phần Kết quả SKKN

            - Nếu dàn ý SKKN có đĐ cập phụ lục khác(chưa liệt kê ở trên), hãy TẠO THÊM

        

        📌 VỀ FORMAT:

- Markdown chuẩn, bảng dùng | ---|

  - BẢNG PHẢI CÓ ĐẦY ĐỦ TẤT CẢ CĐC CỘT, không được bĐ sót cột nào

    - Mỗi hàng trong bảng phải có đủ số ô tương ứng với số cột ở header

      - Bảng phải bắt đầu từ đầu dòng(không thụt lĐ)

        - Xuống dòng sau mỗi câu

          - Tách đoạn rõ ràng

            - Đánh số phụ lục rõ ràng: PHỤ LỤC 1, PHỤ LỤC 2...

        - KHÔNG ghi "...", "[nội dung]", "[điĐn vào]" - phải viết nội dung thực tế

        

        📌 KHÔNG TẠO:

- Phụ lục hình ảnh, video, ảnh chụp màn hình(không thể hiển thị)

  - Phụ lục yêu cầu file đính kèm

        

        Đ KẾT THÚC bằng dòng:

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ

        ✅ HOÀN THÀNH TẠO TÀI LIỆU PHỤ LỤC

        ĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐĐ`;



      let generatedAppendix = "";

      await sendMessageStream(appendixPrompt, (chunk) => {

        generatedAppendix += chunk;

        setAppendixDocument(generatedAppendix);

      });



      setIsAppendixLoading(false);

    } catch (error: any) {

      console.error('Generate Appendix error:', error);

      alert('Có lỗi khi tạo phụ lục. Vui lòng thử lại.');

      setIsAppendixLoading(false);

    }

  };



  // Export Appendix to Word - Xuất phụ lục thành file Word riêng

  const exportAppendixToWord = async () => {

    try {

      const { exportMarkdownToDocx } = await import('./services/docxExporter');

      const filename = `SKKN_Phuluc_${userInfo.topic.substring(0, 30).replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_')}.docx`;

      await exportMarkdownToDocx(appendixDocument, filename);

    } catch (error: any) {

      console.error('Export Appendix error:', error);

      alert('Có lỗi khi xuất file phụ lục. Vui lòng thử lại.');

    }

  };



  // Render Logic

  const renderSidebar = () => {

    return (

      <div className="w-full lg:w-80 bg-gradient-to-b from-white to-sky-50 border-r border-sky-100 p-6 flex-shrink-0 flex flex-col h-full overflow-y-auto shadow-[4px_0_24px_rgba(56,189,248,0.08)]">

        <div className="mb-8">

          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-sky-500 flex items-center gap-2" style={{ fontFamily: 'Nunito, sans-serif' }}>

            <Wand2 className="h-6 w-6 text-orange-500" />

            SKKN 2026 PRO

          </h1>

          <p className="text-xs text-orange-800 font-medium mt-1.5 tracking-wide">✨ TRỢ LÝ VIẾT MỌI MẪU SKKN CÁC SỞ</p>

        </div>



        {/* Progress Stepper */}

        <div className="space-y-6">

          {Object.entries(currentStepsInfo).map(([key, info]) => {

            const stepNum = parseInt(key);



            if (isCustomFlow) {

              const appendixStep = 2 + validCustomSections.length;

              if (stepNum >= appendixStep) return null; // Ẩn Phụ lục và Hoàn tất trên sidebar

            } else {

              // Luôn ẩn step Phụ lục (10) và Hoàn tất (11)
              if (stepNum > 9) return null;
              // Ẩn step Giải pháp 4 (7), GP5 (8) nếu numSolutions <= 3
              if (stepNum >= 7 && stepNum <= 8 && (userInfo.numSolutions || 3) <= 3) return null;

            }



            let statusColor = "text-gray-400 border-gray-200";

            let icon = <div className="w-2 h-2 rounded-full bg-gray-300" />;



            // ERROR STATE HANDLING

            if (state.error && state.step === stepNum) {

              statusColor = "text-red-600 border-red-600 bg-red-50";

              icon = <AlertTriangle className="w-4 h-4 text-red-600" />;

            }

            else if (state.step === stepNum && state.isStreaming) {

              statusColor = "text-sky-600 border-sky-600 bg-sky-50";

              icon = <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />;

            } else if (state.step > stepNum) {

              statusColor = "text-sky-800 border-sky-200";

              icon = <CheckCircle className="w-4 h-4 text-sky-600" />;

            } else if (state.step === stepNum) {

              statusColor = "text-sky-600 border-sky-600 font-bold";

              icon = <div className="w-2 h-2 rounded-full bg-sky-600" />;

            }



            // Cho phép click vào các step đã hoàn thành để quay lại sửa

            const isClickable = state.step > stepNum && !state.isStreaming;

            const handleStepClick = () => {

              if (isClickable) {

                setState(prev => ({ ...prev, step: stepNum }));

              }

            };



            return (

              <div

                key={key}

                onClick={handleStepClick}

                className={`flex items - start pl - 4 border - l - 2 ${statusColor.includes('border-sky') ? 'border-sky-500' : statusColor.includes('border-red') ? 'border-red-500' : 'border-gray-200'} py - 1 transition - all ${isClickable ? 'cursor-pointer hover:bg-sky-50 rounded-r-lg' : ''} `}

              >

                <div className="flex-1">

                  <h4 className={`text - sm ${statusColor.includes('text-sky') ? 'text-sky-900' : statusColor.includes('text-red') ? 'text-red-700' : 'text-gray-500'} font - medium`}>

                    {state.error && state.step === stepNum ? "Đã dừng do lỗi" : info.label}

                  </h4>

                  <p className="text-xs text-gray-400">{info.description}</p>

                </div>

                <div className="ml-2 mt-1">

                  {icon}

                </div>

              </div>

            );

          })}

        </div>



        <div className="mt-auto pt-6 border-t border-gray-100">

          {state.step > GenerationStep.INPUT_FORM && (

            <div className="space-y-3">

              <div className="p-3 bg-gray-50 rounded text-xs text-gray-500 border border-gray-100">

                <span className="font-bold block text-gray-900">ĐĐ tài:</span>

                {userInfo.topic}

              </div>



              {/* Session persistence buttons */}

              <div className="flex gap-2">

                <button

                  onClick={saveSession}

                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium transition-colors border border-emerald-200"

                  title="Lưu phiên làm việc"

                >

                  <Save size={13} />

                  Lưu phiên

                </button>

                <button

                  onClick={() => {

                    if (confirm('Xóa phiên đã lưu? Bạn sẽ không thể khôi phục lại.')) {

                      clearSavedSession();

                    }

                  }}

                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors border border-red-200"

                  title="Xóa phiên đã lưu"

                >

                  <Trash2 size={13} />

                </button>

              </div>

              {sessionSavedAt && (

                <p className="text-[10px] text-gray-400 text-center">

                  💾 Lưu lúc {sessionSavedAt}

                </p>

              )}



              <label className="flex items-start gap-2.5 p-3 bg-sky-50 border border-sky-200 rounded-lg cursor-pointer hover:bg-sky-100 transition-colors">
                <input
                  type="checkbox"
                  checked={autoWriteNext}
                  onChange={(event) => setAutoWriteNext(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-sky-600"
                />
                <span className="text-xs text-sky-800">
                  <span className="block font-semibold">Tự động viết phần tiếp theo</span>
                  <span className="block mt-0.5 text-sky-600">Tự chuyển sang mục kế tiếp sau khi viết xong.</span>
                </span>
              </label>

              {/* Controls */}

              {state.isStreaming ? (
                <div className="space-y-2">
                  <Button disabled className="w-full" isLoading>Đang viết...</Button>
                  <button
                    onClick={() => {
                      abortCurrentStream();
                      setState(prev => ({ ...prev, isStreaming: false, error: 'Đã hủy yêu cầu. Bấm thử lại để tiếp tục.' }));
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    ⏹ Hủy yêu cầu
                  </button>
                </div>

              ) : (

                state.step < GenerationStep.COMPLETED && (

                  <>

                    {/* Feedback / Review Section only for OUTLINE Step */}

                    {state.step === GenerationStep.OUTLINE && (

                      <div className="mb-2 space-y-2 border-t border-gray-100 pt-2">

                        <p className="text-sm font-semibold text-sky-700">ĐiĐu chỉnh:</p>



                        <div className="text-xs text-gray-500 italic mb-2">

                          💡 Mẹo: Bạn có thể sửa trực tiếp Dàn ý ở màn hình bên phải trước khi bấm "Chốt & Viết tiếp".

                        </div>



                        <textarea

                          value={outlineFeedback}

                          onChange={(e) => setOutlineFeedback(e.target.value)}

                          placeholder="Hoặc nhập yêu cầu để AI viết lại..."

                          className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-sky-500 focus:border-sky-500"

                          rows={3}

                        />

                        <Button

                          variant="secondary"

                          onClick={regenerateOutline}

                          disabled={!outlineFeedback.trim()}

                          className="w-full text-sm"

                          icon={<RefreshCw size={14} />}

                        >

                          Yêu cầu AI viết lại

                        </Button>

                      </div>

                    )}



                    <Button onClick={generateNextSection} className="w-full" icon={<ChevronRight size={16} />}>

                      {state.step === GenerationStep.OUTLINE ? 'Chốt Dàn ý & Viết tiếp' : 'Viết phần tiếp theo'}

                    </Button>

                  </>

                )

              )}



              {/* Nút xuất Word SKKN (luôn hiển thị khi đã có nội dung) */}

              {(state.step >= GenerationStep.OUTLINE) && (

                <Button variant="secondary" onClick={exportToWord} className="w-full" icon={<Download size={16} />}>

                  Xuất file Word SKKN

                </Button>

              )}



              {/* Sau khi hoàn thành SKKN: hiển thị các nút phụ lục */}

              {state.step >= GenerationStep.COMPLETED && (

                <>

                  {!appendixDocument ? (

                    <Button

                      onClick={generateAppendix}

                      isLoading={isAppendixLoading}

                      className="w-full bg-emerald-600 hover:bg-emerald-700"

                      icon={<FileText size={16} />}

                    >

                      {isAppendixLoading ? 'Đang tạo phụ lục...' : 'TẠO PHỤ LỤC'}

                    </Button>

                  ) : (

                    <Button

                      variant="secondary"

                      onClick={exportAppendixToWord}

                      className="w-full border-emerald-500 text-emerald-700 hover:bg-emerald-50"

                      icon={<Download size={16} />}

                    >

                      Xuất Word Phụ lục

                    </Button>

                  )}

                </>

              )}

            </div>

          )}

        </div>

      </div>

    );

  };



  // Handler: Template analyzed → go to SETUP_INFO

  const handleTemplateAnalyzed = useCallback((rawContent: string, template: SKKNTemplate | null, fileName: string) => {

    // Save to userInfo

    handleUserChange('skknTemplate', rawContent);

    if (template) {

      handleUserChange('customTemplate', JSON.stringify(template) as any);

      setTemplateSectionsCount(template.sections.length);



      // Auto-fill pageLimit nếu mẫu ghi rõ số trang

      if (template.pageLimitFromTemplate && template.pageLimitFromTemplate > 0) {

        handleUserChange('pageLimit', template.pageLimitFromTemplate as any);

      }

    }

    // Tự động tối ưu các trường mặc định cho Tiếng Trung THPT nếu chưa có
    setUserInfo(prev => ({
      ...prev,
      subject: prev.subject || 'Tiếng Trung (Tiếng Hán Giản Thể)',
      level: prev.level || 'THPT',
      grade: prev.grade || 'Lớp 10, 11, 12',
      textbook: prev.textbook || 'Tiếng Trung Quốc 10, 11, 12 (GDPT 2018)',
      referenceDocuments: prev.referenceDocuments || OFFICIAL_TIENG_TRUNG_DOCS_BUNDLE,
    }));

    setTemplateFileName(fileName);

    setWizardStep(WizardStep.SETUP_INFO);

  }, [handleUserChange]);



  // Handler: Skip template → nạp mẫu chuẩn của Bộ GD&ĐT (Tiếng Trung THPT)

  const handleSkipTemplate = useCallback(() => {

    handleTemplateAnalyzed(
      STANDARD_MOET_TIENG_TRUNG_TEMPLATE.rawContent,
      STANDARD_MOET_TIENG_TRUNG_TEMPLATE,
      STANDARD_MOET_TIENG_TRUNG_TEMPLATE.name
    );

  }, [handleTemplateAnalyzed]);



  if (checkingAuth) {

    return <div className="h-screen w-screen bg-white flex items-center justify-center"></div>;

  }



  if (!isUnlocked) {

    return <LockScreen onLogin={handleLogin} />;

  }



  // Wizard Step 0: Upload Template

  if (wizardStep === WizardStep.UPLOAD_TEMPLATE) {

    return (

      <>

        <ApiKeyModal

          isOpen={showApiModal}

          onSave={handleSaveApiKey}

          onClose={() => setShowApiModal(false)}

          isDismissible={!!apiKey}

        />

        <TemplateUploadStep

          apiKey={apiKey}

          selectedModel={selectedModel}

          onTemplateAnalyzed={handleTemplateAnalyzed}

          onSkipTemplate={handleSkipTemplate}

        />

      </>

    );

  }



  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-indigo-100 flex flex-col lg:flex-row font-sans text-gray-900">

      <ApiKeyModal

        isOpen={showApiModal}

        onSave={handleSaveApiKey}

        onClose={() => setShowApiModal(false)}

        isDismissible={!!apiKey}

      />







      {/* Session Restore Modal */}

      {showRestoreModal && pendingSessionData && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">

            <div className="bg-gradient-to-r from-orange-500 to-sky-500 p-6 text-white">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">

                  <Save className="w-6 h-6" />

                </div>

                <div>

                  <h3 className="text-lg font-bold">Khôi phục phiên làm việc</h3>

                  <p className="text-sm text-orange-100">Bạn có phiên làm việc chưa hoàn thành</p>

                </div>

              </div>

            </div>

            <div className="p-6">

              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-4">

                <p className="text-sm text-gray-700">

                  <span className="font-semibold text-sky-800">ĐĐ tài:</span>{' '}

                  {(pendingSessionData.userInfo as any).topic || 'Không rõ'}

                </p>

                <p className="text-xs text-gray-500 mt-1">

                  Đã lưu lúc: {new Date(pendingSessionData.savedAt).toLocaleString('vi-VN')}

                </p>

                <p className="text-xs text-gray-500 mt-1">

                  Tiến độ: Bước {pendingSessionData.state.step} / {GenerationStep.COMPLETED}

                </p>

              </div>

              <div className="flex gap-3">

                <button

                  onClick={() => {

                    setShowRestoreModal(false);

                    clearSavedSession();

                    setPendingSessionData(null);

                  }}

                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm"

                >

                  ✖ Bắt đầu mới

                </button>

                <button

                  onClick={() => {

                    restoreSession(pendingSessionData);

                    setShowRestoreModal(false);

                    setPendingSessionData(null);

                  }}

                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-sky-500 hover:from-orange-600 hover:to-sky-600 text-white rounded-xl font-bold transition-colors text-sm shadow-lg"

                >

                  ✔ Tiếp tục làm

                </button>

              </div>

            </div>

          </div>

        </div>

      )}



      {/* Header Button for Settings */}

      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-1">

        <button

          onClick={() => setShowApiModal(true)}

          className="flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-orange-100 hover:bg-orange-50 hover:border-orange-200 hover:shadow-xl transition-all duration-200"

          title="Cấu hình API Key"

        >

          <Settings size={18} className="text-orange-600" />

          <span className="text-orange-700 font-semibold text-sm hidden sm:inline">⚙ Cài đặt API Key</span>

        </button>

        <a

          href="https://aistudio.google.com/api-keys"

          target="_blank"

          rel="noopener noreferrer"

          className="text-xs text-red-600 font-semibold hover:text-red-700 hover:underline transition-colors hidden sm:block"

        >

          Lấy API key để sử dụng app

        </a>

      </div>



      {/* Sidebar (Desktop) */}

      <div className="hidden lg:block h-screen sticky top-0 z-20">

        {renderSidebar()}

      </div>



      {/* Main Content */}

      <div className="flex-1 p-4 lg:p-8 flex flex-col h-screen overflow-hidden relative">



        {/* Mobile Header */}

        <div className="lg:hidden mb-4 bg-gradient-to-r from-white to-sky-50 p-4 rounded-xl shadow-lg border border-sky-100 flex flex-col gap-2">

          <div className="flex justify-between items-center">

            <span className="ml-3 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-indigo-600 text-xl tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>

              SKKN 2026 PRO

            </span>

            <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">

              {currentStepsInfo[state.step < COMPLETED_STEP_ID ? state.step : COMPLETED_STEP_ID - 1]?.label || "SKKN 2026 PRO"}

            </span>

          </div>

          <p className="text-xs text-orange-700 font-medium">✨ Trợ lý viết SKKN thông minh</p>

        </div>



        {state.error && (() => {

          const errorInfo = getFriendlyErrorMessage({ message: state.error });

          return (

            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-5 mb-4 shadow-sm">

              {/* Header */}

              <div className="flex items-start gap-3 mb-3">

                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">

                  <AlertTriangle className="w-5 h-5 text-red-600" />

                </div>

                <div className="flex-1">

                  <h3 className="font-bold text-red-800 text-lg">{errorInfo.title}</h3>

                  <p className="text-red-700 text-sm mt-1">{errorInfo.message}</p>

                </div>

              </div>



              {/* Suggestions */}

              <div className="bg-white/70 rounded-lg p-4 mt-3 border border-red-100">

                <p className="text-sm font-semibold text-gray-700 mb-2">💡 Gợi ý khắc phục:</p>

                <ul className="space-y-2">

                  {errorInfo.suggestions.map((suggestion, index) => (

                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">

                      <span className="text-gray-400">•</span>

                      {suggestion}

                    </li>

                  ))}

                </ul>

              </div>



              {/* Hướng dẫn thao tác cho ngưĐi dùng */}

              {state.step > GenerationStep.INPUT_FORM && (

                <div className="bg-gradient-to-r from-orange-50 to-emerald-50 rounded-lg p-4 mt-3 border border-orange-200">

                  <p className="text-sm font-bold text-orange-800 mb-2">📋 Bạn có 2 lựa chĐn:</p>

                  <div className="space-y-2">

                    <div className="flex items-start gap-2">

                      <span className="text-emerald-600 font-bold text-sm mt-0.5">1.</span>

                      <p className="text-sm text-gray-700">

                        <span className="font-semibold text-emerald-700">Bấm "🔄 Thử lại (đổi key)"</span> - App sẽ tự động chuyển sang API key dự phòng và tiếp tục chạy ngay, không mất dữ liệu.

                      </p>

                    </div>

                    <div className="flex items-start gap-2">

                      <span className="text-sky-600 font-bold text-sm mt-0.5">2.</span>

                      <p className="text-sm text-gray-700">

                        <span className="font-semibold text-sky-700">Bấm "💾 Lưu phiên" ở thanh bên trái</span> rồi tắt app. Hôm sau mở lại, API key sẽ được reset và bạn tiếp tục từ chỗ đã dừng.

                      </p>

                    </div>

                  </div>

                </div>

              )}



              {/* Action buttons */}

              <div className="flex flex-wrap gap-2 mt-4">

                <button

                  onClick={() => setState(prev => ({ ...prev, error: null }))}

                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"

                >

                  ✕ Đóng thông báo

                </button>

                <button

                  onClick={() => setShowApiModal(true)}

                  className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"

                >

                  🔑 Đổi API Key

                </button>

                {/* 🆕 Nút Thử lại - xoay sang API key dự phòng và retry */}

                {state.step > GenerationStep.INPUT_FORM && (

                  <button
                    onClick={() => {
                      const stats = apiKeyManager.getKeyStats();
                      if (stats.total <= 1) {
                        // Nếu chỉ có 1 key và key đó đã lỗi, mở modal nhập key mới
                        setShowApiModal(true);
                        return;
                      }

                      const rotation = apiKeyManager.rotateToNextKey('manual_retry');
                      let keyToUse = apiKey;
                      if (rotation.success && rotation.newKey) {
                        keyToUse = rotation.newKey;
                        setApiKey(keyToUse);
                        localStorage.setItem('gemini_api_key', keyToUse);
                        console.log(`🔑 Đã xoay sang key mới: ${rotation.message}`);
                      } else {
                        // Nếu không còn key backup nào khả dụng, mở modal nhập key mới
                        setShowApiModal(true);
                        return;
                      }

                      setState(prev => ({ ...prev, error: null }));
                      initializeGeminiChat(keyToUse, selectedModel, currentProvider);

                      // Khôi phục chat history trước khi retry
                      const savedHistory = getChatHistory();
                      if (savedHistory.length > 0) {
                        setChatHistory(savedHistory);
                      }

                      setTimeout(() => {
                        if (state.step === GenerationStep.OUTLINE) {
                          startGeneration();
                        } else {
                          generateNextSection();
                        }
                      }, 300);
                    }}

                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"

                  >

                    <RefreshCw size={16} />

                    🔄 Thử lại (đổi key)

                  </button>

                )}

                <a

                  href="https://aistudio.google.com/api-keys"

                  target="_blank"

                  rel="noopener noreferrer"

                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"

                >

                  📖 Hướng dẫn lấy API Key

                </a>

              </div>

            </div>

          );

        })()}



        {state.step === GenerationStep.INPUT_FORM ? (

          <div className="flex-1 flex items-start justify-center overflow-y-auto">

            <SKKNForm

              userInfo={userInfo}

              onChange={handleUserChange}

              onSubmit={startGeneration}

              onManualSubmit={handleManualOutlineSubmit}

              isSubmitting={state.isStreaming}

              apiKey={apiKey}

              selectedModel={selectedModel}

              templateFileName={templateFileName}

              parsedTemplateSections={templateSectionsCount}

              onBackToUpload={() => setWizardStep(WizardStep.UPLOAD_TEMPLATE)}

            />

          </div>

        ) : (

          <div className="flex-1 flex flex-col min-h-0 relative">

            <DocumentPreview

              content={state.fullDocument}

              onUpdate={handleDocumentUpdate}

              // Only allow direct editing in the OUTLINE step and when not streaming

              isEditable={state.step === GenerationStep.OUTLINE && !state.isStreaming}

            />



            {/* Mobile Controls Floating */}

            <div className="lg:hidden absolute bottom-4 left-4 right-4 flex gap-2 shadow-lg">

              {!state.isStreaming && state.step < COMPLETED_STEP_ID && (

                <Button onClick={generateNextSection} className="flex-1 shadow-xl">

                  {state.step === GenerationStep.OUTLINE ? 'Chốt & Tiếp tục' : 'Viết tiếp'}

                </Button>

              )}

              <Button onClick={exportToWord} variant="secondary" className="bg-white shadow-xl text-sky-700">

                <Download size={20} />

              </Button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};



export default App;

