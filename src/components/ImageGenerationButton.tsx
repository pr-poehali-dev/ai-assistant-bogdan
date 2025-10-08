import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ImageGenerationButtonProps {
  onImageGenerated?: (imageUrl: string, prompt: string) => void;
}

export default function ImageGenerationButton({ onImageGenerated }: ImageGenerationButtonProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Введите описание',
        description: 'Опишите что вы хотите увидеть на изображении',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка генерации');
      }

      setGeneratedImage(data.imageUrl);
      toast({
        title: '🎨 Изображение создано!',
        description: 'Можете добавить его в чат',
      });

      if (onImageGenerated) {
        onImageGenerated(data.imageUrl, prompt);
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка генерации',
        description: error.message || 'Не удалось создать изображение',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToChat = () => {
    if (generatedImage && onImageGenerated) {
      onImageGenerated(generatedImage, prompt);
      setOpen(false);
      setPrompt('');
      setGeneratedImage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Icon name="Sparkles" size={16} />
          Создать изображение
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Sparkles" size={20} className="text-purple-600" />
            Генерация изображения через ИИ
          </DialogTitle>
          <DialogDescription>
            Опишите что вы хотите увидеть, и ИИ создаст изображение
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Описание изображения</label>
            <Textarea
              placeholder="Например: футуристический город на закате, киберпанк стиль, неоновые огни..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-24"
              disabled={isGenerating}
            />
          </div>

          {generatedImage && (
            <div className="border rounded-xl p-4 bg-slate-50">
              <img 
                src={generatedImage} 
                alt="Сгенерированное изображение" 
                className="w-full rounded-lg"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 gap-2"
            >
              {isGenerating ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Генерирую...
                </>
              ) : (
                <>
                  <Icon name="Wand2" size={18} />
                  Создать
                </>
              )}
            </Button>
            
            {generatedImage && (
              <Button
                onClick={handleAddToChat}
                variant="outline"
                className="gap-2"
              >
                <Icon name="MessageSquare" size={18} />
                Добавить в чат
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
