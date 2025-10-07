import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  attachments?: Array<{ type: 'image' | 'file'; url: string; name: string }>;
  reactions?: Array<{ emoji: string; count: number }>;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  timestamp: Date;
}

export function useSessionManager(autoSave: boolean) {
  const { toast } = useToast();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('chat-sessions');
    return saved ? JSON.parse(saved).map((s: any) => ({ ...s, timestamp: new Date(s.timestamp) })) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (autoSave) {
      localStorage.setItem('chat-sessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions, autoSave]);

  const createNewSession = (initialMessages: Message[]) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: `Сессия ${chatSessions.length + 1}`,
      messages: initialMessages,
      timestamp: new Date(),
    };
    setChatSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    toast({
      title: 'Новая сессия',
      description: 'Создан новый диалог',
    });
    return newSession;
  };

  const switchSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      return session.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return null;
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    toast({
      title: 'Сессия удалена',
      description: 'Диалог успешно удален',
    });
    return currentSessionId === sessionId;
  };

  const renameSession = (sessionId: string, newName: string) => {
    setChatSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, name: newName } : s
    ));
  };

  const exportAllSessions = () => {
    const content = JSON.stringify(chatSessions, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-sessions-${new Date().toISOString()}.json`;
    a.click();
    toast({
      title: 'Экспорт завершен',
      description: 'Все сессии сохранены',
    });
  };

  const importSessions = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setChatSessions(prev => [...prev, ...imported]);
        toast({
          title: 'Импорт завершен',
          description: `Импортировано сессий: ${imported.length}`,
        });
      } catch (error) {
        toast({
          title: 'Ошибка импорта',
          description: 'Неверный формат файла',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  return {
    chatSessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
    renameSession,
    exportAllSessions,
    importSessions,
  };
}
