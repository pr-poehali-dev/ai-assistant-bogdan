import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import BurgerMenu from '@/components/BurgerMenu';
import AboutPage from '@/components/AboutPage';
import FeaturesPage from '@/components/FeaturesPage';
import TeamPage from '@/components/TeamPage';
import DocsPage from '@/components/DocsPage';
import ChatArea from '@/components/ChatArea';
import AdminPanel from '@/components/AdminPanel';
import AdminLoginDialog from '@/components/dialogs/AdminLoginDialog';
import SettingsDialog from '@/components/dialogs/SettingsDialog';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: AIModel;
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
}

const ADMIN_PASSWORD = 'admin123';

const modelInfo = {
  gemini: { name: 'Gemini 2.0 Flash', fullName: 'Google Gemini 2.0 Flash Experimental', color: 'from-blue-500 to-blue-600', icon: 'Sparkles' },
  llama: { name: 'Llama 3.3 70B', fullName: 'Meta Llama 3.3 70B Instruct', color: 'from-purple-500 to-purple-600', icon: 'Cpu' },
  gigachat: { name: 'GigaChat', fullName: 'GigaChat (Сбер)', color: 'from-green-500 to-green-600', icon: 'MessageSquare' },
};

export default function Index() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState('chat');
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
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

  const handleAdminLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowAdminDialog(false);
      setPasswordInput('');
      toast({
        title: 'Успешный вход',
        description: 'Добро пожаловать в панель управления',
      });
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный пароль',
        variant: 'destructive',
      });
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: 'Выход выполнен',
      description: 'Вы вышли из панели управления',
    });
  };

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

  const handleAPIKeyChange = (model: AIModel, key: string) => {
    setApiConfig((prev) => ({
      ...prev,
      [model]: { ...prev[model], key },
    }));
  };

  const handleToggleModel = (model: AIModel, enabled: boolean) => {
    setApiConfig((prev) => ({
      ...prev,
      [model]: { ...prev[model], enabled },
    }));
    toast({
      title: enabled ? 'Модель включена' : 'Модель отключена',
      description: `${modelInfo[model].name} ${enabled ? 'активирована' : 'деактивирована'}`,
    });
  };

  const saveSettings = () => {
    localStorage.setItem('ai-config', JSON.stringify(apiConfig));
    toast({
      title: 'Настройки сохранены',
      description: 'Конфигурация успешно обновлена',
    });
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

  const clearStats = () => {
    setStats({ gemini: 0, llama: 0, gigachat: 0 });
    toast({
      title: 'Статистика сброшена',
      description: 'Счетчики использования обнулены',
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

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Не поддерживается',
        description: 'Ваш браузер не поддерживает распознавание речи',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'ru-RU';
    recognitionRef.current.continuous = false;

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      toast({
        title: 'Ошибка',
        description: 'Не удалось распознать речь',
        variant: 'destructive',
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: 'Не поддерживается',
        description: 'Ваш браузер не поддерживает синтез речи',
        variant: 'destructive',
      });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('ai-settings', JSON.stringify(settings));
    setShowSettingsDialog(false);
    toast({
      title: 'Настройки сохранены',
      description: 'Параметры AI обновлены',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
            <BurgerMenu onNavigate={setCurrentPage} currentPage={currentPage} />
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-20"></div>
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Icon name="MessageSquare" size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Богдан
              </h1>
              <p className="text-sm text-slate-500 font-medium">Персональный помощник</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentPage === 'chat' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettingsDialog(true)}
                className="rounded-xl hover:bg-slate-100"
              >
                <Icon name="Sliders" size={20} className="text-slate-600" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (isAuthenticated) {
                  handleAdminLogout();
                } else {
                  setShowAdminDialog(true);
                }
              }}
              className="rounded-xl hover:bg-slate-100"
            >
              <Icon name={isAuthenticated ? 'LogOut' : 'Settings'} size={20} className="text-slate-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'team' && <TeamPage />}
        {currentPage === 'docs' && <DocsPage />}
        {currentPage === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className={isAuthenticated ? 'lg:col-span-3' : 'lg:col-span-4'}>
              <ChatArea
                messages={messages}
                currentModel={currentModel}
                isLoading={isLoading}
                inputMessage={inputMessage}
                isListening={isListening}
                isSpeaking={isSpeaking}
                modelInfo={modelInfo}
                onInputChange={setInputMessage}
                onSendMessage={handleSendMessage}
                onExportChat={exportChat}
                onClearHistory={clearHistory}
                onStartListening={startListening}
                onStopListening={stopListening}
                onSpeak={speakText}
              />
            </div>

            {isAuthenticated && (
              <AdminPanel
                apiConfig={apiConfig}
                stats={stats}
                modelInfo={modelInfo}
                onAPIKeyChange={handleAPIKeyChange}
                onToggleModel={handleToggleModel}
                onSaveSettings={saveSettings}
                onClearStats={clearStats}
              />
            )}
          </div>
        )}
      </div>

      <AdminLoginDialog
        open={showAdminDialog}
        onOpenChange={setShowAdminDialog}
        passwordInput={passwordInput}
        onPasswordChange={setPasswordInput}
        onLogin={handleAdminLogin}
      />

      <SettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        settings={settings}
        onSettingsChange={setSettings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
