import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileTabMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { value: 'chat', icon: 'MessageSquare', label: 'Чат', color: 'from-blue-500 to-blue-600' },
  { value: 'assistants', icon: 'Users', label: 'Ассистенты', color: 'from-purple-500 to-purple-600' },
  { value: 'knowledge', icon: 'BookOpen', label: 'База знаний', color: 'from-green-500 to-green-600' },
  { value: 'translator', icon: 'Languages', label: 'Переводчик', color: 'from-blue-500 to-purple-600' },
  { value: 'weather', icon: 'CloudSun', label: 'Погода', color: 'from-cyan-500 to-blue-600' },
  { value: 'ocr', icon: 'ScanText', label: 'OCR', color: 'from-orange-500 to-red-600' },
  { value: 'qr', icon: 'QrCode', label: 'QR-коды', color: 'from-violet-500 to-purple-600' },
  { value: 'notes', icon: 'StickyNote', label: 'Заметки', color: 'from-yellow-500 to-orange-600' },
  { value: 'password', icon: 'Lock', label: 'Пароли', color: 'from-emerald-500 to-teal-600' },
  { value: 'calc', icon: 'Calculator', label: 'Калькулятор', color: 'from-blue-500 to-indigo-600' },
  { value: 'timer', icon: 'Timer', label: 'Таймер', color: 'from-purple-500 to-pink-600' },
  { value: 'converter', icon: 'Ruler', label: 'Конвертер', color: 'from-cyan-500 to-blue-600' },
  { value: 'color', icon: 'Palette', label: 'Цвета', color: 'from-pink-500 to-purple-600' },
  { value: 'counter', icon: 'Hash', label: 'Счётчик', color: 'from-green-500 to-emerald-600' },
  { value: 'random', icon: 'Sparkles', label: 'Случайности', color: 'from-orange-500 to-red-600' },
  { value: 'metronome', icon: 'Music', label: 'Метроном', color: 'from-indigo-500 to-purple-600' },
];

export default function MobileTabMenu({ activeTab, onTabChange }: MobileTabMenuProps) {
  const [open, setOpen] = useState(false);
  
  const activeTabData = tabs.find(tab => tab.value === activeTab) || tabs[0];

  const handleTabSelect = (value: string) => {
    onTabChange(value);
    setOpen(false);
  };

  return (
    <div className="sm:hidden fixed bottom-4 right-4 z-40">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            className={`h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br ${activeTabData.color}`}
            size="icon"
          >
            <Icon name={activeTabData.icon as any} size={24} className="text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-center text-xl">Инструменты</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3 mt-6 overflow-y-auto h-[calc(80vh-80px)] pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabSelect(tab.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  activeTab === tab.value
                    ? `bg-gradient-to-br ${tab.color} text-white shadow-lg scale-105`
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <Icon 
                  name={tab.icon as any} 
                  size={28} 
                  className={activeTab === tab.value ? 'text-white' : 'text-slate-700'}
                />
                <span className={`text-xs font-medium text-center ${
                  activeTab === tab.value ? 'text-white' : 'text-slate-700'
                }`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
