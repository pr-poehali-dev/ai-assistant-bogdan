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
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface DocumentCompareButtonProps {
  onCompare?: (file1: File, file2: File) => void;
}

export default function DocumentCompareButton({ onCompare }: DocumentCompareButtonProps) {
  const [open, setOpen] = useState(false);
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const { toast } = useToast();

  const handleCompare = () => {
    if (!file1 || !file2) {
      toast({
        title: 'Выберите файлы',
        description: 'Необходимо загрузить оба документа для сравнения',
        variant: 'destructive',
      });
      return;
    }

    if (onCompare) {
      onCompare(file1, file2);
      setOpen(false);
      setFile1(null);
      setFile2(null);
      
      toast({
        title: '🔍 Сравниваю документы',
        description: 'ИИ анализирует различия между файлами...',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Icon name="FileSearch" size={16} />
          Сравнить
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="FileSearch" size={20} className="text-blue-600" />
            Сравнение документов
          </DialogTitle>
          <DialogDescription>
            Загрузите два документа, и ИИ найдёт все различия между ними
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Документ 1</label>
            <div className="border-2 border-dashed rounded-lg p-4 hover:border-blue-400 transition-colors">
              <input
                type="file"
                onChange={(e) => setFile1(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.txt"
                className="w-full text-sm"
              />
              {file1 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                  <Icon name="File" size={14} />
                  {file1.name}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Документ 2</label>
            <div className="border-2 border-dashed rounded-lg p-4 hover:border-blue-400 transition-colors">
              <input
                type="file"
                onChange={(e) => setFile2(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.txt"
                className="w-full text-sm"
              />
              {file2 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                  <Icon name="File" size={14} />
                  {file2.name}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleCompare}
            disabled={!file1 || !file2}
            className="w-full gap-2"
          >
            <Icon name="GitCompare" size={18} />
            Сравнить документы
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
