import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const rewriteStyles = [
  { 
    value: 'business', 
    label: 'Деловой стиль', 
    icon: 'Briefcase',
    color: 'from-blue-500 to-blue-600',
    prompt: 'Перепиши текст в деловом, формальном стиле. Используй профессиональную лексику, избегай разговорных выражений. Сохрани суть и структуру.'
  },
  { 
    value: 'friendly', 
    label: 'Дружеский стиль', 
    icon: 'Heart',
    color: 'from-pink-500 to-pink-600',
    prompt: 'Перепиши текст в дружеском, неформальном стиле. Используй простые слова, обращайся на "ты", добавь тепла и близости. Сохрани основную мысль.'
  },
  { 
    value: 'sales', 
    label: 'Продающий стиль', 
    icon: 'TrendingUp',
    color: 'from-green-500 to-green-600',
    prompt: 'Перепиши текст в продающем стиле. Добавь призывы к действию, подчеркни выгоды и преимущества. Сделай текст убедительным и мотивирующим.'
  },
  { 
    value: 'academic', 
    label: 'Академический стиль', 
    icon: 'GraduationCap',
    color: 'from-purple-500 to-purple-600',
    prompt: 'Перепиши текст в академическом, научном стиле. Используй терминологию, структурируй мысли логично, избегай эмоциональности.'
  },
  { 
    value: 'creative', 
    label: 'Креативный стиль', 
    icon: 'Sparkles',
    color: 'from-orange-500 to-orange-600',
    prompt: 'Перепиши текст в креативном, художественном стиле. Используй метафоры, яркие образы, эмоциональные описания. Сделай текст живым и запоминающимся.'
  },
  { 
    value: 'simple', 
    label: 'Простой язык', 
    icon: 'Smile',
    color: 'from-cyan-500 to-cyan-600',
    prompt: 'Перепиши текст максимально простым языком, как для ребёнка. Используй короткие предложения, простые слова, избегай сложных терминов.'
  },
  { 
    value: 'shorter', 
    label: 'Короче', 
    icon: 'Minimize2',
    color: 'from-slate-500 to-slate-600',
    prompt: 'Сократи текст в 2 раза, сохранив ключевые мысли и важную информацию. Убери лишние слова и повторы.'
  },
  { 
    value: 'longer', 
    label: 'Подробнее', 
    icon: 'Maximize2',
    color: 'from-indigo-500 to-indigo-600',
    prompt: 'Расширь текст, добавив больше деталей, примеров и пояснений. Раскрой тему глубже, сохраняя основную мысль.'
  },
];

export default function TextRewriter() {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('business');
  const [isLoading, setIsLoading] = useState(false);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите текст для переписывания',
        variant: 'destructive',
      });
      return;
    }

    const style = rewriteStyles.find(s => s.value === selectedStyle);
    if (!style) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: style.prompt
            },
            {
              role: 'user',
              content: inputText
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Не удалось переписать текст');
      }

      const data = await response.json();
      setRewrittenText(data.choices[0].message.content);
      
      toast({
        title: 'Готово!',
        description: 'Текст успешно переписан',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано!',
      description: 'Текст скопирован в буфер обмена',
    });
  };

  const currentStyle = rewriteStyles.find(s => s.value === selectedStyle);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
            <Icon name="RefreshCw" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Рерайтер текста</h1>
            <p className="text-slate-600">Переписывание текста в разных стилях с помощью ИИ</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Исходный текст
              </label>
              <span className="text-xs text-slate-500">
                {inputText.length} символов
              </span>
            </div>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Вставьте текст, который нужно переписать..."
              className="min-h-64 text-base resize-none"
            />
            {inputText && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(inputText)}
                className="gap-2"
              >
                <Icon name="Copy" size={16} />
                Скопировать
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Переписанный текст
              </label>
              <span className="text-xs text-slate-500">
                {rewrittenText.length} символов
              </span>
            </div>
            <Textarea
              value={rewrittenText}
              readOnly
              placeholder="Результат появится здесь..."
              className="min-h-64 text-base resize-none bg-slate-50"
            />
            {rewrittenText && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(rewrittenText)}
                className="gap-2"
              >
                <Icon name="Copy" size={16} />
                Скопировать
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="text-sm font-semibold text-slate-700 block">
            Выберите стиль
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {rewriteStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => setSelectedStyle(style.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedStyle === style.value
                    ? `border-transparent bg-gradient-to-br ${style.color} text-white shadow-lg`
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <Icon 
                  name={style.icon as any} 
                  size={24} 
                  className={`mx-auto mb-2 ${selectedStyle === style.value ? 'text-white' : 'text-slate-600'}`}
                />
                <p className="text-sm font-semibold">{style.label}</p>
              </button>
            ))}
          </div>

          {currentStyle && (
            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">Описание:</span> {currentStyle.prompt}
              </p>
            </div>
          )}

          <Button
            onClick={handleRewrite}
            disabled={isLoading || !inputText.trim()}
            className={`w-full h-14 text-lg gap-2 bg-gradient-to-r ${currentStyle?.color} hover:opacity-90`}
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={24} className="animate-spin" />
                Переписываю текст...
              </>
            ) : (
              <>
                <Icon name="RefreshCw" size={24} />
                Переписать текст
              </>
            )}
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-purple-200">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Icon name="Lightbulb" size={20} className="text-purple-600" />
            Примеры использования
          </h3>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
              <span>Адаптация текста для разных аудиторий</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
              <span>Создание вариантов рекламных текстов</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
              <span>Упрощение сложных текстов</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
              <span>Улучшение стиля статей и постов</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Icon name="Info" size={20} className="text-blue-600" />
            О рерайтере
          </h3>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
              <span>8 стилей написания на выбор</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
              <span>Работает на GPT-3.5 Turbo</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
              <span>Сохранение смысла исходного текста</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
              <span>Быстрое копирование результата</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
