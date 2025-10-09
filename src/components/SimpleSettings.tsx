import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SimpleSettingsProps {
  apiKey: string;
  selectedModel: string;
  onApiKeyChange: (key: string) => void;
  onModelChange: (model: string) => void;
  onClose: () => void;
}

const AI_MODELS = [
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B',
    description: 'Быстрая модель для простых задач',
    icon: 'Zap',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B',
    description: 'Умная модель с хорошим русским',
    icon: 'Sparkles',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'nousresearch/hermes-3-llama-3.1-405b:free',
    name: 'Hermes 3',
    description: 'Мощная модель для сложных задач',
    icon: 'Brain',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'openchat/openchat-7b:free',
    name: 'OpenChat 7B',
    description: 'Отличная для диалогов модель',
    icon: 'MessageCircle',
    color: 'from-orange-500 to-orange-600',
  },
];

export default function SimpleSettings({ apiKey, selectedModel, onApiKeyChange, onModelChange, onClose }: SimpleSettingsProps) {
  const { toast } = useToast();
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(selectedModel);
  const [testingModel, setTestingModel] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error'>>({});

  const handleSave = () => {
    onApiKeyChange(localKey);
    onModelChange(localModel);
    onClose();
    toast({
      title: 'Настройки сохранены',
      description: 'API ключ и модель успешно обновлены',
    });
  };

  const testModel = async (modelId: string) => {
    if (!localKey) {
      toast({
        title: 'Ошибка',
        description: 'Сначала введите API ключ',
        variant: 'destructive',
      });
      return;
    }

    setTestingModel(modelId);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://poehali.dev',
          'X-Title': 'AI Chat Assistant'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: 'Привет! Ответь одним словом: работает?' }],
          max_tokens: 50,
        }),
      });

      if (response.ok) {
        setTestResults(prev => ({ ...prev, [modelId]: 'success' }));
        toast({
          title: 'Тест пройден',
          description: 'Модель работает корректно',
        });
      } else {
        setTestResults(prev => ({ ...prev, [modelId]: 'error' }));
        toast({
          title: 'Тест не пройден',
          description: 'Модель недоступна или требует оплаты',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [modelId]: 'error' }));
      toast({
        title: 'Ошибка теста',
        description: 'Не удалось протестировать модель',
        variant: 'destructive',
      });
    } finally {
      setTestingModel(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl bg-white/80 hover:bg-white"
          >
            <Icon name="X" size={20} />
          </Button>

          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Настройки</h1>
              <p className="text-slate-600">Настройте API ключ и выберите модель AI</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Icon name="Key" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">OpenRouter API Key</h2>
                  <p className="text-sm text-slate-500">Необходим для работы с AI моделями</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key" className="text-sm font-semibold text-slate-700 mb-2 block">
                    API ключ OpenRouter
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type={showKey ? 'text' : 'password'}
                      value={localKey}
                      onChange={(e) => setLocalKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="flex-1 h-12 text-base"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowKey(!showKey)}
                      className="h-12 w-12"
                    >
                      <Icon name={showKey ? 'EyeOff' : 'Eye'} size={18} />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-2">Как получить API ключ:</p>
                      <ol className="list-decimal list-inside space-y-1 text-blue-800">
                        <li>Зайдите на <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">openrouter.ai/keys</a></li>
                        <li>Войдите через Google или GitHub</li>
                        <li>Нажмите "Create Key"</li>
                        <li>Скопируйте ключ и вставьте сюда</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Icon name="Bot" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Выбор AI модели</h2>
                  <p className="text-sm text-slate-500">Выберите модель и протестируйте её</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AI_MODELS.map((model) => {
                  const isSelected = localModel === model.id;
                  const testResult = testResults[model.id];
                  const isTesting = testingModel === model.id;

                  return (
                    <div
                      key={model.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : testResult === 'success'
                          ? 'border-green-400 bg-green-50'
                          : testResult === 'error'
                          ? 'border-red-400 bg-red-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setLocalModel(model.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                            <Icon name={model.icon as any} size={16} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">{model.name}</h3>
                            <p className="text-xs text-slate-500">{model.description}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <Icon name="CheckCircle" size={20} className="text-blue-600" />
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          testModel(model.id);
                        }}
                        disabled={isTesting || !localKey}
                        className="w-full"
                      >
                        {isTesting ? (
                          <>
                            <Icon name="Loader2" size={14} className="mr-2 animate-spin" />
                            Тестирование...
                          </>
                        ) : testResult === 'success' ? (
                          <>
                            <Icon name="Check" size={14} className="mr-2 text-green-600" />
                            Протестировано
                          </>
                        ) : testResult === 'error' ? (
                          <>
                            <Icon name="X" size={14} className="mr-2 text-red-600" />
                            Ошибка
                          </>
                        ) : (
                          <>
                            <Icon name="Play" size={14} className="mr-2" />
                            Протестировать
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="w-full h-14 text-base gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg"
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