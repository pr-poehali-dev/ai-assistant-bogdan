import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CompactMenuProps {
  isAdminAuthenticated: boolean;
  onNavigate: (page: string) => void;
  onSettingsClick: () => void;
  onAdminClick: () => void;
}

export default function CompactMenu({
  isAdminAuthenticated,
  onNavigate,
  onSettingsClick,
  onAdminClick,
}: CompactMenuProps) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg sm:rounded-xl hover:bg-slate-100 h-8 w-8 sm:h-10 sm:w-10"
        >
          <Icon name="Menu" size={20} className="text-slate-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => handleNavigate('chat')} className="gap-2 cursor-pointer">
          <Icon name="MessageSquare" size={18} className="text-blue-600" />
          <span>Главная</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('about')} className="gap-2 cursor-pointer">
          <Icon name="Info" size={18} className="text-purple-600" />
          <span>О проекте</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('features')} className="gap-2 cursor-pointer">
          <Icon name="Sparkles" size={18} className="text-green-600" />
          <span>Возможности</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('team')} className="gap-2 cursor-pointer">
          <Icon name="Users" size={18} className="text-orange-600" />
          <span>Команда</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('docs')} className="gap-2 cursor-pointer">
          <Icon name="BookOpen" size={18} className="text-cyan-600" />
          <span>Документация</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => { onSettingsClick(); setOpen(false); }} className="gap-2 cursor-pointer">
          <Icon name="Sliders" size={18} className="text-slate-600" />
          <span>Настройки</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => { onAdminClick(); setOpen(false); }} className="gap-2 cursor-pointer">
          <Icon name={isAdminAuthenticated ? 'Shield' : 'Lock'} size={18} className="text-slate-600" />
          <span>{isAdminAuthenticated ? 'Админ-панель' : 'Вход для админа'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
