import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl">
              <Icon name="Brain" size={48} className="text-white" />
            </div>
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          О проекте Богдан
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Персональный помощник нового поколения с несколькими режимами работы
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-xl transition-all border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
            <Icon name="Zap" size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Быстро</h3>
          <p className="text-slate-600">
            Мгновенные ответы благодаря оптимизированной архитектуре и умным алгоритмам
          </p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-all border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
            <Icon name="Shield" size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Безопасно</h3>
          <p className="text-slate-600">
            Ваши данные защищены. Все API ключи хранятся локально в вашем браузере
          </p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-all border-0 bg-gradient-to-br from-green-50 to-green-100">
          <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-4">
            <Icon name="Globe" size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Бесплатно</h3>
          <p className="text-slate-600">
            Используйте помощника без ограничений и скрытых платежей
          </p>
        </Card>
      </div>

      <Card className="p-8 border-0 shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Наша миссия</h2>
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p className="text-lg">
            Богдан — это платформа, которая делает искусственный интеллект доступным для всех.
            Мы создали интуитивный интерфейс с несколькими режимами работы, чтобы вы могли получить максимум
            от современных технологий.
          </p>
          <p className="text-lg">
            Наша цель — создать персонального помощника, который понимает контекст, запоминает
            историю общения и всегда готов помочь с любой задачей — от написания кода до
            креативного мышления.
          </p>
        </div>
      </Card>

      <Card className="p-8 border-0 shadow-2xl bg-gradient-to-br from-slate-50 to-blue-50">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Технологии</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <Icon name="Cpu" size={20} className="text-blue-600" />
              Режимы работы
            </h3>
            <div className="space-y-2">
              <Badge className="bg-blue-500">Режим Скорость</Badge>
              <Badge className="bg-purple-500 ml-2">Режим Точность</Badge>
              <Badge className="bg-green-500 ml-2">Режим Креатив</Badge>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <Icon name="Code" size={20} className="text-blue-600" />
              Стек технологий
            </h3>
            <div className="space-y-2">
              <Badge variant="outline">React + TypeScript</Badge>
              <Badge variant="outline" className="ml-2">Python Backend</Badge>
              <Badge variant="outline" className="ml-2">Web Speech API</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}