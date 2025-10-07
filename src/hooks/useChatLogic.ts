import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: AIModel;
  attachments?: Array<{ type: 'image' | 'file'; url: string; name: string }>;
  reactions?: Array<{ emoji: string; count: number }>;
}

interface APIConfig {
  gemini: { key: string; enabled: boolean };
  llama: { key: string; enabled: boolean };
  gigachat: { key: string; enabled: boolean };
}

interface Settings {
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  context_length: number;
  auto_save: boolean;
  streaming: boolean;
  language: string;
}

const modelInfo = {
  gemini: { name: 'Gemini 2.0 Flash', fullName: 'Google Gemini 2.0 Flash Experimental', color: 'from-blue-500 to-blue-600', icon: 'Sparkles' },
  llama: { name: 'Llama 3.3 70B', fullName: 'Meta Llama 3.3 70B Instruct', color: 'from-purple-500 to-purple-600', icon: 'Cpu' },
  gigachat: { name: 'GigaChat', fullName: 'GigaChat (Сбер)', color: 'from-green-500 to-green-600', icon: 'MessageSquare' },
};

export function useChatLogic() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat-history');
    return saved ? JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) : [
      {
        id: '1',
        role: 'assistant',
        content: 'Здравствуйте! Чем могу помочь?',
        timestamp: new Date(),
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModel | null>(null);
  const [apiConfig, setApiConfig] = useState<APIConfig>(() => {
    const saved = localStorage.getItem('ai-config');
    return saved ? JSON.parse(saved) : {
      gemini: { key: '', enabled: true },
      llama: { key: '', enabled: true },
      gigachat: { key: '', enabled: true },
    };
  });
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('ai-settings');
    return saved ? JSON.parse(saved) : {
      temperature: 0.7,
      max_tokens: 2048,
      system_prompt: '',
      context_length: 10,
      auto_save: true,
      streaming: false,
      language: 'ru',
    };
  });
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('ai-stats');
    return saved ? JSON.parse(saved) : {
      gemini: 0,
      llama: 0,
      gigachat: 0,
    };
  });
  const [selectedModel, setSelectedModel] = useState<AIModel | 'auto'>('auto');

  useEffect(() => {
    localStorage.setItem('ai-config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  useEffect(() => {
    localStorage.setItem('chat-history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ai-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ai-stats', JSON.stringify(stats));
  }, [stats]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const enabledModels = Object.entries(apiConfig).filter(([_, config]) => config.enabled && config.key);
    
    if (enabledModels.length === 0) {
      toast({
        title: 'Сервис недоступен',
        description: 'Настройте хотя бы одну AI модель в панели управления',
        variant: 'destructive',
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('https://functions.poehali.dev/81fdec08-160f-4043-a2da-cefa0ffbdf22', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          models: apiConfig,
          history: history,
          settings: settings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка запроса');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        model: data.model,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentModel(data.model);

      setStats(prev => ({
        ...prev,
        [data.model]: (prev[data.model] || 0) + 1
      }));

      if (data.fallback_used) {
        toast({
          title: 'Использовано резервирование',
          description: `Ответ получен от ${modelInfo[data.model as AIModel]?.name || data.model}`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось получить ответ',
        variant: 'destructive',
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка. Пожалуйста, проверьте настройки API ключей.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Здравствуйте! Чем могу помочь?',
      timestamp: new Date(),
    }]);
    toast({
      title: 'История очищена',
      description: 'Все сообщения удалены',
    });
  };

  const exportChat = () => {
    const content = messages.map(m => `[${m.timestamp.toLocaleString()}] ${m.role === 'user' ? 'Вы' : 'Богдан'}: ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString()}.txt`;
    a.click();
    toast({
      title: 'Экспорт завершен',
      description: 'История чата сохранена в файл',
    });
  };

  const copyMessageToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Скопировано',
      description: 'Сообщение скопировано в буфер обмена',
    });
  };

  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;
    
    const previousUserMessage = messages[messageIndex - 1];
    if (previousUserMessage.role !== 'user') return;

    setMessages(prev => prev.slice(0, messageIndex));
    setInputMessage(previousUserMessage.content);
    await handleSendMessage();
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const reactions = m.reactions || [];
        const existing = reactions.find(r => r.emoji === emoji);
        if (existing) {
          existing.count++;
        } else {
          reactions.push({ emoji, count: 1 });
        }
        return { ...m, reactions };
      }
      return m;
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const attachment = {
          type: file.type.startsWith('image/') ? 'image' as const : 'file' as const,
          url: e.target?.result as string,
          name: file.name,
        };
        
        toast({
          title: 'Файл загружен',
          description: `${file.name} готов к отправке`,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    currentModel,
    apiConfig,
    setApiConfig,
    settings,
    setSettings,
    stats,
    setStats,
    selectedModel,
    setSelectedModel,
    handleSendMessage,
    clearHistory,
    exportChat,
    copyMessageToClipboard,
    regenerateResponse,
    addReaction,
    handleFileUpload,
  };
}
