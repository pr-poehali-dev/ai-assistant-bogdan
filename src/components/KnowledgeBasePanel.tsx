import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeFile {
  id: number;
  filename: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

interface KnowledgeBasePanelProps {
  userId: string;
  onClose: () => void;
}

export default function KnowledgeBasePanel({ userId, onClose }: KnowledgeBasePanelProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [uploadFilename, setUploadFilename] = useState('');

  const KB_URL = 'https://functions.poehali.dev/cdaddb97-2235-4bca-af00-38bafbfc3204';

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${KB_URL}?userId=${userId}`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить файлы',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      
      const response = await fetch(KB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload',
          userId: userId,
          filename: file.name,
          content: text,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Файл загружен',
          description: `${file.name} добавлен в базу знаний`,
        });
        loadFiles();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить файл',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextUpload = async () => {
    if (!uploadFilename || !uploadText) {
      toast({
        title: 'Заполните поля',
        description: 'Введите название и текст',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(KB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload',
          userId: userId,
          filename: uploadFilename,
          content: uploadText,
          fileType: 'text/plain',
          fileSize: uploadText.length,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Текст добавлен',
          description: `${uploadFilename} добавлен в базу знаний`,
        });
        setUploadFilename('');
        setUploadText('');
        loadFiles();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить текст',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(KB_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: fileId,
          userId: userId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Файл удалён',
          description: 'Файл удалён из базы знаний',
        });
        loadFiles();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить файл',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl bg-white/80 hover:bg-white"
          >
            <Icon name="X" size={20} />
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">База знаний</h1>
            <p className="text-slate-600">Загружайте файлы и тексты, чтобы AI использовал их в ответах</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Добавить новый документ</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Загрузить файл (.txt, .md, .json)
                </label>
                <Input
                  type="file"
                  accept=".txt,.md,.json,.csv"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">или</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Добавить текст вручную
                </label>
                <Input
                  placeholder="Название документа"
                  value={uploadFilename}
                  onChange={(e) => setUploadFilename(e.target.value)}
                  disabled={isLoading}
                  className="mb-2"
                />
                <textarea
                  placeholder="Вставьте текст здесь..."
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={handleTextUpload}
                  disabled={isLoading || !uploadFilename || !uploadText}
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить текст
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Загруженные документы ({files.length})
            </h2>
            
            {isLoading && (
              <div className="text-center py-8">
                <Icon name="Loader2" size={32} className="animate-spin mx-auto text-blue-600" />
              </div>
            )}

            {!isLoading && files.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Icon name="FileText" size={48} className="mx-auto mb-3 opacity-50" />
                <p>Пока нет загруженных документов</p>
              </div>
            )}

            {!isLoading && files.length > 0 && (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Icon name="FileText" size={20} className="text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{file.filename}</p>
                        <p className="text-xs text-slate-500">
                          {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(file.id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
