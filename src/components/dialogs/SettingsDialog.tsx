import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface Settings {
  temperature: number;
  max_tokens: number;
  system_prompt: string;
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onSave: () => void;
}

export default function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
  onSave,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Sliders" size={24} className="text-blue-600" />
            Настройки AI
          </DialogTitle>
          <DialogDescription>
            Настройте параметры генерации для всех моделей
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-4">
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
              className="rounded-xl border-slate-200 min-h-[100px]"
            />
            <p className="text-xs text-slate-500">
              Инструкции для AI (опционально)
            </p>
          </div>

          <Button
            onClick={onSave}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg font-medium"
          >
            Сохранить настройки
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
