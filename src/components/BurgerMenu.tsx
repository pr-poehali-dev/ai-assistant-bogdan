import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface BurgerMenuProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function BurgerMenu({ onNavigate, currentPage }: BurgerMenuProps) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: 'chat', label: 'Чат', icon: 'MessageSquare', description: 'Общайтесь с AI' },
    { id: 'about', label: 'О проекте', icon: 'Info', description: 'Узнайте о Богдане' },
    { id: 'features', label: 'Возможности', icon: 'Sparkles', description: 'Что умеет AI' },
    { id: 'team', label: 'Команда', icon: 'Users', description: 'Наши создатели' },
    { id: 'docs', label: 'Документация', icon: 'BookOpen', description: 'Руководства и API' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
          <Icon name="Menu" size={24} className="text-slate-700" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-white/95 backdrop-blur-xl border-r border-slate-200">
        <SheetHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-20"></div>
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Icon name="MessageSquare" size={24} className="text-white" />
              </div>
            </div>
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Богдан
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  currentPage === item.id ? 'bg-white/20' : 'bg-slate-100'
                }`}
              >
                <Icon
                  name={item.icon as any}
                  size={20}
                  className={currentPage === item.id ? 'text-white' : 'text-slate-600'}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm">{item.label}</p>
                <p
                  className={`text-xs ${
                    currentPage === item.id ? 'text-white/80' : 'text-slate-500'
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="space-y-3">
          <a
            href="https://t.me/bogdan_ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 transition-all"
          >
            <Icon name="Send" size={18} />
            <span className="text-sm font-medium">Telegram канал</span>
          </a>
          <a
            href="https://github.com/bogdan-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 transition-all"
          >
            <Icon name="Github" size={18} />
            <span className="text-sm font-medium">GitHub</span>
          </a>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Версия 1.0.0</p>
            <p className="text-xs text-slate-500">© 2024 Богдан AI</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
