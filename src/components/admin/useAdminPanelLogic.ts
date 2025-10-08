import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type AIModel = 'gemini' | 'llama' | 'gigachat' | 'phi' | 'qwen' | 'mistral';

interface APIConfig {
  gemini: { key: string; enabled: boolean };
  llama: { key: string; enabled: boolean };
  gigachat: { key: string; enabled: boolean };
  phi: { key: string; enabled: boolean };
  qwen: { key: string; enabled: boolean };
  mistral: { key: string; enabled: boolean };
}

export function useAdminPanelLogic(
  apiConfig: APIConfig,
  onAPIKeyChange: (model: AIModel, key: string) => void
) {
  const { toast } = useToast();
  const [testingModel, setTestingModel] = useState<AIModel | null>(null);
  const [testResults, setTestResults] = useState<Record<AIModel, 'success' | 'error' | null>>({
    gemini: null,
    llama: null,
    gigachat: null,
    phi: null,
    qwen: null,
    mistral: null,
  });
  const [keyErrors, setKeyErrors] = useState<Record<AIModel, string | null>>({
    gemini: null,
    llama: null,
    gigachat: null,
    phi: null,
    qwen: null,
    mistral: null,
  });
  const [showKeys, setShowKeys] = useState<Record<AIModel, boolean>>({
    gemini: false,
    llama: false,
    gigachat: false,
    phi: false,
    qwen: false,
    mistral: false,
  });

  const validateKey = (model: AIModel, key: string): string | null => {
    if (!key) return null;
    
    if (model === 'gigachat') {
      const base64Regex = /^[A-Za-z0-9+/]+=*$/;
      if (!base64Regex.test(key)) {
        return 'Неверный формат: должен быть Base64';
      }
      if (key.length < 20) {
        return 'Слишком короткий ключ';
      }
    } else {
      const validPrefixes = ['sk-or-v1-', 'sk-proj-', 'sk-ant-', 'sk-'];
      const hasValidPrefix = validPrefixes.some(prefix => key.startsWith(prefix));
      
      if (!hasValidPrefix) {
        return 'Ключ должен начинаться с sk- (любой API провайдер)';
      }
      if (key.length < 20) {
        return 'Слишком короткий ключ';
      }
    }
    
    return null;
  };

  const handleKeyChange = (model: AIModel, key: string) => {
    onAPIKeyChange(model, key);
    const error = validateKey(model, key);
    setKeyErrors(prev => ({ ...prev, [model]: error }));
  };

  const testModel = async (model: AIModel) => {
    if (!apiConfig[model].key) {
      toast({
        title: 'Ошибка',
        description: 'Введите API ключ',
        variant: 'destructive',
      });
      return;
    }

    if (model !== 'gigachat') {
      const validPrefixes = ['sk-or-v1-', 'sk-proj-', 'sk-ant-', 'sk-'];
      const hasValidPrefix = validPrefixes.some(prefix => apiConfig[model].key.startsWith(prefix));
      
      if (!hasValidPrefix) {
        toast({
          title: 'Неверный формат ключа',
          description: 'API ключ должен начинаться с sk-',
          variant: 'destructive',
        });
        return;
      }
    }

    setTestingModel(model);

    try {
      const response = await fetch('https://functions.poehali.dev/81fdec08-160f-4043-a2da-cefa0ffbdf22', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Привет! Ответ одним словом: работаю',
          models: { [model]: { key: apiConfig[model].key, enabled: true } },
          history: [],
          settings: { temperature: 0.7, max_tokens: 50 },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTestResults(prev => ({ ...prev, [model]: 'success' }));
        toast({
          title: '✅ Тест пройден',
          description: `Ответ: ${data.response}`,
        });
      } else {
        setTestResults(prev => ({ ...prev, [model]: 'error' }));
        
        let errorMsg = data.error || 'Ошибка теста';
        if (data.details && data.details.length > 0) {
          const modelError = data.details.find((d: any) => d.model === model);
          if (modelError) {
            errorMsg = modelError.error;
          }
        }
        
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, [model]: 'error' }));
      
      let errorDescription = error.message || 'Проверьте API ключ';
      
      if (errorDescription.includes('401') || errorDescription.includes('Unauthorized')) {
        errorDescription = '🔑 Неверный API ключ - проверьте правильность';
      } else if (errorDescription.includes('timeout')) {
        errorDescription = '⏱️ Превышено время ожидания - попробуйте ещё раз';
      } else if (errorDescription.includes('API error')) {
        errorDescription = '🌐 ' + errorDescription;
      }
      
      toast({
        title: '❌ Тест не пройден',
        description: errorDescription,
        variant: 'destructive',
      });
    } finally {
      setTestingModel(null);
    }
  };

  return {
    testingModel,
    testResults,
    keyErrors,
    showKeys,
    setShowKeys,
    handleKeyChange,
    testModel,
  };
}