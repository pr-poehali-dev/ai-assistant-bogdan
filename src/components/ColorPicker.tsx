import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function ColorPicker() {
  const { toast } = useToast();
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const { r, g, b } = hexToRgb(hex);
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
        case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
        case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: 'Скопировано!', description: `${format} скопирован в буфер обмена` });
    setTimeout(() => setCopied(false), 2000);
  };

  const presetColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b',
  ];

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColor(randomColor);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
            <Icon name="Palette" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Палитра цветов</h1>
            <p className="text-slate-600">Выбирайте и конвертируйте цвета</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-3 block">Выберите цвет</label>
            <div className="relative">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-64 rounded-xl cursor-pointer border-4 border-white shadow-lg"
              />
            </div>

            <div className="mt-4 space-y-2">
              <Button onClick={generateRandomColor} className="w-full gap-2" variant="outline">
                <Icon name="Shuffle" size={18} />
                Случайный цвет
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">HEX</label>
              <div className="flex gap-2">
                <Input value={color.toUpperCase()} onChange={(e) => setColor(e.target.value)} className="text-lg font-mono" />
                <Button onClick={() => copyToClipboard(color.toUpperCase(), 'HEX')} variant="outline" size="icon">
                  <Icon name="Copy" size={18} />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">RGB</label>
              <div className="flex gap-2">
                <Input value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly className="text-lg font-mono bg-slate-50" />
                <Button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')} variant="outline" size="icon">
                  <Icon name="Copy" size={18} />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">HSL</label>
              <div className="flex gap-2">
                <Input value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} readOnly className="text-lg font-mono bg-slate-50" />
                <Button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')} variant="outline" size="icon">
                  <Icon name="Copy" size={18} />
                </Button>
              </div>
            </div>

            <Card className="p-4" style={{ backgroundColor: color }}>
              <div className="h-24 flex items-center justify-center">
                <span className="text-2xl font-bold drop-shadow-lg" style={{ 
                  color: hsl.l > 50 ? '#000000' : '#FFFFFF' 
                }}>
                  Предпросмотр
                </span>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <label className="text-sm font-medium text-slate-700 mb-3 block">Быстрый выбор</label>
          <div className="grid grid-cols-6 md:grid-cols-9 gap-3">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => setColor(presetColor)}
                className="w-full aspect-square rounded-lg shadow-md hover:scale-110 transition-transform border-2 border-white"
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              />
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-purple-600" />
          Форматы цветов
        </h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span><strong>HEX:</strong> #FF5733 - для CSS, HTML и дизайна</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span><strong>RGB:</strong> rgb(255, 87, 51) - красный, зелёный, синий</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span><strong>HSL:</strong> hsl(9, 100%, 60%) - тон, насыщенность, яркость</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
