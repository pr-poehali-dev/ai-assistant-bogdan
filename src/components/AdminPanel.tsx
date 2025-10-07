import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

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
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Icon name="BarChart3" size={16} />
              Статистика использования
            </h3>
            <div className="space-y-2">
              {Object.entries(modelInfo).map(([key, info]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                      <Icon name={info.icon as any} size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{info.name}</span>
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