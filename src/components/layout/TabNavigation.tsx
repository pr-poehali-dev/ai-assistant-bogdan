import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function TabNavigation() {
  return (
    <TabsList className="flex w-full bg-white/90 backdrop-blur-sm p-1 rounded-xl shadow-lg mb-3 max-w-full mx-auto text-xs overflow-x-auto gap-1 scrollbar-hide">
      <TabsTrigger value="chat" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="MessageSquare" size={14} className="mr-1.5" />
        Чат
      </TabsTrigger>
      <TabsTrigger value="assistants" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="Users" size={14} className="mr-1.5" />
        Ассистенты
      </TabsTrigger>
      <TabsTrigger value="knowledge" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="BookOpen" size={14} className="mr-1.5" />
        База знаний
      </TabsTrigger>
      <TabsTrigger value="translator" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="Languages" size={14} className="mr-1.5" />
        Переводчик
      </TabsTrigger>
      <TabsTrigger value="weather" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="CloudSun" size={14} className="mr-1.5" />
        Погода
      </TabsTrigger>
      <TabsTrigger value="ocr" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="ScanText" size={14} className="mr-1" />
        OCR
      </TabsTrigger>
      <TabsTrigger value="qr" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="QrCode" size={14} className="mr-1" />
        QR
      </TabsTrigger>
      <TabsTrigger value="notes" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="StickyNote" size={14} className="mr-1" />
        Заметки
      </TabsTrigger>
      <TabsTrigger value="password" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="Lock" size={14} className="mr-1" />
        Пароль
      </TabsTrigger>
      <TabsTrigger value="calc" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="Calculator" size={14} className="mr-1" />
        Кальк.
      </TabsTrigger>
      <TabsTrigger value="timer" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="Timer" size={14} className="mr-1" />
        Таймер
      </TabsTrigger>
      <TabsTrigger value="converter" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="Ruler" size={14} className="mr-1" />
        Конверт.
      </TabsTrigger>
      <TabsTrigger value="color" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="Palette" size={14} className="mr-1" />
        Цвета
      </TabsTrigger>
      <TabsTrigger value="counter" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="Hash" size={14} className="mr-1" />
        Счёт
      </TabsTrigger>
      <TabsTrigger value="random" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="Sparkles" size={14} className="mr-1" />
        Случай
      </TabsTrigger>
      <TabsTrigger value="metronome" className="flex-shrink-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2 whitespace-nowrap transition-all">
        <Icon name="Music" size={14} className="mr-1" />
        Метроном
      </TabsTrigger>
    </TabsList>
  );
}