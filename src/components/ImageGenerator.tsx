import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function ImageGenerator() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите описание изображения',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Не удалось сгенерировать изображение');
      }

      const data = await response.json();
      setImageUrl(data.data[0].url);
      
      toast({
        title: 'Готово!',
        description: 'Изображение успешно создано',
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

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
            <Icon name="Sparkles" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Генератор изображений</h1>
            <p className="text-slate-600">Создавайте уникальные изображения с помощью DALL-E 3</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Опишите изображение
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Например: Космонавт на луне в стиле акварели, яркие цвета заката на фоне..."
              className="min-h-32 text-base resize-none"
            />
            <p className="text-xs text-slate-500 mt-2">
              Чем подробнее описание, тем лучше результат. Укажите стиль, цвета, композицию.
            </p>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={24} className="animate-spin" />
                Создаю изображение...
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={24} />
                Создать изображение
              </>
            )}
          </Button>
        </div>
      </Card>

      {imageUrl && (
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Результат</h3>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="gap-2"
            >
              <Icon name="Download" size={20} />
              Скачать
            </Button>
          </div>
          
          <div className="rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full h-auto"
            />
          </div>

          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Описание:</span> {prompt}
            </p>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-purple-600" />
          Советы для лучших результатов
        </h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Указывайте стиль: реализм, аниме, акварель, 3D, пиксель-арт</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Описывайте композицию: крупный план, панорама, вид сверху</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Добавляйте детали: освещение, настроение, время суток</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Избегайте слишком сложных сцен с большим количеством объектов</span>
          </li>
        </ul>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-blue-600" />
          О генераторе
        </h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Использует DALL-E 3 - самую продвинутую ИИ-модель для изображений</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Высокое качество и детализация изображений</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Понимает описания на русском языке</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Скачивание результата в высоком разрешении</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}