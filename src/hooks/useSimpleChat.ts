import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Settings {
  temperature: number;
  max_tokens: number;
  system_prompt: string;
}

export function useSimpleChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat-history');
    return saved ? JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) : [
      {
        id: '1',
        role: 'assistant',
        content: 'Здравствуйте! Я AI-ассистент на базе OpenRouter. Чем могу помочь?',
        timestamp: new Date(),
      },
    ];
  });
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openrouter-key') || '');
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('ai-settings');
    return saved ? JSON.parse(saved) : {
      temperature: 0.7,
      max_tokens: 2048,
      system_prompt: '',
    };
  });

  useEffect(() => {
    localStorage.setItem('chat-history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('openrouter-key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('ai-settings', JSON.stringify(settings));
  }, [settings]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    if (!apiKey) {
      toast({
        title: 'API ключ не настроен',
        description: 'Добавьте API ключ OpenRouter в настройках',
        variant: 'destructive',
      });
      return;
    }

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
          apiKey: apiKey,
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
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось получить ответ',
        variant: 'destructive',
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Извините, произошла ошибка: ${error.message}`,
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
      content: 'История очищена. Чем могу помочь?',
      timestamp: new Date(),
    }]);
  };

  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    apiKey,
    setApiKey,
    settings,
    setSettings,
    handleSendMessage,
    clearHistory,
  };
}
