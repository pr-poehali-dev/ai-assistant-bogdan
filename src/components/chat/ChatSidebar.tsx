import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import StatsPanel from '@/components/StatsPanel';

interface Session {
  id: string;
  name: string;
  messages: any[];
}

interface ChatSidebarProps {
  sessions: Session[];
  currentSessionId: string;
  stats: any;
  modelInfo: any;
  collapsed: boolean;
  onCreateSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onToggleCollapse: () => void;
  onClearStats: () => void;
}

export default function ChatSidebar({
  sessions,
  currentSessionId,
  stats,
  modelInfo,
  collapsed,
  onCreateSession,
  onSwitchSession,
  onToggleCollapse,
  onClearStats
}: ChatSidebarProps) {
  if (collapsed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleCollapse}
        className="hidden lg:flex col-span-1 h-12 rounded-lg bg-white shadow-md hover:bg-slate-50 self-start"
      >
        <Icon name="ChevronRight" size={16} className="text-slate-600" />
      </Button>
    );
  }

  return (
    <div className="hidden lg:block col-span-3 space-y-2 sm:space-y-3 relative">
      <Card className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5 text-xs sm:text-sm">
          <Icon name="Folder" size={14} className="text-blue-600 sm:hidden" />
          <Icon name="Folder" size={16} className="text-blue-600 hidden sm:block" />
          Сессии
        </h3>
        <Button
          onClick={onCreateSession}
          size="sm"
          className="w-full gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg h-8 mb-2"
        >
          <Icon name="Plus" size={14} />
          <span className="text-xs">Новая сессия</span>
        </Button>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {sessions.slice(0, 5).map((session) => (
            <button
              key={session.id}
              onClick={() => onSwitchSession(session.id)}
              className={`w-full p-2 rounded-lg text-left text-xs transition-colors ${
                currentSessionId === session.id
                  ? 'bg-blue-100 text-blue-900 font-medium'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="truncate">{session.name}</div>
              <div className="text-[10px] text-slate-500">{session.messages.length} сообщ.</div>
            </button>
          ))}
        </div>
      </Card>
      
      <Card className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5 text-xs sm:text-sm">
          <Icon name="TrendingUp" size={14} className="text-green-600 sm:hidden" />
          <Icon name="TrendingUp" size={16} className="text-green-600 hidden sm:block" />
          Статистика
        </h3>
        <StatsPanel
          stats={stats}
          modelInfo={modelInfo}
          onClearStats={onClearStats}
        />
      </Card>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 h-12 w-6 rounded-r-lg bg-white shadow-md hover:bg-slate-50 p-0"
      >
        <Icon name="ChevronLeft" size={16} className="text-slate-600" />
      </Button>
    </div>
  );
}