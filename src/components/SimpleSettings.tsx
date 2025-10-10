import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeFile {
  id: number;
  filename: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

interface SimpleSettingsProps {
  apiKey: string;
  selectedModel: string;
  onApiKeyChange: (key: string) => void;
  onModelChange: (model: string) => void;
  onClose: () => void;
  userId: string;
}

const AI_MODELS = [
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B',
    description: 'Быстрая модель Meta для простых задач',
    icon: 'Zap',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B',
    description: 'Продвинутая модель Google',
    icon: 'Brain',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'deepseek/deepseek-r1-distill-llama-70b:free',
    name: 'DeepSeek R1 70B',
    description: 'Мощная модель для сложных задач',
    icon: 'Sparkles',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash',
    description: 'Новейшая модель Google с мультимодальностью',
    icon: 'Rocket',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'qwen/qwen-2-7b-instruct:free',
    name: 'Qwen 2 7B',
    description: 'Модель с хорошей поддержкой русского',
    icon: 'Cpu',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Phi-3 Mini',
    description: 'Компактная модель Microsoft',
    icon: 'Boxes',
    color: 'from-indigo-500 to-indigo-600',
  },
];

const KB_URL = 'https://functions.poehali.dev/cdaddb97-2235-4bca-af00-38bafbfc3204';

function KnowledgeBaseSection({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [uploadFilename, setUploadFilename] = useState('');

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
    <div className="space-y-6">
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
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить текст
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3">
          Загруженные документы ({files.length})
        </h3>
        
        {isLoading && (
          <div className="text-center py-8">
            <Icon name="Loader2" size={32} className="animate-spin mx-auto text-purple-600" />
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
                  <Icon name="FileText" size={20} className="text-purple-600" />
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
  );
}

export default function SimpleSettings({ apiKey, selectedModel, onApiKeyChange, onModelChange, onClose, userId }: SimpleSettingsProps) {
  const { toast } = useToast();
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(selectedModel);
  const [testingModel, setTestingModel] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error'>>({});
  const [loadingServerKey, setLoadingServerKey] = useState(false);

  useEffect(() => {
    const loadServerKey = async () => {
      if (localKey) return;
      
      setLoadingServerKey(true);
      try {
        const response = await fetch('https://functions.poehali.dev/de994f2d-2a71-42b9-9f8f-80229de307c7');
        const data = await response.json();
        
        if (data.apiKey) {
          setLocalKey(data.apiKey);
        }
      } catch (error) {
        console.error('Failed to load server API key:', error);
      } finally {
        setLoadingServerKey(false);
      }
    };
    
    loadServerKey();
  }, []);

  const handleSave = () => {
    onApiKeyChange(localKey);
    onModelChange(localModel);
    onClose();
    toast({
      title: 'Настройки сохранены',
      description: 'API ключ и модель успешно обновлены',
    });
  };

  const testModel = async (modelId: string) => {
    if (!localKey) {
      toast({
        title: 'Ошибка',
        description: 'Сначала введите API ключ',
        variant: 'destructive',
      });
      return;
    }

    setTestingModel(modelId);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://poehali.dev',
          'X-Title': 'AI Chat Assistant'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: 'Привет! Ответь одним словом: работает?' }],
          max_tokens: 50,
        }),
      });

      if (response.ok) {
        setTestResults(prev => ({ ...prev, [modelId]: 'success' }));
        toast({
          title: 'Тест пройден',
          description: 'Модель работает корректно',
        });
      } else {
        setTestResults(prev => ({ ...prev, [modelId]: 'error' }));
        toast({
          title: 'Тест не пройден',
          description: 'Модель недоступна или требует оплаты',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [modelId]: 'error' }));
      toast({
        title: 'Ошибка теста',
        description: 'Не удалось протестировать модель',
        variant: 'destructive',
      });
    } finally {
      setTestingModel(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl bg-white/80 hover:bg-white"
          >
            <Icon name="X" size={20} />
          </Button>

          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Настройки</h1>
              <p className="text-slate-600">Настройте API ключ и выберите модель AI</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Icon name="Key" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">OpenRouter API Key</h2>
                  <p className="text-sm text-slate-500">Необходим для работы с AI моделями</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key" className="text-sm font-semibold text-slate-700 mb-2 block">
                    API ключ OpenRouter
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="api-key"
                        type={showKey ? 'text' : 'password'}
                        value={localKey}
                        onChange={(e) => setLocalKey(e.target.value)}
                        placeholder={loadingServerKey ? 'Загрузка ключа с сервера...' : 'sk-or-v1-...'}
                        className="h-12 text-base pr-10"
                        disabled={loadingServerKey}
                      />
                      {loadingServerKey && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Icon name="Loader2" size={18} className="text-slate-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowKey(!showKey)}
                      className="h-12 w-12"
                      disabled={loadingServerKey}
                    >
                      <Icon name={showKey ? 'EyeOff' : 'Eye'} size={18} />
                    </Button>
                  </div>
                </div>

{localKey && !loadingServerKey ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Icon name="CheckCircle" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-green-900">
                        <p className="font-semibold">API ключ загружен из секретов проекта</p>
                        <p className="text-green-700 mt-1">Ключ применяется для всех пользователей автоматически</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-2">Как получить API ключ:</p>
                        <ol className="list-decimal list-inside space-y-1 text-blue-800">
                          <li>Зайдите на <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">openrouter.ai/keys</a></li>
                          <li>Войдите через Google или GitHub</li>
                          <li>Нажмите "Create Key"</li>
                          <li>Скопируйте ключ и вставьте сюда</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Icon name="Bot" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Выбор AI модели</h2>
                  <p className="text-sm text-slate-500">Выберите модель и протестируйте её</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AI_MODELS.map((model) => {
                  const isSelected = localModel === model.id;
                  const testResult = testResults[model.id];
                  const isTesting = testingModel === model.id;

                  return (
                    <div
                      key={model.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : testResult === 'success'
                          ? 'border-green-400 bg-green-50'
                          : testResult === 'error'
                          ? 'border-red-400 bg-red-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setLocalModel(model.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                            <Icon name={model.icon as any} size={16} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">{model.name}</h3>
                            <p className="text-xs text-slate-500">{model.description}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <Icon name="CheckCircle" size={20} className="text-blue-600" />
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          testModel(model.id);
                        }}
                        disabled={isTesting || !localKey}
                        className="w-full"
                      >
                        {isTesting ? (
                          <>
                            <Icon name="Loader2" size={14} className="mr-2 animate-spin" />
                            Тестирование...
                          </>
                        ) : testResult === 'success' ? (
                          <>
                            <Icon name="Check" size={14} className="mr-2 text-green-600" />
                            Протестировано
                          </>
                        ) : testResult === 'error' ? (
                          <>
                            <Icon name="X" size={14} className="mr-2 text-red-600" />
                            Ошибка
                          </>
                        ) : (
                          <>
                            <Icon name="Play" size={14} className="mr-2" />
                            Протестировать
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Icon name="BookOpen" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">База знаний</h2>
                  <p className="text-sm text-slate-500">Управление документами для AI</p>
                </div>
              </div>

              <KnowledgeBaseSection userId={userId} />
            </div>

            <Button
              onClick={handleSave}
              className="w-full h-14 text-base gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-lg"
            >
              <Icon name="Save" size={20} />
              <span className="font-semibold">Сохранить настройки</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}