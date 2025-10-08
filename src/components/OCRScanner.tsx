import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import Tesseract from 'tesseract.js';

export default function OCRScanner() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ошибка',
        description: 'Выберите файл изображения',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setExtractedText('');
      setProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const preprocessImage = (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const threshold = avg > 128 ? 255 : 0;
          data[i] = threshold;
          data[i + 1] = threshold;
          data[i + 2] = threshold;
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
      img.src = imageData;
    });
  };

  const handleScanImage = async () => {
    if (!selectedImage) {
      toast({
        title: 'Ошибка',
        description: 'Сначала выберите изображение',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const processedImage = await preprocessImage(selectedImage);
      
      const worker = await Tesseract.createWorker('rus+eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      
      await worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        preserve_interword_spaces: '1',
      });

      const result = await worker.recognize(processedImage);
      
      await worker.terminate();

      setExtractedText(result.data.text);
      setProgress(100);
      
      toast({
        title: 'Готово!',
        description: 'Текст успешно распознан',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось распознать текст',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    toast({
      title: 'Скопировано!',
      description: 'Текст скопирован в буфер обмена',
    });
  };

  const handleDownloadText = () => {
    if (!extractedText) return;
    
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted-text-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
            <Icon name="ScanText" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Сканер текста</h1>
            <p className="text-slate-600">Распознавание текста с изображений и документов (OCR)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            {selectedImage ? (
              <div className="space-y-4">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-h-64 mx-auto rounded-xl shadow-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="gap-2"
                >
                  <Icon name="Upload" size={16} />
                  Выбрать другое изображение
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Icon name="Upload" size={48} className="text-slate-400 mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-slate-700">Нажмите для выбора изображения</p>
                  <p className="text-sm text-slate-500 mt-1">Или перетащите файл сюда</p>
                </div>
                <p className="text-xs text-slate-400">Поддерживаются: JPG, PNG, WEBP, PDF</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <Button
            onClick={handleScanImage}
            disabled={!selectedImage || isProcessing}
            className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            {isProcessing ? (
              <>
                <Icon name="Loader2" size={24} className="animate-spin" />
                Распознаю текст... {progress}%
              </>
            ) : (
              <>
                <Icon name="ScanText" size={24} />
                Распознать текст
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </Card>

      {extractedText && (
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Распознанный текст</h3>
            <div className="flex gap-2">
              <Button
                onClick={handleCopyText}
                variant="outline"
                className="gap-2"
              >
                <Icon name="Copy" size={20} />
                Скопировать
              </Button>
              <Button
                onClick={handleDownloadText}
                variant="outline"
                className="gap-2"
              >
                <Icon name="Download" size={20} />
                Скачать TXT
              </Button>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
              {extractedText}
            </pre>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <Icon name="FileText" size={16} />
            <span>Символов: {extractedText.length}</span>
            <span className="text-slate-400">•</span>
            <span>Слов: {extractedText.trim().split(/\s+/).length}</span>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-orange-600" />
          Советы для лучшего распознавания
        </h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Используйте чёткие и контрастные изображения</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Располагайте текст горизонтально (не под углом)</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Избегайте бликов и теней на документе</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Используйте хорошее освещение при съёмке</span>
          </li>
        </ul>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-blue-600" />
          О сканере
        </h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Работает полностью в браузере - ваши данные не покидают устройство</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Поддержка русского и английского языков</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Распознавание текста с документов, фото, скриншотов</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Бесплатно и без ограничений</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}