import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: AIModel;
  timestamp: Date;
}

interface APIConfig {
  gemini: { key: string; enabled: boolean };
  llama: { key: string; enabled: boolean };
  gigachat: { key: string; enabled: boolean };
}

export default function Index() {
  const { toast } = useToast();
  const [showAdmin, setShowAdmin] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Здравствуйте! Я — Богдан, ваш AI-помощник. Готов помочь вам с любыми задачами. Какая модель вам интересна?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeModel, setActiveModel] = useState<AIModel>('gemini');
  const [apiConfig, setApiConfig] = useState<APIConfig>({
    gemini: { key: '', enabled: true },
    llama: { key: '', enabled: true },
    gigachat: { key: '', enabled: true },
  });

  const modelInfo = {
    gemini: { name: 'Google Gemini', color: 'from-blue-500 to-blue-600', icon: 'Sparkles' },
    llama: { name: 'Meta Llama', color: 'from-purple-500 to-purple-600', icon: 'Cpu' },
    gigachat: { name: 'GigaChat', color: 'from-green-500 to-green-600', icon: 'MessageSquare' },
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    if (!apiConfig[activeModel].enabled) {
      toast({
        title: 'Модель отключена',
        description: `${modelInfo[activeModel].name} отключена в настройках. Включите её в админ-панели.`,
        variant: 'destructive',
      });
      return;
    }

    if (!apiConfig[activeModel].key) {
      toast({
        title: 'API ключ отсутствует',
        description: `Добавьте API ключ для ${modelInfo[activeModel].name} в админ-панели.`,
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

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `[${modelInfo[activeModel].name}] Обрабатываю ваш запрос: "${inputMessage}". В реальной версии здесь будет ответ от AI модели.`,
      model: activeModel,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInputMessage('');
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
    toast({
      title: 'Настройки сохранены',
      description: 'Конфигурация API успешно обновлена',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Icon name="Brain" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Помощник Богдан</h1>
              <p className="text-xs text-gray-500">Профессиональная AI платформа</p>
            </div>
          </div>
          <Button
            variant={showAdmin ? 'default' : 'outline'}
            onClick={() => setShowAdmin(!showAdmin)}
            className="gap-2"
          >
            <Icon name="Settings" size={18} />
            {showAdmin ? 'Скрыть админ-панель' : 'Админ-панель'}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={showAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <Card className="h-[calc(100vh-180px)] flex flex-col shadow-lg">
              <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-gray-700">Выберите AI модель</h2>
                  <Badge variant="outline" className="gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Онлайн
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(modelInfo).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => setActiveModel(key as AIModel)}
                      disabled={!apiConfig[key as AIModel].enabled}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        activeModel === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      } ${!apiConfig[key as AIModel].enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center`}
                        >
                          <Icon name={info.icon as any} size={20} className="text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{info.name}</span>
                        {!apiConfig[key as AIModel].enabled && (
                          <Badge variant="secondary" className="text-xs">
                            Выкл
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Icon name="Bot" size={16} className="text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
                          <Icon name="User" size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите ваш вопрос..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="gap-2 bg-blue-500 hover:bg-blue-600">
                    <Icon name="Send" size={18} />
                    Отправить
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {showAdmin && (
            <div className="lg:col-span-1">
              <Card className="h-[calc(100vh-180px)] flex flex-col shadow-lg">
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                  <div className="flex items-center gap-2">
                    <Icon name="Shield" size={20} className="text-blue-600" />
                    <h2 className="font-semibold text-gray-800">Админ-панель</h2>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Управление API ключами</p>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <Tabs defaultValue="gemini" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="gemini" className="text-xs">
                        Gemini
                      </TabsTrigger>
                      <TabsTrigger value="llama" className="text-xs">
                        Llama
                      </TabsTrigger>
                      <TabsTrigger value="gigachat" className="text-xs">
                        GigaChat
                      </TabsTrigger>
                    </TabsList>

                    {Object.entries(modelInfo).map(([key, info]) => (
                      <TabsContent key={key} value={key} className="space-y-4 mt-4">
                        <div className="space-y-4">
                          <div
                            className={`p-4 rounded-lg bg-gradient-to-br ${info.color} text-white flex items-center gap-3`}
                          >
                            <Icon name={info.icon as any} size={24} />
                            <div>
                              <h3 className="font-semibold">{info.name}</h3>
                              <p className="text-xs opacity-90">Настройки интеграции</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${key}-key`}>API ключ</Label>
                            <Input
                              id={`${key}-key`}
                              type="password"
                              placeholder="Введите API ключ..."
                              value={apiConfig[key as AIModel].key}
                              onChange={(e) => handleAPIKeyChange(key as AIModel, e.target.value)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`${key}-toggle`}>Модель активна</Label>
                              {apiConfig[key as AIModel].enabled && (
                                <Badge variant="default" className="text-xs bg-green-500">
                                  Включена
                                </Badge>
                              )}
                            </div>
                            <Switch
                              id={`${key}-toggle`}
                              checked={apiConfig[key as AIModel].enabled}
                              onCheckedChange={(checked) => handleToggleModel(key as AIModel, checked)}
                            />
                          </div>

                          <div className="space-y-2 pt-2">
                            <h4 className="text-sm font-medium text-gray-700">Статус</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 rounded bg-gray-50 text-center">
                                <p className="text-xs text-gray-500">API ключ</p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {apiConfig[key as AIModel].key ? 'Установлен' : 'Не задан'}
                                </p>
                              </div>
                              <div className="p-2 rounded bg-gray-50 text-center">
                                <p className="text-xs text-gray-500">Состояние</p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {apiConfig[key as AIModel].enabled ? 'Активна' : 'Отключена'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </ScrollArea>

                <div className="p-4 border-t bg-white">
                  <Button onClick={saveSettings} className="w-full gap-2 bg-green-600 hover:bg-green-700">
                    <Icon name="Save" size={18} />
                    Сохранить настройки
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
