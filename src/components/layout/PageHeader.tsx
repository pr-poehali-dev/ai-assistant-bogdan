import Icon from '@/components/ui/icon';
import BurgerMenu from '@/components/BurgerMenu';

interface PageHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  title?: string;
  subtitle?: string;
}

export default function PageHeader({ currentPage, onNavigate, title = 'Богдан', subtitle = 'Экосистема ИИ' }: PageHeaderProps) {
  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-4">
          <BurgerMenu onNavigate={onNavigate} currentPage={currentPage} />
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-20"></div>
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Icon name="MessageSquare" size={24} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
