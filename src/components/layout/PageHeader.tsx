import Icon from '@/components/ui/icon';
import CompactMenu from '@/components/layout/CompactMenu';

interface PageHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onSettingsClick?: () => void;
  onAdminClick?: () => void;
  isAdminAuthenticated?: boolean;
  title?: string;
  subtitle?: string;
}

export default function PageHeader({ 
  currentPage, 
  onNavigate, 
  onSettingsClick = () => {}, 
  onAdminClick = () => {}, 
  isAdminAuthenticated = false,
  title = 'Богдан', 
  subtitle = 'Экосистема ИИ' 
}: PageHeaderProps) {
  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl blur opacity-20"></div>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Icon name="MessageSquare" size={20} className="text-white sm:hidden" />
              <Icon name="MessageSquare" size={24} className="text-white hidden sm:block" />
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">{subtitle}</p>
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