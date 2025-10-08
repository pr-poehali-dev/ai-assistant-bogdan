import Icon from '@/components/ui/icon';
import CompactMenu from '@/components/layout/CompactMenu';

interface ChatHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSettingsClick: () => void;
  onAdminClick: () => void;
  isAdminAuthenticated: boolean;
  showAdminPanel: boolean;
  isDarkMode?: boolean;
  autoMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleAutoMode?: () => void;
}

export default function ChatHeader({ 
  currentPage, 
  onNavigate, 
  onSettingsClick, 
  onAdminClick,
  isAdminAuthenticated,
  showAdminPanel,
  isDarkMode,
  autoMode,
  onToggleDarkMode,
  onToggleAutoMode
}: ChatHeaderProps) {
  return (
    <header className={`border-b transition-colors sticky top-0 z-50 shadow-sm ${
      isDarkMode 
        ? 'border-slate-700 bg-slate-900/90 backdrop-blur-xl' 
        : 'border-slate-200/60 bg-white/80 backdrop-blur-xl'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between max-w-[1600px]">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Icon name="Bot" size={18} className="text-white sm:hidden" />
              <Icon name="Bot" size={20} className="text-white hidden sm:block" />
            </div>
          </div>
          <div>
            <h1 className={`text-base sm:text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              isDarkMode ? 'from-blue-400 to-blue-200' : 'from-slate-800 to-slate-600'
            }`}>
              Богдан AI
            </h1>
            <p className={`hidden sm:block text-[10px] font-medium ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>Экосистема ИИ</p>
          </div>
        </div>
        <CompactMenu
          isAdminAuthenticated={isAdminAuthenticated}
          onNavigate={onNavigate}
          onSettingsClick={onSettingsClick}
          onAdminClick={onAdminClick}
          isDarkMode={isDarkMode}
          autoMode={autoMode}
          onToggleDarkMode={onToggleDarkMode}
          onToggleAutoMode={onToggleAutoMode}
        />
      </div>
    </header>
  );
}