import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

type AIModel = 'gemini' | 'llama' | 'gigachat' | 'phi' | 'qwen' | 'mistral';

interface APIConfig {
  gemini: { key: string; enabled: boolean };
  llama: { key: string; enabled: boolean };
  gigachat: { key: string; enabled: boolean };
  phi: { key: string; enabled: boolean };
  qwen: { key: string; enabled: boolean };
  mistral: { key: string; enabled: boolean };
}

interface SimplifiedAdminPanelProps {
  apiConfig: APIConfig;
  onAPIKeyChange: (model: AIModel, key: string) => void;
  onToggleModel: (model: AIModel, enabled: boolean) => void;
  onSaveSettings: () => void;
}

export default function SimplifiedAdminPanel({
  apiConfig,
  onAPIKeyChange,
  onToggleModel,
  onSaveSettings,
}: SimplifiedAdminPanelProps) {
  const [masterKey, setMasterKey] = useState(() => {
    const firstKey = Object.values(apiConfig).find(c => c.key)?.key || '';
    return firstKey;
  });
  const [showKey, setShowKey] = useState(false);

  const models: { id: AIModel; name: string; icon: string; description: string; color: string }[] = [
    { id: 'gemini', name: 'Gemini', icon: 'Zap', description: 'Быстрые ответы для повседневных задач', color: 'from-blue-500 to-blue-600' },
    { id: 'llama', name: 'Llama', icon: 'Target', description: 'Детальный анализ сложных вопросов', color: 'from-purple-500 to-purple-600' },
    { id: 'gigachat', name: 'GigaChat', icon: 'Lightbulb', description: 'Творческие и нестандартные решения', color: 'from-green-500 to-green-600' },
    { id: 'phi', name: 'Phi', icon: 'Brain', description: 'Эффективные компактные ответы', color: 'from-indigo-500 to-indigo-600' },
    { id: 'qwen', name: 'Qwen', icon: 'Cpu', description: 'Оптимальное соотношение скорости и качества', color: 'from-orange-500 to-orange-600' },
    { id: 'mistral', name: 'Mistral', icon: 'Rocket', description: 'Быстро и качественно', color: 'from-rose-500 to-rose-600' },
  ];

  const handleSave = () => {
    models.forEach(model => {
      if (apiConfig[model.id].enabled) {
        onAPIKeyChange(model.id, masterKey);
      }
    });
    onSaveSettings();
  };

  const enabledCount = models.filter(m => apiConfig[m.id].enabled).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">🔑 Настройка API</h1>
          <p className="text-slate-600">Один ключ для всех моделей ИИ. Система автоматически выберет лучшую модель для каждого запроса.</p>
        </div>

        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="space-y-4">
            <div>
              <Label htmlFor="master-key" className="text-base font-semibold text-slate-700">
                API ключ (OpenRouter, OpenAI или другой провайдер)
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="master-key"
                  type={showKey ? 'text' : 'password'}
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 h-12 text-base"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                  className="h-12 w-12"
                >
                  <Icon name={showKey ? 'EyeOff' : 'Eye'} size={20} />
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Получите ключ на <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenRouter.ai</a> или используйте свой ключ OpenAI
              </p>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Доступные модели ({enabledCount} из {models.length})
          </h2>
          <p className="text-slate-600 text-sm mb-4">
            Выберите модели, между которыми система будет автоматически переключаться в зависимости от типа вашего запроса.
          </p>
          <div className="grid gap-3">
            {models.map(model => {
              const modelConfig = apiConfig[model.id] || { key: '', enabled: true };
              return (
                <Card
                  key={model.id}
                  className={`p-4 cursor-pointer transition-all ${
                    modelConfig.enabled
                      ? 'bg-gradient-to-r ' + model.color + ' text-white shadow-lg'
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  onClick={() => onToggleModel(model.id, !modelConfig.enabled)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${modelConfig.enabled ? 'bg-white/20' : 'bg-slate-100'}`}>
                      <Icon name={model.icon as any} size={24} className={modelConfig.enabled ? 'text-white' : 'text-slate-600'} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${modelConfig.enabled ? 'text-white' : 'text-slate-800'}`}>
                        {model.name}
                      </h3>
                      <p className={`text-sm ${modelConfig.enabled ? 'text-white/90' : 'text-slate-600'}`}>
                        {model.description}
                      </p>
                    </div>
                    <div>
                      {modelConfig.enabled ? (
                        <Icon name="CheckCircle" size={28} className="text-white" />
                      ) : (
                        <Icon name="Circle" size={28} className="text-slate-300" />
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Как это работает?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Код и баги</strong> → Llama (максимальная точность)</li>
                <li>• <strong>Креатив и идеи</strong> → GigaChat (творческий подход)</li>
                <li>• <strong>Быстрые вопросы</strong> → Gemini или Mistral (скорость)</li>
                <li>• <strong>Большой контекст</strong> → Llama (до 128K токенов)</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!masterKey.trim() || enabledCount === 0}
          className="w-full h-14 text-base gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg"
        >
          <Icon name="Save" size={20} />
          <span className="font-semibold">Сохранить настройки</span>
        </Button>
      </div>
    </div>
  );
}
