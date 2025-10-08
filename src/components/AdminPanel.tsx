import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Настройка API ключей</h1>
          <p className="text-slate-600">Добавьте API ключи для работы с моделями ИИ</p>
        </div>

        <div className="space-y-6">
          <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all ${
            testResults.gemini === 'success' ? 'border-green-400 bg-green-50/30' :
            testResults.gemini === 'error' ? 'border-red-400 bg-red-50/30' :
            'border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
                  <Icon name="Zap" size={24} className="text-white" />
                  {testResults.gemini === 'success' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                  )}
                  {testResults.gemini === 'error' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Icon name="X" size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Gemini Flash (Скорость)</h2>
                  <p className="text-sm text-slate-500">google/gemini-flash-1.5-8b</p>
                </div>
              </div>
              {testResults.gemini === 'success' && (
                <div className="px-3 py-1.5 rounded-lg bg-green-100 border border-green-300">
                  <p className="text-xs font-semibold text-green-700">✓ Тест пройден</p>
                </div>
              )}
              {testResults.gemini === 'error' && (
                <div className="px-3 py-1.5 rounded-lg bg-red-100 border border-red-300">
                  <p className="text-xs font-semibold text-red-700">✗ Ошибка</p>
                </div>
              )}
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

              <Button
                onClick={() => testModel('gemini')}
                disabled={!apiConfig.gemini.key || testingModel === 'gemini'}
                variant="outline"
                className="w-full h-12 gap-2"
              >
                {testingModel === 'gemini' ? (
                  <>
                    <Icon name="Loader2" size={18} className="animate-spin" />
                    <span>Тестирование...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Play" size={18} />
                    <span>Протестировать API</span>
                  </>
                )}
              </Button>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener" className="underline font-semibold">
                    Получить ключ на OpenRouter →
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all ${
            testResults.llama === 'success' ? 'border-green-400 bg-green-50/30' :
            testResults.llama === 'error' ? 'border-red-400 bg-red-50/30' :
            'border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center relative">
                  <Icon name="Target" size={24} className="text-white" />
                  {testResults.llama === 'success' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                  )}
                  {testResults.llama === 'error' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Icon name="X" size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Llama 3.1 (Точность)</h2>
                  <p className="text-sm text-slate-500">meta-llama/llama-3.1-8b-instruct</p>
                </div>
              </div>
              {testResults.llama === 'success' && (
                <div className="px-3 py-1.5 rounded-lg bg-green-100 border border-green-300">
                  <p className="text-xs font-semibold text-green-700">✓ Тест пройден</p>
                </div>
              )}
              {testResults.llama === 'error' && (
                <div className="px-3 py-1.5 rounded-lg bg-red-100 border border-red-300">
                  <p className="text-xs font-semibold text-red-700">✗ Ошибка</p>
                </div>
              )}
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

              <Button
                onClick={() => testModel('llama')}
                disabled={!apiConfig.llama.key || testingModel === 'llama'}
                variant="outline"
                className="w-full h-12 gap-2"
              >
                {testingModel === 'llama' ? (
                  <>
                    <Icon name="Loader2" size={18} className="animate-spin" />
                    <span>Тестирование...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Play" size={18} />
                    <span>Протестировать API</span>
                  </>
                )}
              </Button>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <p className="text-sm text-purple-800">
                  Используйте тот же ключ, что и для Gemini
                </p>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all ${
            testResults.gigachat === 'success' ? 'border-green-400 bg-green-50/30' :
            testResults.gigachat === 'error' ? 'border-red-400 bg-red-50/30' :
            'border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center relative">
                  <Icon name="Sparkles" size={24} className="text-white" />
                  {testResults.gigachat === 'success' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                  )}
                  {testResults.gigachat === 'error' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Icon name="X" size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">GigaChat (Креатив)</h2>
                  <p className="text-sm text-slate-500">GigaChat от Сбера</p>
                </div>
              </div>
              {testResults.gigachat === 'success' && (
                <div className="px-3 py-1.5 rounded-lg bg-green-100 border border-green-300">
                  <p className="text-xs font-semibold text-green-700">✓ Тест пройден</p>
                </div>
              )}
              {testResults.gigachat === 'error' && (
                <div className="px-3 py-1.5 rounded-lg bg-red-100 border border-red-300">
                  <p className="text-xs font-semibold text-red-700">✗ Ошибка</p>
                </div>
              )}
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

              <Button
                onClick={() => testModel('gigachat')}
                disabled={!apiConfig.gigachat.key || testingModel === 'gigachat'}
                variant="outline"
                className="w-full h-12 gap-2"
              >
                {testingModel === 'gigachat' ? (
                  <>
                    <Icon name="Loader2" size={18} className="animate-spin" />
                    <span>Тестирование...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Play" size={18} />
                    <span>Протестировать API</span>
                  </>
                )}
              </Button>

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

          <div className="flex gap-4">
            <Button
              onClick={onSaveSettings}
              className="flex-1 h-14 text-base gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg"
            >
              <Icon name="Save" size={20} />
              <span className="font-semibold">Сохранить настройки</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}