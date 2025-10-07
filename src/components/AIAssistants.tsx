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
  {
    id: '1',
    name: 'Аналитик',
    description: 'Анализирует данные, строит отчеты и выявляет тренды',
    icon: 'BarChart3',
    color: 'from-blue-500 to-blue-600',
    category: 'Бизнес',
    skills: ['Анализ данных', 'Визуализация', 'Прогнозирование'],
    active: true,
  },
  {
    id: '2',
    name: 'Копирайтер',
    description: 'Создает тексты для маркетинга и соцсетей',
    icon: 'PenTool',
    color: 'from-purple-500 to-purple-600',
    category: 'Контент',
    skills: ['SEO-тексты', 'Посты', 'Рекламные тексты'],
    active: true,
  },
  {
    id: '3',
    name: 'Программист',
    description: 'Пишет и отлаживает код на разных языках',
    icon: 'Code',
    color: 'from-green-500 to-green-600',
    category: 'Разработка',
    skills: ['Python', 'JavaScript', 'Debugging'],
    active: false,
  },
  {
    id: '4',
    name: 'Дизайнер',
    description: 'Генерирует идеи для дизайна и брендинга',
    icon: 'Palette',
    color: 'from-pink-500 to-pink-600',
    category: 'Креатив',
    skills: ['UI/UX', 'Брендинг', 'Цветовые схемы'],
    active: false,
  },
  {
    id: '5',
    name: 'Учитель',
    description: 'Объясняет сложные темы простым языком',
    icon: 'GraduationCap',
    color: 'from-orange-500 to-orange-600',
    category: 'Образование',
    skills: ['Математика', 'Физика', 'История'],
    active: true,
  },
  {
    id: '6',
    name: 'Переводчик',
    description: 'Переводит тексты на 50+ языков',
    icon: 'Languages',
    color: 'from-cyan-500 to-cyan-600',
    category: 'Языки',
    skills: ['Английский', 'Немецкий', 'Китайский'],
    active: false,
  },
];

export default function AIAssistants() {
  const [assistants, setAssistants] = useState(ASSISTANTS);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAssistant = (id: string) => {
    setAssistants(prev => prev.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
  };

  const filteredAssistants = assistants.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">AI Ассистенты</h2>
          <p className="text-slate-600 mt-1">Специализированные помощники для разных задач</p>
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
