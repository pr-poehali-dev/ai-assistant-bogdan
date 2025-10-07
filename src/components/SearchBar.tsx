import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredMessages: Message[];
  onClose: () => void;
  onSelectMessage: (messageId: string) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  filteredMessages,
  onClose,
  onSelectMessage,
}: SearchBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-lg">
      <div className="p-4">
        <div className="flex gap-2 items-center mb-3">
          <div className="flex-1 relative">
            <Icon
              name="Search"
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Поиск по сообщениям..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-10 rounded-xl"
              autoFocus
            />
          </div>
          <Badge variant="outline">{filteredMessages.length}</Badge>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
            <Icon name="X" size={18} />
          </Button>
        </div>

        {searchQuery && (
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Icon name="SearchX" size={48} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Ничего не найдено</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => {
                      onSelectMessage(message.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                        {message.role === 'user' ? 'Вы' : 'AI'}
                      </Badge>
                      <p className="text-xs text-slate-400">
                        {message.timestamp.toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">{message.content}</p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
