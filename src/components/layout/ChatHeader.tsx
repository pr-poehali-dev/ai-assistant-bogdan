import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import BurgerMenu from '@/components/BurgerMenu';

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
      <div className="container mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between max-w-[1600px]">
        <div className="flex items-center gap-1.5 sm:gap-3">
          <BurgerMenu onNavigate={onNavigate} currentPage={currentPage} />
          <div className="relative">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Icon name="Bot" size={16} className="text-white sm:hidden" />
              <Icon name="Bot" size={20} className="text-white hidden sm:block" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Богдан AI
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Экосистема искусственного интеллекта</p>
          </div>
          <h1 className="text-sm font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent sm:hidden">
            Богдан AI
          </h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="rounded-lg sm:rounded-xl hover:bg-slate-100 h-8 w-8 sm:h-10 sm:w-10"
          >
            <Icon name="Sliders" size={16} className="text-slate-600 sm:hidden" />
            <Icon name="Sliders" size={20} className="text-slate-600 hidden sm:block" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onAdminClick}
            className="rounded-lg sm:rounded-xl hover:bg-slate-100 h-8 w-8 sm:h-10 sm:w-10"
          >
            <Icon name={isAdminAuthenticated ? 'Menu' : 'Settings'} size={16} className="text-slate-600 sm:hidden" />
            <Icon name={isAdminAuthenticated ? 'Menu' : 'Settings'} size={20} className="text-slate-600 hidden sm:block" />
          </Button>
        </div>
      </div>
    </header>
  );
}