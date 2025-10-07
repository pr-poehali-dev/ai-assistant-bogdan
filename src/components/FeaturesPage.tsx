import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function FeaturesPage() {
  const features = [
    {
      icon: 'MessageSquare',
      title: 'Умный помощник',
      description: 'Интеллектуальная система с несколькими режимами работы и автоматическим резервированием',
      color: 'from-blue-500 to-blue-600',
      tags: ['Режим Скорость', 'Режим Точность', 'Режим Креатив'],
    },
    {
      icon: 'Mic',
      title: 'Голосовой ввод',
      description: 'Говорите вместо печати — система распознает вашу речь и конвертирует в текст',
      color: 'from-purple-500 to-purple-600',
      tags: ['Web Speech API', 'Русский язык'],
    },
    {
      icon: 'Volume2',
      title: 'Озвучивание ответов',
      description: 'Слушайте ответы помощника с помощью встроенного синтезатора речи',
      color: 'from-green-500 to-green-600',
      tags: ['TTS', 'Натуральный голос'],
    },
    {
      icon: 'History',
      title: 'Память диалога',
      description: 'Помощник запоминает контекст разговора для более точных и релевантных ответов',
      color: 'from-orange-500 to-orange-600',
      tags: ['Контекст', 'История'],
    },
    {
      icon: 'Sliders',
      title: 'Гибкие настройки',
      description: 'Настройте температуру, длину ответов и системные промпты под свои задачи',
      color: 'from-pink-500 to-pink-600',
      tags: ['Температура', 'Токены', 'Промпты'],
    },
    {
      icon: 'Download',
      title: 'Экспорт чата',
      description: 'Сохраняйте историю переписки в текстовые файлы для дальнейшего использования',
      color: 'from-cyan-500 to-cyan-600',
      tags: ['Export', 'TXT'],
    },
    {
      icon: 'BarChart3',
      title: 'Статистика',
      description: 'Отслеживайте использование каждого режима и оптимизируйте свои запросы',
      color: 'from-yellow-500 to-yellow-600',
      tags: ['Аналитика', 'Метрики'],
    },
    {
      icon: 'Lock',
      title: 'Приватность',
      description: 'Все данные хранятся локально, API ключи никогда не покидают ваш браузер',
      color: 'from-red-500 to-red-600',
      tags: ['Безопасность', 'LocalStorage'],
    },
    {
      icon: 'Zap',
      title: 'Авто-резервирование',
      description: 'Если один режим недоступен, система автоматически переключится на другой',
      color: 'from-indigo-500 to-indigo-600',
      tags: ['Fallback', 'Надежность'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Возможности платформы
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Всё, что нужно для продуктивной работы с искусственным интеллектом
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-2xl transition-all border-0 hover:scale-105 duration-300"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
            >
              <Icon name={feature.icon as any} size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
            <p className="text-slate-600 mb-4">{feature.description}</p>
            <div className="flex flex-wrap gap-2">
              {feature.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <Icon name="Rocket" size={48} className="text-blue-600 mx-auto" />
          <h2 className="text-3xl font-bold text-slate-800">Готовы начать?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Настройте свои API ключи в панели управления и начните использовать все возможности
            Богдана прямо сейчас
          </p>
        </div>
      </Card>
    </div>
  );
}