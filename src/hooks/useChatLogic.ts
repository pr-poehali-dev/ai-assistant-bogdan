import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { selectBestModel, getModelDisplayName } from '@/lib/modelSelector';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

type AIModel = 'gemini' | 'llama' | 'gigachat' | 'phi' | 'qwen' | 'mistral';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: AIModel;
  attachments?: Array<{ type: 'image' | 'file' | 'audio'; url: string; name: string; duration?: number }>;
  reactions?: Array<{ emoji: string; count: number }>;
}

interface APIConfig {
  gemini: { key: string; enabled: boolean };
  llama: { key: string; enabled: boolean };
  gigachat: { key: string; enabled: boolean };
  phi: { key: string; enabled: boolean };
  qwen: { key: string; enabled: boolean };
  mistral: { key: string; enabled: boolean };
  activeModel?: AIModel;
}

interface Settings {
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  context_length: number;
  auto_save: boolean;
  streaming: boolean;
  language: string;
  top_p: number;
  top_k: number;
  frequency_penalty: number;
  presence_penalty: number;
  repetition_penalty: number;
}

const modelInfo = {
  gemini: { name: 'Режим Скорость', fullName: 'Быстрые ответы', color: 'from-blue-500 to-blue-600', icon: 'Zap' },
  llama: { name: 'Режим Точность', fullName: 'Детальный анализ', color: 'from-purple-500 to-purple-600', icon: 'Target' },
  gigachat: { name: 'Режим Креатив', fullName: 'Творческие решения', color: 'from-green-500 to-green-600', icon: 'Lightbulb' },
  phi: { name: 'Режим Компактность', fullName: 'Компактные ответы', color: 'from-indigo-500 to-indigo-600', icon: 'Brain' },
  qwen: { name: 'Режим Баланс', fullName: 'Баланс скорости и качества', color: 'from-orange-500 to-orange-600', icon: 'Cpu' },
  mistral: { name: 'Режим Эффективность', fullName: 'Эффективные ответы', color: 'from-rose-500 to-rose-600', icon: 'Rocket' },
};

export function useChatLogic() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat-history');
    return saved ? JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) : [
      {
        id: '1',
        role: 'assistant',
        content: 'Здравствуйте! Чем могу помочь?',
        timestamp: new Date(),
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIModel | null>(null);
  const [apiConfig, setApiConfig] = useState<APIConfig>(() => {
    const saved = localStorage.getItem('ai-config');
    return saved ? JSON.parse(saved) : {
      gemini: { key: '', enabled: true },
      llama: { key: '', enabled: true },
      gigachat: { key: '', enabled: true },
      phi: { key: '', enabled: true },
      qwen: { key: '', enabled: true },
      mistral: { key: '', enabled: true },
      activeModel: 'gemini',
    };
  });
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('ai-settings');
    return saved ? JSON.parse(saved) : {
      temperature: 0.7,
      max_tokens: 2048,
      system_prompt: '',
      context_length: 10,
      auto_save: true,
      streaming: false,
      language: 'ru',
      top_p: 0.9,
      top_k: 40,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      repetition_penalty: 1.0,
    };
  });
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('ai-stats');
    return saved ? JSON.parse(saved) : {
      gemini: 0,
      llama: 0,
      gigachat: 0,
    };
  });
  const [selectedModel, setSelectedModel] = useState<AIModel | 'auto'>('auto');

  useEffect(() => {
    localStorage.setItem('ai-config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  useEffect(() => {
    localStorage.setItem('chat-history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ai-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ai-stats', JSON.stringify(stats));
  }, [stats]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const activeModel = apiConfig.activeModel || 'gemini';
    
    if (!apiConfig[activeModel]?.enabled || !apiConfig[activeModel]?.key) {
      toast({
        title: 'Модель не настроена',
        description: `Настройте ${modelInfo[activeModel]?.name} в панели управления`,
        variant: 'destructive',
      });
      return;
    }

    const selectedAIModel = activeModel;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setCurrentModel(selectedAIModel);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('https://functions.poehali.dev/81fdec08-160f-4043-a2da-cefa0ffbdf22', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          models: apiConfig,
          history: history,
          settings: settings,
          preferredModel: selectedAIModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.error || 'Ошибка запроса';
        if (data.details && Array.isArray(data.details)) {
          const errorDetails = data.details.map((d: any) => `${d.model}: ${d.error}`).join(', ');
          errorMsg = `${errorMsg}. Детали: ${errorDetails}`;
        }
        throw new Error(errorMsg);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        model: data.model,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentModel(data.model);

      setStats(prev => ({
        ...prev,
        [data.model]: (prev[data.model] || 0) + 1
      }));

      if (data.fallback_used) {
        toast({
          title: 'Использовано резервирование',
          description: `Ответ получен от ${modelInfo[data.model as AIModel]?.name || data.model}`,
        });
      }
    } catch (error: any) {
      let errorTitle = 'Ошибка подключения';
      let errorDescription = error.message || 'Не удалось получить ответ';
      let userFriendlyMessage = 'Извините, произошла ошибка. ';
      
      if (error.message?.includes('timeout')) {
        errorTitle = 'Превышено время ожидания';
        errorDescription = 'Сервис не отвечает. Попробуйте другой режим работы.';
        userFriendlyMessage = '⏱️ Сервис не успел ответить. Попробуйте переключиться на другой режим работы в настройках или попробуйте позже.';
      } else if (error.message?.includes('API') || error.message?.includes('key')) {
        errorTitle = 'Ошибка API';
        errorDescription = 'Проверьте API ключи в настройках';
        userFriendlyMessage = '🔑 Проверьте API ключи. Войдите как администратор (кнопка шестеренка справа вверху) и настройте хотя бы один режим работы.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorTitle = 'Проблема с сетью';
        errorDescription = 'Проверьте интернет-соединение';
        userFriendlyMessage = '🌐 Проблема с интернет-соединением. Проверьте подключение к сети.';
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive',
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: userFriendlyMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Здравствуйте! Чем могу помочь?',
      timestamp: new Date(),
    }]);
    toast({
      title: 'История очищена',
      description: 'Все сообщения удалены',
    });
  };

  const exportChat = () => {
    const content = messages.map(m => `[${m.timestamp.toLocaleString()}] ${m.role === 'user' ? 'Вы' : 'Богдан'}: ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString()}.txt`;
    a.click();
    toast({
      title: 'Экспорт завершен',
      description: 'История чата сохранена в файл',
    });
  };

  const copyMessageToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Скопировано',
      description: 'Сообщение скопировано в буфер обмена',
    });
  };

  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;
    
    const previousUserMessage = messages[messageIndex - 1];
    if (previousUserMessage.role !== 'user') return;

    setMessages(prev => prev.slice(0, messageIndex));
    setInputMessage(previousUserMessage.content);
    await handleSendMessage();
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const reactions = m.reactions || [];
        const existing = reactions.find(r => r.emoji === emoji);
        if (existing) {
          existing.count++;
        } else {
          reactions.push({ emoji, count: 1 });
        }
        return { ...m, reactions };
      }
      return m;
    }));
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      return '';
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const totalFiles = fileArray.length;
    const newAttachments: Array<{ type: 'image' | 'file'; url: string; name: string }> = [];
    const extractedTexts: string[] = [];

    for (const file of fileArray) {
      const reader = new FileReader();
      
      const fileData = await new Promise<{ url: string; text?: string }>((resolve) => {
        reader.onload = async (e) => {
          const url = e.target?.result as string;
          let extractedText = '';
          
          if (file.type === 'application/pdf') {
            toast({
              title: '📄 Анализирую PDF...',
              description: `Извлекаю текст из ${file.name}`,
            });
            extractedText = await extractTextFromPDF(file);
          } else if (file.type.startsWith('image/')) {
            toast({
              title: '🖼️ Анализирую изображение...',
              description: `Отправляю ${file.name} на анализ`,
            });
            extractedText = `🖼️ Прикреплено изображение "${file.name}". Пожалуйста, опиши что на нём изображено и проанализируй детали.`;
          }
          
          resolve({ url, text: extractedText });
        };
        reader.readAsDataURL(file);
      });

      const attachment = {
        type: file.type.startsWith('image/') ? 'image' as const : 'file' as const,
        url: fileData.url,
        name: file.name,
      };
      newAttachments.push(attachment);
      
      if (fileData.text) {
        extractedTexts.push(fileData.text);
      }
    }

    const userContent = inputMessage.trim() || 'Прикрепленные файлы';
    const displayContent = userContent;
    let fullContentForAI = userContent;
    
    if (extractedTexts.length > 0) {
      fullContentForAI = `${userContent}\n\n${extractedTexts.join('\n\n---\n\n')}`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: displayContent,
      timestamp: new Date(),
      attachments: newAttachments,
    };
    
    setMessages(prev => [...prev, userMessage]);
    const savedInput = fullContentForAI;
    setInputMessage('');
    setIsLoading(true);
    
    toast({
      title: `Файлы загружены`,
      description: extractedTexts.length > 0 
        ? `PDF обработан, отправляю ИИ...` 
        : `Добавлено: ${totalFiles} файл(ов)`,
    });

    if (extractedTexts.length > 0) {
      const enabledModels = Object.entries(apiConfig).filter(([_, config]) => config.enabled && config.key);
      
      if (enabledModels.length === 0) {
        toast({
          title: 'Сервис недоступен',
          description: 'Настройте хотя бы один режим работы в панели управления',
          variant: 'destructive',
        });
        setIsLoading(false);
        event.target.value = '';
        return;
      }

      try {
        const history = messages.map(m => ({
          role: m.role,
          content: m.content
        }));

        const response = await fetch('https://functions.poehali.dev/81fdec08-160f-4043-a2da-cefa0ffbdf22', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: savedInput,
            models: apiConfig,
            history: history,
            settings: settings,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка запроса');
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          model: data.model,
        };

        setMessages(prev => [...prev, assistantMessage]);
        setCurrentModel(data.model);

        setStats(prev => ({
          ...prev,
          [data.model]: (prev[data.model] || 0) + 1
        }));
      } catch (error: any) {
        toast({
          title: 'Ошибка анализа',
          description: error.message || 'Не удалось проанализировать PDF',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
    
    event.target.value = '';
  };

  const handleVoiceMessageSend = async (audioBlob: Blob, duration: number) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const audioUrl = e.target?.result as string;
      
      toast({
        title: 'Распознаю речь...',
        description: 'Анализирую голосовое сообщение',
      });

      try {
        const recognizedText = await transcribeAudio(audioBlob);
        
        const voiceMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: recognizedText || '🎤 Голосовое сообщение',
          timestamp: new Date(),
          attachments: [{
            type: 'audio',
            url: audioUrl,
            name: `voice-${Date.now()}.webm`,
            duration: duration,
          }],
        };
        setMessages(prev => [...prev, voiceMessage]);
        
        if (recognizedText) {
          toast({
            title: 'Речь распознана',
            description: 'Отправляю сообщение ИИ...',
          });
          
          setTimeout(() => {
            setInputMessage(recognizedText);
            handleSendMessage();
          }, 500);
        } else {
          toast({
            title: 'Голосовое сообщение отправлено',
            description: `Продолжительность: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
          });
        }
      } catch (error) {
        console.error('Transcription error:', error);
        
        const voiceMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: '🎤 Голосовое сообщение',
          timestamp: new Date(),
          attachments: [{
            type: 'audio',
            url: audioUrl,
            name: `voice-${Date.now()}.webm`,
            duration: duration,
          }],
        };
        setMessages(prev => [...prev, voiceMessage]);
        
        toast({
          title: 'Не удалось распознать речь',
          description: 'Голосовое сообщение сохранено',
          variant: 'destructive',
        });
      }
    };
    reader.readAsDataURL(audioBlob);
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string | null> => {
    try {
      const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
      recognition.lang = settings.language === 'ru' ? 'ru-RU' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      return new Promise((resolve, reject) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          resolve(transcript);
        };

        recognition.onerror = (event: any) => {
          reject(event.error);
        };

        recognition.onend = () => {
          URL.revokeObjectURL(audioUrl);
        };

        audio.onplay = () => {
          recognition.start();
        };

        audio.play();
      });
    } catch (error) {
      console.error('Speech recognition not supported:', error);
      return null;
    }
  };

  const setActiveModel = (model: AIModel) => {
    setApiConfig(prev => ({ ...prev, activeModel: model }));
  };

  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    currentModel,
    apiConfig,
    setApiConfig,
    settings,
    setSettings,
    stats,
    setStats,
    selectedModel,
    setSelectedModel,
    handleSendMessage,
    clearHistory,
    exportChat,
    copyMessageToClipboard,
    regenerateResponse,
    addReaction,
    handleFileUpload,
    handleVoiceMessageSend,
    setActiveModel,
  };
}