import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './Button';
import { Key, X, Zap, Cpu, Sparkles, ExternalLink, Server } from 'lucide-react';
import { FALLBACK_MODELS, AGENT_PLATFORM_MODELS, MODEL_INFO, type AiProvider } from '../constants';
import { isValidGoogleAiApiKey, maskGoogleAiApiKey } from '../services/apiKeyValidation';

interface ApiKeyModalProps {
    isOpen: boolean;
    onSave: (key: string, selectedModel: string, provider: AiProvider) => void;
    onClose: () => void;
    isDismissible?: boolean;
}

// Đọc API keys từ biến môi trường
const getEnvApiKeys = (): string[] => {
    const envKeys = import.meta.env.VITE_GEMINI_API_KEYS || '';
    if (!envKeys) return [];
    return envKeys.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
};

const ModelIcon: React.FC<{ modelId: string }> = ({ modelId }) => {
    if (modelId.includes('flash-lite')) return <Zap className="w-5 h-5" />;
    if (modelId.includes('pro')) return <Sparkles className="w-5 h-5" />;
    if (modelId.includes('flash')) return <Cpu className="w-5 h-5" />;
    return <Cpu className="w-5 h-5" />;
};

// Lấy danh sách model theo provider
const getModelsForProvider = (provider: AiProvider): string[] => {
    if (provider === 'agent-platform') {
        return [...AGENT_PLATFORM_MODELS];
    }
    return [...FALLBACK_MODELS];
};

// Lấy model mặc định theo provider
const getDefaultModel = (provider: AiProvider): string => {
    if (provider === 'agent-platform') return AGENT_PLATFORM_MODELS[0] || 'gemini-2.5-flash';
    return 'gemini-3.6-flash';
};

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose, isDismissible = true }) => {
    const [provider, setProvider] = useState<AiProvider>('gemini');
    const [selectedModel, setSelectedModel] = useState(FALLBACK_MODELS[0]);
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');

    // Lấy danh sách key từ env (chỉ cho Gemini)
    const envKeys = useMemo(() => getEnvApiKeys(), []);
    const hasEnvKeys = envKeys.length > 0;

    // Model list theo provider hiện tại
    const availableModels = useMemo(() => getModelsForProvider(provider), [provider]);

    // Load từ localStorage khi modal mở
    useEffect(() => {
        if (isOpen) {
            const storedProvider = localStorage.getItem('google_ai_provider');
            const savedProvider: AiProvider = storedProvider === 'agent-platform' ? 'agent-platform' : 'gemini';

            if (storedProvider === 'vertex') {
                localStorage.setItem('google_ai_provider', 'gemini');
                localStorage.setItem('google_ai_provider_selection_source', 'migration');
            }

            setProvider(savedProvider);
            setApiKey(
                savedProvider === 'agent-platform'
                    ? localStorage.getItem('agent_platform_api_key') || ''
                    : localStorage.getItem('gemini_api_key') || '',
            );

            // Load model
            const savedModel = localStorage.getItem('selected_model');
            const models = getModelsForProvider(savedProvider);
            if (savedModel && models.includes(savedModel)) {
                setSelectedModel(savedModel);
            } else {
                setSelectedModel(getDefaultModel(savedProvider));
            }
        }
    }, [isOpen]);

    // Khi đổi provider tab → load key đúng + reset model
    const handleProviderChange = (newProvider: AiProvider) => {
        setProvider(newProvider);
        setError('');

        // Load key riêng của provider đó
        if (newProvider === 'agent-platform') {
            setApiKey(localStorage.getItem('agent_platform_api_key') || '');
        } else {
            setApiKey(localStorage.getItem('gemini_api_key') || '');
        }

        // Reset model về mặc định nếu model hiện tại không tương thích
        const models = getModelsForProvider(newProvider);
        if (!models.includes(selectedModel)) {
            setSelectedModel(getDefaultModel(newProvider));
        }
    };

    const handleSave = () => {
        const trimmedKey = apiKey.trim();

        // Nếu không nhập key → dùng key đầu tiên từ env (chỉ Gemini)
        let keyToSave = trimmedKey;
        if (!keyToSave && hasEnvKeys && provider === 'gemini') {
            keyToSave = envKeys[0];
        }

        if (!keyToSave) {
            setError(provider === 'agent-platform'
                ? 'Vui lòng nhập Agent Platform API Key'
                : 'Vui lòng nhập API Key hoặc cấu hình VITE_GEMINI_API_KEYS trong file .env');
            return;
        }

        if (!isValidGoogleAiApiKey(keyToSave)) {
            setError('API Key không hợp lệ. Key phải bắt đầu bằng "AIzaSy..." hoặc "AQ..."');
            return;
        }

        // Lưu key riêng theo provider (api.md §III — không ghi đè nhau)
        if (provider === 'agent-platform') {
            localStorage.setItem('agent_platform_api_key', keyToSave);
        } else {
            localStorage.setItem('gemini_api_key', keyToSave);
        }
        localStorage.setItem('google_ai_provider', provider);
        localStorage.setItem('google_ai_provider_selection_source', 'manual');
        localStorage.setItem('selected_model', selectedModel);

        setError('');
        onSave(keyToSave, selectedModel, provider);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex-shrink-0">
                    {isDismissible && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-sky-100 rounded-lg">
                            <Key className="w-6 h-6 text-sky-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Thiết lập Model & API Key</h2>
                            <p className="text-sm text-gray-500">Kết nối với Google AI</p>
                        </div>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Provider Tabs (api.md §III) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn Dịch vụ AI
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleProviderChange('gemini')}
                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${provider === 'gemini'
                                    ? 'border-sky-500 bg-sky-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <Cpu className={`w-5 h-5 ${provider === 'gemini' ? 'text-sky-600' : 'text-gray-400'}`} />
                                <div>
                                    <div className={`font-semibold text-sm ${provider === 'gemini' ? 'text-sky-700' : 'text-gray-700'}`}>
                                        Gemini API
                                    </div>
                                    <div className="text-xs text-gray-500">Google AI Studio</div>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleProviderChange('agent-platform')}
                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${provider === 'agent-platform'
                                    ? 'border-purple-500 bg-purple-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <Server className={`w-5 h-5 ${provider === 'agent-platform' ? 'text-purple-600' : 'text-gray-400'}`} />
                                <div>
                                    <div className={`font-semibold text-sm ${provider === 'agent-platform' ? 'text-purple-700' : 'text-gray-700'}`}>
                                        Agent Platform API
                                    </div>
                                    <div className="text-xs text-gray-500">Agent Platform Express mode</div>
                                </div>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Tự chọn dịch vụ phù hợp. Tiền tố API key không tự quyết định endpoint.
                        </p>
                    </div>

                    {/* Model Selection — lọc theo provider */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Chọn Model AI
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {availableModels.map((modelId) => {
                                const info = MODEL_INFO[modelId];
                                const isSelected = selectedModel === modelId;
                                const accentColor = provider === 'agent-platform' ? 'purple' : 'sky';
                                return (
                                    <button
                                        key={modelId}
                                        onClick={() => setSelectedModel(modelId)}
                                        className={`relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${isSelected
                                            ? `border-${accentColor}-500 bg-${accentColor}-50 shadow-md`
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        style={isSelected ? {
                                            borderColor: provider === 'agent-platform' ? '#a855f7' : '#0ea5e9',
                                            backgroundColor: provider === 'agent-platform' ? '#faf5ff' : '#f0f9ff'
                                        } : {}}
                                    >
                                        <div
                                            className="p-2 rounded-lg"
                                            style={{
                                                backgroundColor: isSelected
                                                    ? (provider === 'agent-platform' ? '#a855f7' : '#0ea5e9')
                                                    : '#f3f4f6',
                                                color: isSelected ? 'white' : '#4b5563'
                                            }}
                                        >
                                            <ModelIcon modelId={modelId} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold ${isSelected ? (provider === 'agent-platform' ? 'text-purple-700' : 'text-sky-700') : 'text-gray-900'}`}>
                                                    {info?.name || modelId}
                                                </span>
                                                {((info?.isDefault && provider === 'gemini') || (modelId === getDefaultModel('agent-platform') && provider === 'agent-platform')) && (
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {info?.description || ''}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: provider === 'agent-platform' ? '#a855f7' : '#0ea5e9' }}
                                            >
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">
                            💡 Nếu model đang chọn bị lỗi/quá tải, hệ thống sẽ tự động thử các model khác theo thứ tự.
                        </p>
                    </div>

                    {/* API Key Input */}
                    <div className="border-t pt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            🔑 {provider === 'agent-platform' ? 'Agent Platform' : 'Gemini'} API Key {' '}
                            {hasEnvKeys && provider === 'gemini' && <span className="text-green-600 font-normal">(Tùy chọn - đã có key mặc định)</span>}
                        </label>
                        {provider === 'agent-platform' && (
                            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                Dùng API key dành cho Agent Platform. Nếu Google trả về 403 hoặc yêu cầu OAuth2, hãy kiểm tra Agent Platform API, billing, giới hạn API key và quyền model; app không tự đổi sang Gemini API.
                            </div>
                        )}
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => {
                                setApiKey(e.target.value);
                                setError('');
                            }}
                            placeholder={
                                hasEnvKeys && provider === 'gemini'
                                    ? "Để trống để dùng key mặc định, hoặc nhập key riêng (AIzaSy... hoặc AQ...)"
                                    : "Nhập API Key (AIzaSy... hoặc AQ...)"
                            }
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm font-mono"
                        />

                        {/* Error message */}
                        {error && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Thông báo key mặc định — chỉ cho Gemini */}
                        {hasEnvKeys && provider === 'gemini' && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                ✅ Hệ thống đã có <strong>{envKeys.length} API Key</strong> được cấu hình sẵn. Bạn có thể bỏ trống ô trên để sử dụng key mặc định, hoặc nhập key riêng nếu muốn.
                            </div>
                        )}

                        {/* Preset API Keys — chỉ hiện cho Gemini nếu có keys từ env */}
                        {hasEnvKeys && provider === 'gemini' && (
                            <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-lg">
                                <p className="text-sm font-semibold text-sky-800 mb-2">
                                    🔑 Chọn nhanh API Key có sẵn:
                                </p>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                    {envKeys.map((key, idx) => {
                                        const masked = maskGoogleAiApiKey(key);
                                        const isActive = apiKey === key;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setApiKey(key);
                                                    setError('');
                                                }}
                                                className={`px-3 py-2 text-xs font-mono rounded-lg border transition-all text-left truncate ${isActive
                                                    ? 'border-sky-500 bg-sky-100 text-sky-800 ring-2 ring-sky-300'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-sky-300 hover:bg-sky-50'
                                                    }`}
                                                title={`Key #${idx + 1}`}
                                            >
                                                🔑 {masked}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-sky-600 mt-2 italic">
                                    💡 Nhấn vào key bất kỳ để chọn. Nếu key hết lượt, hãy thử key khác.
                                </p>
                            </div>
                        )}

                        {/* Help text */}
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm font-semibold text-amber-800 mb-2">
                                📖 Hướng dẫn lấy API Key:
                            </p>
                            {provider === 'gemini' ? (
                                <>
                                    <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                                        <li>Truy cập Google AI Studio</li>
                                        <li>Đăng nhập bằng tài khoản Google</li>
                                        <li>Nhấn "Create API Key" hoặc "Get API Key"</li>
                                        <li>Copy key và dán vào ô trên</li>
                                    </ol>
                                    <a
                                        href="https://aistudio.google.com/api-keys"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                                    >
                                        <ExternalLink size={16} />
                                        Lấy Gemini API Key
                                    </a>
                                </>
                            ) : (
                                <>
                                    <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                                        <li>Mở hướng dẫn tạo API key cho Agent Platform</li>
                                        <li>Tạo hoặc sao chép API key được cấp cho Agent Platform</li>
                                        <li>Kiểm tra Agent Platform API, billing, API restrictions và quyền model</li>
                                        <li>Copy key và dán vào ô trên</li>
                                    </ol>
                                    <a
                                        href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/start/api-keys"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                    >
                                        <ExternalLink size={16} />
                                        Xem hướng dẫn Agent Platform
                                    </a>
                                </>
                            )}
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                            <p>💡 API Key được lưu trên trình duyệt của bạn, không gửi đến bất kỳ server nào khác ngoài Google AI.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                    {isDismissible && (
                        <Button variant="secondary" onClick={onClose}>
                            Đóng
                        </Button>
                    )}
                    <Button onClick={handleSave}>
                        Lưu cấu hình
                    </Button>
                </div>
            </div>
        </div>
    );
};
