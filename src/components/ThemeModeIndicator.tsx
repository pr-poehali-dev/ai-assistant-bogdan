import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ThemeModeIndicatorProps {
  autoMode: boolean;
  isDarkMode: boolean;
}

export default function ThemeModeIndicator({ autoMode, isDarkMode }: ThemeModeIndicatorProps) {
  if (!autoMode) return null;

  const hour = new Date().getHours();
  const timeRange = isDarkMode ? '19:00-7:00' : '7:00-19:00';

  return (
    <Badge 
      variant="outline" 
      className={`gap-1.5 border-2 ${
        isDarkMode 
          ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' 
          : 'border-amber-500/30 bg-amber-500/10 text-amber-700'
      }`}
    >
      <Icon name={isDarkMode ? 'Moon' : 'Sun'} size={12} />
      <span className="text-xs font-medium">
        Авторежим • {timeRange}
      </span>
    </Badge>
  );
}
