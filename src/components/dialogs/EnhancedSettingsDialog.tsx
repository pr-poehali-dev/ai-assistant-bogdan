import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Settings {
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  context_length: number;
  auto_save: boolean;
  streaming: boolean;
  language: string;
  top_p: number;
  top_k: number;
  frequency_penalty: number;
  presence_penalty: number;
  repetition_penalty: number;
}

interface EnhancedSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onSave: () => void;
}

export default function EnhancedSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
  onSave,
}: EnhancedSettingsDialogProps) {
  const safeSettings = {
    temperature: settings.temperature ?? 0.7,
    max_tokens: settings.max_tokens ?? 2048,
    system_prompt: settings.system_prompt ?? '',
    context_length: settings.context_length ?? 10,
    auto_save: settings.auto_save ?? true,
    streaming: settings.streaming ?? false,
    language: settings.language ?? 'ru',
    top_p: settings.top_p ?? 0.9,
    top_k: settings.top_k ?? 40,
    frequency_penalty: settings.frequency_penalty ?? 0.0,
    presence_penalty: settings.presence_penalty ?? 0.0,
    repetition_penalty: settings.repetition_penalty ?? 1.0,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Settings" size={24} className="text-blue-600" />
            Расширенные настройки
          </DialogTitle>
          <DialogDescription>
            Настройте все параметры работы AI-ассистента
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="generation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="generation" className="rounded-lg">
              <Icon name="Sparkles" size={16} className="mr-2" />
              Генерация
            </TabsTrigger>
            <TabsTrigger value="behavior" className="rounded-lg">
              <Icon name="Sliders" size={16} className="mr-2" />
              Поведение
            </TabsTrigger>
            <TabsTrigger value="interface" className="rounded-lg">
              <Icon name="Layout" size={16} className="mr-2" />
              Интерфейс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generation" className="space-y-6 pt-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Быстрые пресеты</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onSettingsChange({
                    ...safeSettings,
                    temperature: 0.3,
                    top_p: 0.8,
                    top_k: 20,
                    frequency_penalty: 0.2,
                    presence_penalty: 0.0,
                    repetition_penalty: 1.1,
                  })}
                >
                  <Icon name="Target" size={14} className="mr-1" />
                  Точность
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onSettingsChange({
                    ...safeSettings,
                    temperature: 0.7,
                    top_p: 0.9,
                    top_k: 40,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.0,
                    repetition_penalty: 1.0,
                  })}
                >
                  <Icon name="Settings" size={14} className="mr-1" />
                  Баланс
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onSettingsChange({
                    ...safeSettings,
                    temperature: 1.2,
                    top_p: 0.95,
                    top_k: 80,
                    frequency_penalty: 0.5,
                    presence_penalty: 0.3,
                    repetition_penalty: 1.2,
                  })}
                >
                  <Icon name="Sparkles" size={14} className="mr-1" />
                  Креатив
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Temperature</Label>
                  <Badge variant="outline">{safeSettings.temperature.toFixed(1)}</Badge>
                </div>
                <Slider
                  value={[safeSettings.temperature]}
                  onValueChange={(v) => onSettingsChange({ ...safeSettings, temperature: v[0] })}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  Креативность (0 = точность, 2 = креатив)
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Top P</Label>
                  <Badge variant="outline">{safeSettings.top_p.toFixed(2)}</Badge>
                </div>
                <Slider
                  value={[safeSettings.top_p]}
                  onValueChange={(v) => onSettingsChange({ ...safeSettings, top_p: v[0] })}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  Ограничение вероятности токенов
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Top K</Label>
                  <Badge variant="outline">{safeSettings.top_k}</Badge>
                </div>
                <Slider
                  value={[safeSettings.top_k]}
                  onValueChange={(v) => onSettingsChange({ ...safeSettings, top_k: v[0] })}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  Количество топ токенов
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Max Tokens</Label>
                  <Badge variant="outline">{safeSettings.max_tokens}</Badge>
                </div>
                <Slider
                  value={[safeSettings.max_tokens]}
                  onValueChange={(v) => onSettingsChange({ ...safeSettings, max_tokens: v[0] })}
                  min={256}
                  max={4096}
                  step={256}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  Максимальная длина ответа
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Frequency Penalty</Label>
                  <Badge variant="outline">{safeSettings.frequency_penalty.toFixed(1)}</Badge>
                </div>
                <Slider
                  value={[safeSettings.frequency_penalty]}
                  onValueChange={(v) => onSettingsChange({ ...safeSettings, frequency_penalty: v[0] })}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  Штраф за частые слова
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Presence Penalty</Label>
                  <Badge variant="outline">{safeSettings.presence_penalty.toFixed(1)}</Badge>
                </div>
                <Slider
                  value={[safeSettings.presence_penalty]}
                  onValueChange={(v) => onSettingsChange({ ...safeSettings, presence_penalty: v[0] })}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  Штраф за повторы тем
                </p>
              </div>

              <div className="space-y-3 col-span-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Repetition Penalty</Label>
                  <Badge variant="outline">{safeSettings.repetition_penalty.toFixed(2)}</Badge>
                </div>
                <Slider
                  value={[safeSettings.repetition_penalty]}
                  onValueChange={(v) => onSettingsChange({ ...safeSettings, repetition_penalty: v[0] })}
                  min={0.5}
                  max={2}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  Общий штраф за повторения (1.0 = отключен)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-prompt" className="text-sm font-semibold">
                Системный промпт
              </Label>
              <Textarea
                id="system-prompt"
                placeholder="Например: Ты — профессиональный программист..."
                value={safeSettings.system_prompt}
                onChange={(e) => onSettingsChange({ ...safeSettings, system_prompt: e.target.value })}
                className="rounded-xl border-slate-200 min-h-[120px]"
              />
              <p className="text-xs text-slate-500">
                Инструкции для AI (опционально)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6 pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Длина контекста</Label>
                <Badge variant="outline">{safeSettings.context_length} сообщений</Badge>
              </div>
              <Slider
                value={[safeSettings.context_length]}
                onValueChange={(v) => onSettingsChange({ ...safeSettings, context_length: v[0] })}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Количество предыдущих сообщений для контекста
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex-1">
                <Label className="text-sm font-semibold">Авто-сохранение</Label>
                <p className="text-xs text-slate-500 mt-1">
                  Автоматически сохранять все сессии
                </p>
              </div>
              <Switch
                checked={safeSettings.auto_save}
                onCheckedChange={(checked) => onSettingsChange({ ...safeSettings, auto_save: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex-1">
                <Label className="text-sm font-semibold">Потоковая передача</Label>
                <p className="text-xs text-slate-500 mt-1">
                  Показывать ответ частями по мере генерации
                </p>
              </div>
              <Switch
                checked={safeSettings.streaming}
                onCheckedChange={(checked) => onSettingsChange({ ...safeSettings, streaming: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="interface" className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Язык интерфейса</Label>
              <Select
                value={safeSettings.language}
                onValueChange={(value) => onSettingsChange({ ...safeSettings, language: value })}
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">
                    <div className="flex items-center gap-2">
                      <span>🇷🇺</span>
                      <span>Русский</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <span>🇬🇧</span>
                      <span>English</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="es">
                    <div className="flex items-center gap-2">
                      <span>🇪🇸</span>
                      <span>Español</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Горячие клавиши
                  </p>
                  <div className="space-y-1 text-xs text-blue-700">
                    <p><kbd className="px-1.5 py-0.5 bg-white rounded">Ctrl+K</kbd> - Новая сессия</p>
                    <p><kbd className="px-1.5 py-0.5 bg-white rounded">Ctrl+F</kbd> - Поиск</p>
                    <p><kbd className="px-1.5 py-0.5 bg-white rounded">Ctrl+E</kbd> - Экспорт</p>
                    <p><kbd className="px-1.5 py-0.5 bg-white rounded">Ctrl+/</kbd> - Настройки</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 rounded-xl"
          >
            Отмена
          </Button>
          <Button
            onClick={onSave}
            className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg font-medium"
          >
            <Icon name="Save" size={18} className="mr-2" />
            Сохранить настройки
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}