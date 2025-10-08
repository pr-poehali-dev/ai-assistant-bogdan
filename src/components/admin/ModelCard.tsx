import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

type AIModel = 'gemini' | 'llama' | 'gigachat' | 'phi' | 'qwen' | 'mistral';

interface ModelCardProps {
  model: AIModel;
  title: string;
  subtitle: string;
  iconName: string;
  colorClass: string;
  apiKey: string;
  enabled: boolean;
  testResult: 'success' | 'error' | null;
  keyError: string | null;
  showKey: boolean;
  isTesting: boolean;
  placeholder?: string;
  keyLabel?: string;
  instructionContent?: React.ReactNode;
  onKeyChange: (key: string) => void;
  onToggle: (enabled: boolean) => void;
  onTest: () => void;
  onToggleShowKey: () => void;
}

export default function ModelCard({
  model,
  title,
  subtitle,
  iconName,
  colorClass,
  apiKey,
  enabled,
  testResult,
  keyError,
  showKey,
  isTesting,
  placeholder = 'sk-or-v1-...',
  keyLabel = 'OpenRouter API Key',
  instructionContent,
  onKeyChange,
  onToggle,
  onTest,
  onToggleShowKey,
}: ModelCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all ${
      testResult === 'success' ? 'border-green-400 bg-green-50/30' :
      testResult === 'error' ? 'border-red-400 bg-red-50/30' :
      'border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center relative`}>
            <Icon name={iconName} size={24} className="text-white" />
            {testResult === 'success' && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Icon name="Check" size={12} className="text-white" />
              </div>
            )}
            {testResult === 'error' && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <Icon name="X" size={12} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>
        {testResult === 'success' && (
          <div className="px-3 py-1.5 rounded-lg bg-green-100 border border-green-300">
            <p className="text-xs font-semibold text-green-700">✓ Тест пройден</p>
          </div>
        )}
        {testResult === 'error' && (
          <div className="px-3 py-1.5 rounded-lg bg-red-100 border border-red-300">
            <p className="text-xs font-semibold text-red-700">✗ Ошибка</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`${model}-key`} className="text-sm font-semibold text-slate-700 mb-2 block">
            {keyLabel}
          </Label>
          <div className="relative">
            <Input
              id={`${model}-key`}
              type={showKey ? 'text' : 'password'}
              placeholder={placeholder}
              value={apiKey}
              onChange={(e) => onKeyChange(e.target.value)}
              className={`h-12 text-base pr-12 ${keyError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggleShowKey}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-slate-100"
            >
              <Icon name={showKey ? 'EyeOff' : 'Eye'} size={18} className="text-slate-500" />
            </Button>
          </div>
          {keyError ? (
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
              <Icon name="AlertCircle" size={12} />
              {keyError}
            </p>
          ) : (
            model !== 'gigachat' && (
              <p className="text-xs text-slate-500 mt-2">
                Формат: <code className="bg-slate-100 px-1 py-0.5 rounded">sk-or-v1-...</code> (начинается с sk-or-v1-)
              </p>
            )
          )}
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
          <Label htmlFor={`${model}-toggle`} className="text-sm font-medium text-slate-700">
            Модель активна
          </Label>
          <Switch
            id={`${model}-toggle`}
            checked={enabled}
            onCheckedChange={onToggle}
          />
        </div>

        <Button
          onClick={onTest}
          disabled={!apiKey || isTesting || !!keyError}
          variant="outline"
          className="w-full h-12 gap-2"
        >
          {isTesting ? (
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

        {instructionContent}
      </div>
    </div>
  );
}