import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

interface Assistant {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  skills: string[];
  active: boolean;
}

const ASSISTANTS: Assistant[] = [
  { id: '1', name: 'Аналитик данных', description: 'Анализирует большие данные, строит отчеты и прогнозы', icon: 'BarChart3', color: 'from-blue-500 to-blue-600', category: 'Аналитика', skills: ['SQL', 'Python', 'Визуализация', 'Прогнозирование'], active: true },
  { id: '2', name: 'SEO-копирайтер', description: 'Создает оптимизированный контент для поисковых систем', icon: 'FileSearch', color: 'from-purple-500 to-purple-600', category: 'Маркетинг', skills: ['SEO', 'Ключевые слова', 'Метатеги', 'Контент-план'], active: true },
  { id: '3', name: 'Full-stack разработчик', description: 'Пишет код на Python, JavaScript, TypeScript, Go', icon: 'Code', color: 'from-green-500 to-green-600', category: 'Разработка', skills: ['React', 'Node.js', 'PostgreSQL', 'REST API'], active: false },
  { id: '4', name: 'UI/UX дизайнер', description: 'Создает интерфейсы, прототипы и дизайн-системы', icon: 'Palette', color: 'from-pink-500 to-pink-600', category: 'Дизайн', skills: ['Figma', 'Прототипы', 'Юзабилити', 'Брендинг'], active: false },
  { id: '5', name: 'Преподаватель', description: 'Объясняет сложные темы на понятном языке с примерами', icon: 'GraduationCap', color: 'from-orange-500 to-orange-600', category: 'Образование', skills: ['Математика', 'Физика', 'Программирование', 'Языки'], active: true },
  { id: '6', name: 'Полиглот-переводчик', description: 'Переводит на 100+ языков с учетом контекста', icon: 'Languages', color: 'from-cyan-500 to-cyan-600', category: 'Языки', skills: ['Английский', 'Китайский', 'Арабский', 'Немецкий'], active: false },
  { id: '7', name: 'Email-маркетолог', description: 'Создает эффективные email-кампании и рассылки', icon: 'Mail', color: 'from-red-500 to-red-600', category: 'Маркетинг', skills: ['A/B тесты', 'Автоворонки', 'Сегментация', 'Конверсия'], active: false },
  { id: '8', name: 'DevOps-инженер', description: 'Настраивает CI/CD, Docker, Kubernetes', icon: 'Cloud', color: 'from-indigo-500 to-indigo-600', category: 'DevOps', skills: ['Docker', 'K8s', 'GitLab CI', 'Terraform'], active: false },
  { id: '9', name: 'Специалист по безопасности', description: 'Находит уязвимости и защищает от атак', icon: 'Shield', color: 'from-red-600 to-red-700', category: 'Безопасность', skills: ['Пентест', 'OWASP', 'Криптография', 'Аудит'], active: false },
  { id: '10', name: 'Сценарист', description: 'Пишет сценарии для видео, подкастов, презентаций', icon: 'Video', color: 'from-yellow-500 to-yellow-600', category: 'Креатив', skills: ['Сторителлинг', 'Диалоги', 'YouTube', 'TikTok'], active: false },
  { id: '11', name: 'HR-менеджер', description: 'Создает вакансии, проводит интервью, оценивает кандидатов', icon: 'Users', color: 'from-teal-500 to-teal-600', category: 'HR', skills: ['Вакансии', 'Интервью', 'Оценка', 'Онбординг'], active: false },
  { id: '12', name: 'Финансовый аналитик', description: 'Анализирует финансы, составляет отчеты и прогнозы', icon: 'DollarSign', color: 'from-emerald-500 to-emerald-600', category: 'Финансы', skills: ['P&L', 'Cash Flow', 'Бюджет', 'Инвестиции'], active: false },
  { id: '13', name: 'SMM-менеджер', description: 'Создает контент для соцсетей и ведет аккаунты', icon: 'Share2', color: 'from-pink-400 to-pink-500', category: 'Соцсети', skills: ['Instagram', 'TikTok', 'ВКонтакте', 'Telegram'], active: false },
  { id: '14', name: 'Продуктовый менеджер', description: 'Разрабатывает продуктовую стратегию и roadmap', icon: 'Rocket', color: 'from-violet-500 to-violet-600', category: 'Продукт', skills: ['User Stories', 'Roadmap', 'Метрики', 'A/B тесты'], active: false },
  { id: '15', name: 'Научный исследователь', description: 'Помогает в написании научных работ и статей', icon: 'Microscope', color: 'from-blue-600 to-blue-700', category: 'Наука', skills: ['Методология', 'Статистика', 'Публикации', 'Рецензии'], active: false },
  { id: '16', name: 'Музыкальный продюсер', description: 'Пишет тексты песен, аккорды, музыкальные идеи', icon: 'Music', color: 'from-purple-400 to-purple-500', category: 'Музыка', skills: ['Тексты', 'Аккорды', 'Аранжировки', 'Жанры'], active: false },
  { id: '17', name: 'Game Designer', description: 'Создает концепции игр, механики и балансировку', icon: 'Gamepad2', color: 'from-red-400 to-red-500', category: 'Геймдев', skills: ['Механики', 'Баланс', 'Сюжет', 'Монетизация'], active: false },
  { id: '18', name: 'Юрист-консультант', description: 'Консультирует по правовым вопросам и договорам', icon: 'Scale', color: 'from-slate-600 to-slate-700', category: 'Юриспруденция', skills: ['Договоры', 'ГК РФ', 'Споры', 'Консультации'], active: false },
];

export default function AIAssistants() {
  const [assistants, setAssistants] = useState(ASSISTANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleAssistant = (id: string) => {
    setAssistants(prev => prev.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
  };

  const categories = ['all', ...Array.from(new Set(assistants.map(a => a.category)))];

  const filteredAssistants = assistants.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">AI Ассистенты</h2>
          <p className="text-slate-600 mt-1">18 специализированных помощников для любых задач</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Поиск ассистентов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            <Icon name="Plus" size={18} className="mr-2" />
            Создать своего
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
            size="sm"
          >
            {category === 'all' ? 'Все' : category}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredAssistants.map((assistant) => (
          <Card
            key={assistant.id}
            className={`p-6 border-0 shadow-lg transition-all hover:shadow-xl ${
              assistant.active ? 'bg-white' : 'bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${assistant.color} flex items-center justify-center shadow-lg`}>
                <Icon name={assistant.icon as any} size={28} className="text-white" />
              </div>
              <Badge variant={assistant.active ? 'default' : 'secondary'}>
                {assistant.active ? 'Активен' : 'Неактивен'}
              </Badge>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">{assistant.name}</h3>
            <p className="text-slate-600 text-sm mb-4">{assistant.description}</p>

            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 mb-2">Навыки:</p>
              <div className="flex flex-wrap gap-2">
                {assistant.skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={assistant.active ? 'destructive' : 'default'}
                className="flex-1"
                onClick={() => toggleAssistant(assistant.id)}
              >
                {assistant.active ? 'Деактивировать' : 'Активировать'}
              </Button>
              <Button variant="outline" size="icon">
                <Icon name="Settings" size={18} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <Icon name="Sparkles" size={48} className="text-blue-600 mx-auto" />
          <h3 className="text-2xl font-bold text-slate-800">Создайте своего ассистента</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Настройте уникального AI-помощника под свои задачи с индивидуальными навыками и стилем общения
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Icon name="Plus" size={18} className="mr-2" />
            Создать ассистента
          </Button>
        </div>
      </Card>
    </div>
  );
}