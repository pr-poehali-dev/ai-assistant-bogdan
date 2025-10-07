import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface APIConfig {
  gemini: { key: string; enabled: boolean };
  llama: { key: string; enabled: boolean };
  gigachat: { key: string; enabled: boolean };
}

const ADMIN_PASSWORD = 'admin123';

export default function Index() {
  const { toast } = useToast();
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Здравствуйте! Чем могу помочь?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfig, setApiConfig] = useState<APIConfig>(() => {
    const saved = localStorage.getItem('ai-config');
    return saved ? JSON.parse(saved) : {
      gemini: { key: '', enabled: true },
      llama: { key: '', enabled: true },
      gigachat: { key: '', enabled: true },
    };
  });

  useEffect(() => {
    localStorage.setItem('ai-config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  const modelInfo = {
    gemini: { name: 'Google Gemini', color: 'from-blue-500 to-blue-600', icon: 'Sparkles' },
    llama: { name: 'Meta Llama', color: 'from-purple-500 to-purple-600', icon: 'Cpu' },
    gigachat: { name: 'GigaChat', color: 'from-green-500 to-green-600', icon: 'MessageSquare' },
  };

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
      const response = await fetch('https://functions.poehali.dev/81fdec08-160f-4043-a2da-cefa0ffbdf22', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          models: apiConfig,
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
      };

      setMessages(prev => [...prev, assistantMessage]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
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
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className={isAuthenticated ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <Card className="h-[calc(100vh-160px)] flex flex-col shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
              <ScrollArea className="flex-1 p-8">
                <div className="space-y-6 max-w-4xl mx-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 animate-fade-in ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-20"></div>
                          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <Icon name="Sparkles" size={18} className="text-white" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-3xl px-6 py-4 shadow-md ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                            : 'bg-white border border-slate-200'
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl blur opacity-20"></div>
                          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-lg">
                            <Icon name="User" size={18} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                <div className="flex gap-3 max-w-4xl mx-auto">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Введите сообщение..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="h-14 px-6 text-[15px] rounded-2xl border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white shadow-sm"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="h-14 px-8 gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Icon name="Loader2" size={20} className="animate-spin" />
                        <span className="font-medium">Отправка...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Send" size={20} />
                        <span className="font-medium">Отправить</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {isAuthenticated && (
            <div className="lg:col-span-1">
              <Card className="h-[calc(100vh-160px)] flex flex-col shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
                <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Shield" size={22} className="text-blue-600" />
                    <h2 className="font-bold text-slate-800 text-lg">Управление</h2>
                  </div>
                  <p className="text-sm text-slate-600">Конфигурация системы</p>
                </div>

                <ScrollArea className="flex-1 p-5">
                  <Tabs defaultValue="gemini" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
                      <TabsTrigger value="gemini" className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
                        Gemini
                      </TabsTrigger>
                      <TabsTrigger value="llama" className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
                        Llama
                      </TabsTrigger>
                      <TabsTrigger value="gigachat" className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
                        GigaChat
                      </TabsTrigger>
                    </TabsList>

                    {Object.entries(modelInfo).map(([key, info]) => (
                      <TabsContent key={key} value={key} className="space-y-5 mt-5">
                        <div className="space-y-4">
                          <div
                            className={`p-5 rounded-2xl bg-gradient-to-br ${info.color} text-white flex items-center gap-3 shadow-lg`}
                          >
                            <Icon name={info.icon as any} size={28} />
                            <div>
                              <h3 className="font-bold text-base">{info.name}</h3>
                              <p className="text-sm opacity-90">Интеграция</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${key}-key`} className="text-sm font-semibold text-slate-700">
                              API Ключ
                            </Label>
                            <Input
                              id={`${key}-key`}
                              type="password"
                              placeholder="Введите ключ..."
                              value={apiConfig[key as AIModel].key}
                              onChange={(e) => handleAPIKeyChange(key as AIModel, e.target.value)}
                              className="rounded-xl border-slate-200"
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`${key}-toggle`} className="text-sm font-medium text-slate-700">
                                Активна
                              </Label>
                              {apiConfig[key as AIModel].enabled && (
                                <Badge className="text-xs bg-green-500 hover:bg-green-600">Вкл</Badge>
                              )}
                            </div>
                            <Switch
                              id={`${key}-toggle`}
                              checked={apiConfig[key as AIModel].enabled}
                              onCheckedChange={(checked) => handleToggleModel(key as AIModel, checked)}
                            />
                          </div>

                          <div className="space-y-3 pt-2">
                            <h4 className="text-sm font-semibold text-slate-700">Статус</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                <p className="text-xs text-slate-500 mb-1">Ключ</p>
                                <p className="text-sm font-bold text-slate-700">
                                  {apiConfig[key as AIModel].key ? '✓ Есть' : '✗ Нет'}
                                </p>
                              </div>
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                <p className="text-xs text-slate-500 mb-1">Режим</p>
                                <p className="text-sm font-bold text-slate-700">
                                  {apiConfig[key as AIModel].enabled ? '✓ Вкл' : '✗ Выкл'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </ScrollArea>

                <div className="p-5 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                  <Button
                    onClick={saveSettings}
                    className="w-full gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg h-12"
                  >
                    <Icon name="Save" size={18} />
                    <span className="font-medium">Сохранить</span>
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-20"></div>
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Icon name="Lock" size={32} className="text-white" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold">Вход в систему</DialogTitle>
            <DialogDescription className="text-center text-slate-600">
              Введите пароль для доступа к панели управления
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              className="h-12 rounded-xl border-slate-200"
            />
            <Button
              onClick={handleAdminLogin}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg font-medium"
            >
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}