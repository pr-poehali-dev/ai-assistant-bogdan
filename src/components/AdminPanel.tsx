import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface APIConfig {
  gemini: { key: string; enabled: boolean };
  llama: { key: string; enabled: boolean };
  gigachat: { key: string; enabled: boolean };
}

interface AdminPanelProps {
  apiConfig: APIConfig;
  onAPIKeyChange: (model: AIModel, key: string) => void;
  onToggleModel: (model: AIModel, enabled: boolean) => void;
  onSaveSettings: () => void;
}

export default function AdminPanel({
  apiConfig,
  onAPIKeyChange,
  onToggleModel,
  onSaveSettings,
}: AdminPanelProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Настройка API ключей</h1>
          <p className="text-slate-600">Добавьте API ключи для работы с моделями ИИ</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Icon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Gemini Flash (Скорость)</h2>
                <p className="text-sm text-slate-500">google/gemini-flash-1.5-8b</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="gemini-key" className="text-sm font-semibold text-slate-700 mb-2 block">
                  OpenRouter API Key
                </Label>
                <Input
                  id="gemini-key"
                  type="password"
                  placeholder="sk-or-v1-..."
                  value={apiConfig.gemini.key}
                  onChange={(e) => onAPIKeyChange('gemini', e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <Label htmlFor="gemini-toggle" className="text-sm font-medium text-slate-700">
                  Модель активна
                </Label>
                <Switch
                  id="gemini-toggle"
                  checked={apiConfig.gemini.enabled}
                  onCheckedChange={(checked) => onToggleModel('gemini', checked)}
                />
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener" className="underline font-semibold">
                    Получить ключ на OpenRouter →
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Icon name="Target" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Llama 3.1 (Точность)</h2>
                <p className="text-sm text-slate-500">meta-llama/llama-3.1-8b-instruct</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="llama-key" className="text-sm font-semibold text-slate-700 mb-2 block">
                  OpenRouter API Key
                </Label>
                <Input
                  id="llama-key"
                  type="password"
                  placeholder="sk-or-v1-..."
                  value={apiConfig.llama.key}
                  onChange={(e) => onAPIKeyChange('llama', e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <Label htmlFor="llama-toggle" className="text-sm font-medium text-slate-700">
                  Модель активна
                </Label>
                <Switch
                  id="llama-toggle"
                  checked={apiConfig.llama.enabled}
                  onCheckedChange={(checked) => onToggleModel('llama', checked)}
                />
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <p className="text-sm text-purple-800">
                  Используйте тот же ключ, что и для Gemini
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">GigaChat (Креатив)</h2>
                <p className="text-sm text-slate-500">GigaChat от Сбера</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="gigachat-key" className="text-sm font-semibold text-slate-700 mb-2 block">
                  GigaChat Client Secret (Base64)
                </Label>
                <Input
                  id="gigachat-key"
                  type="password"
                  placeholder="MDE5OWMwNmEt..."
                  value={apiConfig.gigachat.key}
                  onChange={(e) => onAPIKeyChange('gigachat', e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <Label htmlFor="gigachat-toggle" className="text-sm font-medium text-slate-700">
                  Модель активна
                </Label>
                <Switch
                  id="gigachat-toggle"
                  checked={apiConfig.gigachat.enabled}
                  onCheckedChange={(checked) => onToggleModel('gigachat', checked)}
                />
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800 mb-2">
                  ⚠️ <strong>Внимание:</strong> GigaChat API может работать медленно (15-30 сек)
                </p>
                <p className="text-sm text-amber-700">
                  <a href="https://developers.sber.ru/studio/workspaces" target="_blank" rel="noopener" className="underline font-semibold">
                    Получить ключ на Sber AI Studio →
                  </a>
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onSaveSettings}
            className="w-full h-14 text-base gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg"
          >
            <Icon name="Save" size={20} />
            <span className="font-semibold">Сохранить настройки</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
