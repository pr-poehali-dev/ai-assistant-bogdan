import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function TabNavigation() {
  return (
    <TabsList className="flex w-full bg-white/80 backdrop-blur-sm p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-lg mb-2 sm:mb-3 max-w-full mx-auto text-[10px] sm:text-xs overflow-x-auto gap-0.5 sm:gap-1">
      <TabsTrigger value="chat" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="MessageSquare" size={12} className="sm:mr-1.5" />
        <span className="hidden sm:inline">Чат</span>
      </TabsTrigger>
      <TabsTrigger value="assistants" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="Users" size={12} className="sm:mr-1.5" />
        <span className="hidden sm:inline">Ассистенты</span>
      </TabsTrigger>
      <TabsTrigger value="knowledge" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="BookOpen" size={12} className="sm:mr-1.5" />
        <span className="hidden sm:inline">База знаний</span>
      </TabsTrigger>
      <TabsTrigger value="translator" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="Languages" size={12} className="sm:mr-1.5" />
        <span className="hidden sm:inline">Переводчик</span>
      </TabsTrigger>
      <TabsTrigger value="weather" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="CloudSun" size={12} className="sm:mr-1.5" />
        <span className="hidden sm:inline">Погода</span>
      </TabsTrigger>
      <TabsTrigger value="ocr" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="ScanText" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">OCR</span>
      </TabsTrigger>
      <TabsTrigger value="qr" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="QrCode" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">QR</span>
      </TabsTrigger>
      <TabsTrigger value="notes" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="StickyNote" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">Заметки</span>
      </TabsTrigger>
      <TabsTrigger value="password" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="Lock" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">Пароль</span>
      </TabsTrigger>
      <TabsTrigger value="calc" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="Calculator" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">Кальк.</span>
      </TabsTrigger>
      <TabsTrigger value="timer" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="Timer" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">Таймер</span>
      </TabsTrigger>
      <TabsTrigger value="converter" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="Ruler" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">Конверт.</span>
      </TabsTrigger>
      <TabsTrigger value="color" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="Palette" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">Цвета</span>
      </TabsTrigger>
      <TabsTrigger value="counter" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="Hash" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">Счёт</span>
      </TabsTrigger>
      <TabsTrigger value="random" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="Sparkles" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">Случай</span>
      </TabsTrigger>
      <TabsTrigger value="metronome" className="flex-shrink-0 rounded data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
        <Icon name="Music" size={12} className="sm:mr-1" />
        <span className="hidden sm:inline">Метроном</span>
      </TabsTrigger>
    </TabsList>
  );
}