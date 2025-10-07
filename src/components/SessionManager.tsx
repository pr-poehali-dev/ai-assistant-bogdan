import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  timestamp: Date;
}

interface SessionManagerProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onCreateSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  onExportAll: () => void;
  onImport: (file: File) => void;
}

export default function SessionManager({
  sessions,
  currentSessionId,
  onCreateSession,
  onSwitchSession,
  onDeleteSession,
  onRenameSession,
  onExportAll,
  onImport,
}: SessionManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleRename = (sessionId: string) => {
    if (editName.trim()) {
      onRenameSession(sessionId, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  return (
    <Card className="h-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name="FolderOpen" size={20} className="text-purple-600" />
            <h3 className="font-bold text-slate-800">Сессии</h3>
          </div>
          <Badge variant="outline">{sessions.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onCreateSession}
            size="sm"
            className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <Icon name="Plus" size={16} />
            Новая
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Icon name="MoreVertical" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onExportAll}>
                <Icon name="Download" size={16} className="mr-2" />
                Экспорт всех
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.getElementById('import-sessions')?.click()}>
                <Icon name="Upload" size={16} className="mr-2" />
                Импорт
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            id="import-sessions"
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-120px)]">
        <div className="p-3 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm">Нет сохраненных сессий</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-xl border transition-all ${
                  currentSessionId === session.id
                    ? 'bg-purple-50 border-purple-300'
                    : 'bg-white border-slate-200 hover:border-purple-200'
                }`}
              >
                {editingId === session.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleRename(session.id)}
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleRename(session.id)}
                      className="h-8 px-2"
                    >
                      <Icon name="Check" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null);
                        setEditName('');
                      }}
                      className="h-8 px-2"
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => onSwitchSession(session.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-800 truncate">
                          {session.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(session.timestamp).toLocaleDateString('ru-RU')}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-2">
                          {session.messages.length} сообщений
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icon name="MoreVertical" size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(session.id);
                              setEditName(session.name);
                            }}
                          >
                            <Icon name="Edit2" size={14} className="mr-2" />
                            Переименовать
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            className="text-red-600"
                          >
                            <Icon name="Trash2" size={14} className="mr-2" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
