import Icon from '@/components/ui/icon';
import CompactMenu from '@/components/layout/CompactMenu';

interface ChatHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSettingsClick: () => void;
  onAdminClick: () => void;
  isAdminAuthenticated: boolean;
  showAdminPanel: boolean;
}

export default function ChatHeader({ 
  currentPage, 
  onNavigate, 
  onSettingsClick, 
  onAdminClick,
  isAdminAuthenticated,
  showAdminPanel
}: ChatHeaderProps) {
  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between max-w-[1600px]">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Icon name="Bot" size={18} className="text-white sm:hidden" />
              <Icon name="Bot" size={20} className="text-white hidden sm:block" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Богдан AI
            </h1>
            <p className="hidden sm:block text-[10px] text-slate-500 font-medium">Экосистема ИИ</p>
          </div>
        </div>
        <CompactMenu
          isAdminAuthenticated={isAdminAuthenticated}
          onNavigate={onNavigate}
          onSettingsClick={onSettingsClick}
          onAdminClick={onAdminClick}
        />
      </div>
    </header>
  );
}