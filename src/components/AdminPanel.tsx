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
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-800">Управление</h2>
          </div>
          <APISetupGuide />
        </div>
      </div>

      <ScrollArea className="max-h-[calc(100vh-200px)]">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(modelInfo).map(([key, info]) => (
              <div key={key} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center relative">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-1 relative`}>
                  <Icon name={info.icon as any} size={14} className="text-white" />
                  {testResults[key as AIModel] === 'success' && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
                  )}
                  {testResults[key as AIModel] === 'error' && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-700 truncate">{info.name.replace('Режим ', '')}</p>
                <p className="text-xs text-slate-500">{stats[key as AIModel]}</p>
              </div>
            ))}
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
              <TabsContent key={key} value={key} className="space-y-3 mt-3">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`${key}-key`} className="text-xs font-semibold text-slate-700">
                      API Ключ
                    </Label>
                    <Input
                      id={`${key}-key`}
                      type="password"
                      placeholder="Введите ключ..."
                      value={apiConfig[key as AIModel].key}
                      onChange={(e) => onAPIKeyChange(key as AIModel, e.target.value)}
                      className="rounded-lg border-slate-200 text-sm h-9"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                    <Label htmlFor={`${key}-toggle`} className="text-xs font-medium text-slate-700">
                      Режим активен
                    </Label>
                    <Switch
                      id={`${key}-toggle`}
                      checked={apiConfig[key as AIModel].enabled}
                      onCheckedChange={(checked) => onToggleModel(key as AIModel, checked)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => testModel(key as AIModel)}
                      disabled={!apiConfig[key as AIModel].key || testingModel === key}
                      size="sm"
                      variant="outline"
                      className="gap-1.5 rounded-lg h-8"
                    >
                      {testingModel === key ? (
                        <>
                          <Icon name="Loader2" size={14} className="animate-spin" />
                          <span className="text-xs">Тест...</span>
                        </>
                      ) : (
                        <>
                          <Icon name="Play" size={14} />
                          <span className="text-xs">Тест</span>
                        </>
                      )}
                    </Button>
                    <div className={`flex items-center justify-center gap-1 text-xs font-medium rounded-lg px-2 ${
                      apiConfig[key as AIModel].key && apiConfig[key as AIModel].enabled
                        ? 'bg-green-50 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {apiConfig[key as AIModel].key && apiConfig[key as AIModel].enabled ? (
                        <><Icon name="Check" size={12} /> Готов</>
                      ) : (
                        <><Icon name="AlertCircle" size={12} /> Настроить</>
                      )}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-xs text-blue-800 mb-1">
                      {key === 'gemini' && <><a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="underline font-semibold">Google AI Studio</a> → Get API key</>}
                      {key === 'llama' && <><a href="https://api.together.xyz" target="_blank" rel="noopener" className="underline font-semibold">Together AI</a> → Settings → API Keys</>}
                      {key === 'gigachat' && <><a href="https://developers.sber.ru/studio/workspaces" target="_blank" rel="noopener" className="underline font-semibold">Sber AI</a> → GigaChat API</>}
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <Button
            onClick={onSaveSettings}
            className="w-full gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg h-9 mt-4"
          >
            <Icon name="Save" size={16} />
            <span className="text-sm font-medium">Сохранить</span>
          </Button>
        </div>
      </ScrollArea>
    </Card>
  );
}