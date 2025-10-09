import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface SimpleSettingsProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onClose: () => void;
}

export default function SimpleSettings({ apiKey, onApiKeyChange, onClose }: SimpleSettingsProps) {
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);

  const handleSave = () => {
    onApiKeyChange(localKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl bg-white/80 hover:bg-white"
          >
            <Icon name="X" size={20} />
          </Button>

          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Настройки API</h1>
              <p className="text-slate-600">Подключите OpenRouter для работы с AI</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Icon name="Sparkles" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">OpenRouter API</h2>
                  <p className="text-sm text-slate-500">Автоматический выбор лучшей модели</p>
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
                      <p className="mt-2 text-xs">OpenRouter автоматически подберёт бесплатную модель для ваших запросов</p>
                    </div>
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
      </div>
    </div>
  );
}
