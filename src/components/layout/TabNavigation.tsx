import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function TabNavigation() {
  return (
    <TabsList className="grid w-full grid-cols-8 lg:grid-cols-16 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-lg mb-3 max-w-full mx-auto text-xs overflow-x-auto">
      <TabsTrigger value="chat" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-xs">
        <Icon name="MessageSquare" size={14} className="mr-1.5" />
        Чат
      </TabsTrigger>
      <TabsTrigger value="assistants" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs">
        <Icon name="Users" size={14} className="mr-1.5" />
        Ассистенты
      </TabsTrigger>
      <TabsTrigger value="knowledge" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white text-xs">
        <Icon name="BookOpen" size={14} className="mr-1.5" />
        База знаний
      </TabsTrigger>
      <TabsTrigger value="translator" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs">
        <Icon name="Languages" size={14} className="mr-1.5" />
        Переводчик
      </TabsTrigger>
      <TabsTrigger value="weather" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-xs">
        <Icon name="CloudSun" size={14} className="mr-1.5" />
        Погода
      </TabsTrigger>
      <TabsTrigger value="ocr" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white">
        <Icon name="ScanText" size={14} className="mr-1" />
        OCR
      </TabsTrigger>
      <TabsTrigger value="qr" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
        <Icon name="QrCode" size={14} className="mr-1" />
        QR
      </TabsTrigger>
      <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-600 data-[state=active]:text-white">
        <Icon name="StickyNote" size={14} className="mr-1" />
        Заметки
      </TabsTrigger>
      <TabsTrigger value="password" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
        <Icon name="Lock" size={14} className="mr-1" />
        Пароль
      </TabsTrigger>
      <TabsTrigger value="calc" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
        <Icon name="Calculator" size={14} className="mr-1" />
        Кальк.
      </TabsTrigger>
      <TabsTrigger value="timer" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
        <Icon name="Timer" size={14} className="mr-1" />
        Таймер
      </TabsTrigger>
      <TabsTrigger value="converter" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
        <Icon name="Ruler" size={14} className="mr-1" />
        Конверт.
      </TabsTrigger>
      <TabsTrigger value="color" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
        <Icon name="Palette" size={14} className="mr-1" />
        Цвета
      </TabsTrigger>
      <TabsTrigger value="counter" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
        <Icon name="Hash" size={14} className="mr-1" />
        Счёт
      </TabsTrigger>
      <TabsTrigger value="random" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white">
        <Icon name="Sparkles" size={14} className="mr-1" />
        Случай
      </TabsTrigger>
      <TabsTrigger value="metronome" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
        <Icon name="Music" size={14} className="mr-1" />
        Метроном
      </TabsTrigger>
    </TabsList>
  );
}
