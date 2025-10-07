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
import APISetupGuide from '@/components/APISetupGuide';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface APIConfig {
  gemini: { key: string; enabled: boolean };
  llama: { key: string; enabled: boolean };
  gigachat: { key: string; enabled: boolean };
}

interface AdminPanelProps {
  apiConfig: APIConfig;
  stats: Record<AIModel, number>;
  modelInfo: Record<AIModel, { name: string; fullName: string; color: string; icon: string }>;
  onAPIKeyChange: (model: AIModel, key: string) => void;
  onToggleModel: (model: AIModel, enabled: boolean) => void;
  onSaveSettings: () => void;
  onClearStats: () => void;
}

export default function AdminPanel({
  apiConfig,
  stats,
  modelInfo,
  onAPIKeyChange,
  onToggleModel,
  onSaveSettings,
  onClearStats,
}: AdminPanelProps) {
  const { toast } = useToast();
  const [testingModel, setTestingModel] = useState<AIModel | null>(null);
  const [testResults, setTestResults] = useState<Record<AIModel, 'success' | 'error' | null>>({
    gemini: null,
    llama: null,
    gigachat: null,
  });

  const testModel = async (model: AIModel) => {
    if (!apiConfig[model].key) {
      toast({
        title: 'Ошибка',
        description: 'Введите API ключ',
        variant: 'destructive',
      });
      return;
    }

    setTestingModel(model);

    try {
      const response = await fetch('https://functions.poehali.dev/81fdec08-160f-4043-a2da-cefa0ffbdf22', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Привет! Это тест.',
          models: { [model]: apiConfig[model] },
          history: [],
          settings: { temperature: 0.7, max_tokens: 50 },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTestResults(prev => ({ ...prev, [model]: 'success' }));
        toast({
          title: '✅ Тест пройден',
          description: `${modelInfo[model].name} работает корректно`,
        });
      } else {
        setTestResults(prev => ({ ...prev, [model]: 'error' }));
        throw new Error(data.error || 'Ошибка теста');
      }
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, [model]: 'error' }));
      toast({
        title: '❌ Тест не пройден',
        description: error.message || 'Проверьте API ключ',
        variant: 'destructive',
      });
    } finally {
      setTestingModel(null);
    }
  };

  return (
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
          <div className="mb-4">
            <APISetupGuide />
          </div>
          
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Icon name="BarChart3" size={16} />
              Статистика использования
            </h3>
            <div className="space-y-2">
              {Object.entries(modelInfo).map(([key, info]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center relative`}>
                      <Icon name={info.icon as any} size={14} className="text-white" />
                      {testResults[key as AIModel] === 'success' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                      {testResults[key as AIModel] === 'error' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700">{info.name}</span>
                      {testResults[key as AIModel] === 'success' && (
                        <p className="text-xs text-green-600">Тест пройден</p>
                      )}
                      {testResults[key as AIModel] === 'error' && (
                        <p className="text-xs text-red-600">Требует проверки</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary">{stats[key as AIModel]} запросов</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={onClearStats} className="w-full gap-2">
              <Icon name="RotateCcw" size={14} />
              Сбросить статистику
            </Button>
          </div>

          <Tabs defaultValue="gemini" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="gemini" className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
                Скорость
              </TabsTrigger>
              <TabsTrigger value="llama" className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
                Точность
              </TabsTrigger>
              <TabsTrigger value="gigachat" className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
                Креатив
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
                      <h3 className="font-bold text-base">{info.fullName}</h3>
                      <p className="text-sm opacity-90">Free API</p>
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
                      onChange={(e) => onAPIKeyChange(key as AIModel, e.target.value)}
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
                      onCheckedChange={(checked) => onToggleModel(key as AIModel, checked)}
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

                  <Button
                    onClick={() => testModel(key as AIModel)}
                    disabled={!apiConfig[key as AIModel].key || testingModel === key}
                    variant="outline"
                    className="w-full gap-2 rounded-xl border-2"
                  >
                    {testingModel === key ? (
                      <>
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        Тестирование...
                      </>
                    ) : (
                      <>
                        <Icon name="Play" size={16} />
                        Протестировать
                      </>
                    )}
                  </Button>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <h5 className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                      <Icon name="Info" size={12} />
                      Как получить ключ?
                    </h5>
                    {key === 'gemini' && (
                      <div className="text-xs text-blue-800 space-y-1">
                        <p>1. Перейдите на <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="underline font-semibold">Google AI Studio</a></p>
                        <p>2. Нажмите "Get API key"</p>
                        <p>3. Скопируйте ключ и вставьте выше</p>
                      </div>
                    )}
                    {key === 'llama' && (
                      <div className="text-xs text-blue-800 space-y-1">
                        <p>1. Зарегистрируйтесь на <a href="https://api.together.xyz" target="_blank" rel="noopener" className="underline font-semibold">Together AI</a></p>
                        <p>2. Перейдите в Settings → API Keys</p>
                        <p>3. Создайте новый ключ и скопируйте</p>
                      </div>
                    )}
                    {key === 'gigachat' && (
                      <div className="text-xs text-blue-800 space-y-1">
                        <p>1. Авторизуйтесь на <a href="https://developers.sber.ru/studio/workspaces" target="_blank" rel="noopener" className="underline font-semibold">Sber AI</a></p>
                        <p>2. Создайте проект GigaChat API</p>
                        <p>3. Получите Client Secret (Base64)</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </ScrollArea>

        <div className="p-5 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
          <Button
            onClick={onSaveSettings}
            className="w-full gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg h-12"
          >
            <Icon name="Save" size={18} />
            <span className="font-medium">Сохранить</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}