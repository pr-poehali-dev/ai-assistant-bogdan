import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import AIAssistants from '@/components/AIAssistants';
import KnowledgeBase from '@/components/KnowledgeBase';
import Translator from '@/components/Translator';
import Weather from '@/components/Weather';
import OCRScanner from '@/components/OCRScanner';
import QRGenerator from '@/components/QRGenerator';
import NotesApp from '@/components/NotesApp';
import PasswordGenerator from '@/components/PasswordGenerator';
import Calculator from '@/components/Calculator';
import TimerApp from '@/components/TimerApp';
import UnitConverter from '@/components/UnitConverter';
import ColorPicker from '@/components/ColorPicker';
import Counter from '@/components/Counter';
import RandomGenerator from '@/components/RandomGenerator';
import Metronome from '@/components/Metronome';

interface AllTabsContentProps {
  messagesCount: number;
  sessionsCount: number;
}

export default function AllTabsContent({ messagesCount, sessionsCount }: AllTabsContentProps) {
  return (
    <>
      <TabsContent value="assistants" className="mt-0">
        <AIAssistants />
      </TabsContent>

      <TabsContent value="knowledge" className="mt-0">
        <KnowledgeBase />
      </TabsContent>

      <TabsContent value="translator" className="mt-0">
        <Translator />
      </TabsContent>

      <TabsContent value="weather" className="mt-0">
        <Weather />
      </TabsContent>

      <TabsContent value="ocr" className="mt-0">
        <OCRScanner />
      </TabsContent>

      <TabsContent value="qr" className="mt-0">
        <QRGenerator />
      </TabsContent>

      <TabsContent value="notes" className="mt-0">
        <NotesApp />
      </TabsContent>

      <TabsContent value="password" className="mt-0">
        <PasswordGenerator />
      </TabsContent>

      <TabsContent value="calc" className="mt-0">
        <Calculator />
      </TabsContent>

      <TabsContent value="timer" className="mt-0">
        <TimerApp />
      </TabsContent>

      <TabsContent value="converter" className="mt-0">
        <UnitConverter />
      </TabsContent>

      <TabsContent value="color" className="mt-0">
        <ColorPicker />
      </TabsContent>

      <TabsContent value="counter" className="mt-0">
        <Counter />
      </TabsContent>

      <TabsContent value="random" className="mt-0">
        <RandomGenerator />
      </TabsContent>

      <TabsContent value="metronome" className="mt-0">
        <Metronome />
      </TabsContent>

      <TabsContent value="analytics" className="mt-0">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center space-y-4">
            <Icon name="BarChart3" size={64} className="text-blue-600 mx-auto" />
            <h2 className="text-3xl font-bold text-slate-800">Аналитика</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Детальная статистика использования, анализ эффективности запросов и персональные рекомендации
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                <Icon name="Activity" size={32} className="text-blue-600 mb-3" />
                <h3 className="font-bold text-xl text-slate-800 mb-2">Активность</h3>
                <p className="text-3xl font-bold text-blue-600">{messagesCount}</p>
                <p className="text-sm text-slate-600 mt-1">Всего сообщений</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                <Icon name="Clock" size={32} className="text-purple-600 mb-3" />
                <h3 className="font-bold text-xl text-slate-800 mb-2">Сессии</h3>
                <p className="text-3xl font-bold text-purple-600">{sessionsCount}</p>
                <p className="text-sm text-slate-600 mt-1">Всего диалогов</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-0">
                <Icon name="TrendingUp" size={32} className="text-green-600 mb-3" />
                <h3 className="font-bold text-xl text-slate-800 mb-2">Эффективность</h3>
                <p className="text-3xl font-bold text-green-600">98%</p>
                <p className="text-sm text-slate-600 mt-1">Успешных ответов</p>
              </Card>
            </div>
          </div>
        </Card>
      </TabsContent>
    </>
  );
}
