import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const MAIN_TABS = [
  { value: 'chat', icon: 'MessageSquare', label: 'Чат', gradient: 'from-blue-500 to-blue-600' },
  { value: 'assistants', icon: 'Users', label: 'Ассистенты', gradient: 'from-purple-500 to-purple-600' },
  { value: 'knowledge', icon: 'BookOpen', label: 'База знаний', gradient: 'from-green-500 to-green-600' },
];

const TOOL_GROUPS = [
  {
    label: 'Работа с текстом',
    items: [
      { value: 'translator', icon: 'Languages', label: 'Переводчик' },
      { value: 'ocr', icon: 'ScanText', label: 'OCR сканер' },
      { value: 'notes', icon: 'StickyNote', label: 'Заметки' },
    ],
  },
  {
    label: 'Утилиты',
    items: [
      { value: 'qr', icon: 'QrCode', label: 'QR-коды' },
      { value: 'password', icon: 'Lock', label: 'Генератор паролей' },
      { value: 'weather', icon: 'CloudSun', label: 'Погода' },
    ],
  },
  {
    label: 'Калькуляторы',
    items: [
      { value: 'calc', icon: 'Calculator', label: 'Калькулятор' },
      { value: 'converter', icon: 'Ruler', label: 'Конвертер единиц' },
      { value: 'counter', icon: 'Hash', label: 'Счётчик' },
    ],
  },
  {
    label: 'Разное',
    items: [
      { value: 'timer', icon: 'Timer', label: 'Таймер' },
      { value: 'color', icon: 'Palette', label: 'Работа с цветом' },
      { value: 'random', icon: 'Sparkles', label: 'Случайное число' },
      { value: 'metronome', icon: 'Music', label: 'Метроном' },
    ],
  },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const handleToolSelect = (value: string) => {
    onTabChange(value);
    setIsToolsOpen(false);
  };

  const getCurrentTabLabel = () => {
    const mainTab = MAIN_TABS.find((t) => t.value === activeTab);
    if (mainTab) return mainTab.label;

    for (const group of TOOL_GROUPS) {
      const tool = group.items.find((t) => t.value === activeTab);
      if (tool) return tool.label;
    }
    return 'Инструменты';
  };

  const isToolActive = !MAIN_TABS.some((t) => t.value === activeTab);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="inline-flex bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-1 rounded-xl shadow-lg text-xs gap-1">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`flex items-center flex-shrink-0 rounded-lg px-3 py-2 whitespace-nowrap transition-all ${
              activeTab === tab.value
                ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                : 'hover:bg-gray-100'
            }`}
          >
            <Icon name={tab.icon as any} size={14} className="mr-1.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}

        <DropdownMenu open={isToolsOpen} onOpenChange={setIsToolsOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center flex-shrink-0 rounded-lg px-3 py-2 whitespace-nowrap transition-all ${
                isToolActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Icon name="Wrench" size={14} className="mr-1.5" />
              <span className="hidden sm:inline">{getCurrentTabLabel()}</span>
              <Icon name="ChevronDown" size={14} className="ml-1" />
            </button>
          </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 max-h-[70vh] overflow-y-auto">
          {TOOL_GROUPS.map((group, groupIndex) => (
            <div key={group.label}>
              {groupIndex > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {group.label}
              </DropdownMenuLabel>
              {group.items.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => handleToolSelect(item.value)}
                  className="cursor-pointer"
                >
                  <Icon name={item.icon as any} size={16} className="mr-2" />
                  {item.label}
                  {activeTab === item.value && (
                    <Icon name="Check" size={16} className="ml-auto text-blue-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}