import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ModelCard from '@/components/admin/ModelCard';
import { useAdminPanelLogic } from '@/components/admin/useAdminPanelLogic';
import { modelConfigs } from '@/components/admin/modelConfigs';

type AIModel = 'gemini' | 'llama' | 'gigachat' | 'phi' | 'qwen' | 'mistral';

interface APIConfig {
  gemini: { key: string; enabled: boolean };
  llama: { key: string; enabled: boolean };
  gigachat: { key: string; enabled: boolean };
  phi: { key: string; enabled: boolean };
  qwen: { key: string; enabled: boolean };
  mistral: { key: string; enabled: boolean };
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
  const {
    testingModel,
    testResults,
    keyErrors,
    showKeys,
    setShowKeys,
    handleKeyChange,
    testModel,
  } = useAdminPanelLogic(apiConfig, onAPIKeyChange);

  const models: AIModel[] = ['gemini', 'llama', 'gigachat', 'phi', 'qwen', 'mistral'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Настройка API ключей</h1>
          <p className="text-slate-600">Добавьте API ключи для работы с моделями ИИ</p>
        </div>

        <div className="space-y-6">
          {models.map(model => {
            const config = modelConfigs[model];
            return (
              <ModelCard
                key={model}
                model={model}
                title={config.title}
                subtitle={config.subtitle}
                iconName={config.iconName}
                colorClass={config.colorClass}
                apiKey={apiConfig[model].key}
                enabled={apiConfig[model].enabled}
                testResult={testResults[model]}
                keyError={keyErrors[model]}
                showKey={showKeys[model]}
                isTesting={testingModel === model}
                placeholder={config.placeholder}
                keyLabel={config.keyLabel}
                instructionColor={config.instructionColor}
                instructionContent={config.instructionContent}
                onKeyChange={(key) => handleKeyChange(model, key)}
                onToggle={(enabled) => onToggleModel(model, enabled)}
                onTest={() => testModel(model)}
                onToggleShowKey={() => setShowKeys(prev => ({ ...prev, [model]: !prev[model] }))}
              />
            );
          })}

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
