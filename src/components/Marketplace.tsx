import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  price: string;
  rating: number;
  downloads: string;
  featured: boolean;
}

const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Генератор SEO-статей',
    description: 'Создает оптимизированные статьи для любой тематики',
    icon: 'FileSearch',
    color: 'from-blue-500 to-blue-600',
    category: 'Контент',
    price: 'Бесплатно',
    rating: 4.8,
    downloads: '12.5K',
    featured: true,
  },
  {
    id: '2',
    name: 'Email-маркетолог',
    description: 'Создает email-рассылки с высокой конверсией',
    icon: 'Mail',
    color: 'from-purple-500 to-purple-600',
    category: 'Маркетинг',
    price: '299₽/мес',
    rating: 4.9,
    downloads: '8.3K',
    featured: true,
  },
  {
    id: '3',
    name: 'Анализатор конкурентов',
    description: 'Исследует стратегии и контент конкурентов',
    icon: 'Target',
    color: 'from-green-500 to-green-600',
    category: 'Аналитика',
    price: '499₽/мес',
    rating: 4.7,
    downloads: '5.2K',
    featured: false,
  },
  {
    id: '4',
    name: 'Дизайн-ассистент',
    description: 'Генерирует идеи дизайна и цветовые палитры',
    icon: 'Palette',
    color: 'from-pink-500 to-pink-600',
    category: 'Дизайн',
    price: 'Бесплатно',
    rating: 4.6,
    downloads: '15.1K',
    featured: false,
  },
  {
    id: '5',
    name: 'Code Review Bot',
    description: 'Проверяет код на ошибки и предлагает улучшения',
    icon: 'Code',
    color: 'from-orange-500 to-orange-600',
    category: 'Разработка',
    price: '599₽/мес',
    rating: 4.9,
    downloads: '9.7K',
    featured: true,
  },
  {
    id: '6',
    name: 'Генератор презентаций',
    description: 'Создает слайды для бизнес-презентаций',
    icon: 'Presentation',
    color: 'from-cyan-500 to-cyan-600',
    category: 'Бизнес',
    price: '399₽/мес',
    rating: 4.5,
    downloads: '6.8K',
    featured: false,
  },
];

export default function Marketplace() {
  const [items, setItems] = useState(MARKETPLACE_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Контент', 'Маркетинг', 'Аналитика', 'Дизайн', 'Разработка', 'Бизнес'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredItems = filteredItems.filter(item => item.featured);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Маркетплейс</h2>
          <p className="text-slate-600 mt-1">Расширьте возможности с готовыми решениями</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Поиск решений..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <Icon name="Upload" size={18} className="mr-2" />
            Опубликовать
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
          >
            {category === 'all' ? 'Все' : category}
          </Button>
        ))}
      </div>

      {featuredItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Icon name="Star" size={20} className="text-yellow-500" />
            Рекомендуемые
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <Card
                key={item.id}
                className="p-6 border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    <Icon name={item.icon as any} size={28} className="text-white" />
                  </div>
                  <Badge className="bg-yellow-500">Топ</Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{item.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-yellow-500" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Download" size={14} className="text-slate-400" />
                    <span className="text-slate-600">{item.downloads}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">{item.price}</span>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    Установить
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800">Все решения</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {filteredItems.filter(item => !item.featured).map((item) => (
            <Card key={item.id} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <Icon name={item.icon as any} size={24} className="text-white" />
                </div>
                <Badge variant="secondary">{item.category}</Badge>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.name}</h3>
              <p className="text-slate-600 text-sm mb-4">{item.description}</p>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={14} className="text-yellow-500" />
                  <span className="font-semibold">{item.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Download" size={14} className="text-slate-400" />
                  <span className="text-slate-600">{item.downloads}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">{item.price}</span>
                <Button variant="outline">Подробнее</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center space-y-4">
          <Icon name="Rocket" size={48} className="text-orange-600 mx-auto" />
          <h3 className="text-2xl font-bold text-slate-800">Создайте свое решение</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Разработайте уникальный AI-инструмент и поделитесь им с сообществом. Зарабатывайте на своих решениях!
          </p>
          <Button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700">
            <Icon name="Plus" size={18} className="mr-2" />
            Начать разработку
          </Button>
        </div>
      </Card>
    </div>
  );
}
