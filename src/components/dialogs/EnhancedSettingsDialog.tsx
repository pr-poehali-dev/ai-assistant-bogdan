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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Температура</Label>
                <Badge variant="outline">{settings.temperature.toFixed(1)}</Badge>
              </div>
              <Slider
                value={[settings.temperature]}
                onValueChange={(v) => onSettingsChange({ ...settings, temperature: v[0] })}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Креативность ответов (0 = точность, 2 = креативность)
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Макс. токенов</Label>
                <Badge variant="outline">{settings.max_tokens}</Badge>
              </div>
              <Slider
                value={[settings.max_tokens]}
                onValueChange={(v) => onSettingsChange({ ...settings, max_tokens: v[0] })}
                min={256}
                max={4096}
                step={256}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Максимальная длина ответа
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-prompt" className="text-sm font-semibold">
                Системный промпт
              </Label>
              <Textarea
                id="system-prompt"
                placeholder="Например: Ты — профессиональный программист..."
                value={settings.system_prompt}
                onChange={(e) => onSettingsChange({ ...settings, system_prompt: e.target.value })}
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
                <Badge variant="outline">{settings.context_length} сообщений</Badge>
              </div>
              <Slider
                value={[settings.context_length]}
                onValueChange={(v) => onSettingsChange({ ...settings, context_length: v[0] })}
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
                checked={settings.auto_save}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, auto_save: checked })}
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
                checked={settings.streaming}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, streaming: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="interface" className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Язык интерфейса</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => onSettingsChange({ ...settings, language: value })}
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
