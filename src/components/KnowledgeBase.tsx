import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  category: string;
  icon: string;
  color: string;
}

const DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Руководство по продукту',
    type: 'PDF',
    size: '2.4 MB',
    date: '2025-10-05',
    category: 'Документация',
    icon: 'FileText',
    color: 'text-red-600',
  },
  {
    id: '2',
    title: 'База клиентов 2024',
    type: 'XLSX',
    size: '1.8 MB',
    date: '2025-10-03',
    category: 'Данные',
    icon: 'Table',
    color: 'text-green-600',
  },
  {
    id: '3',
    title: 'Презентация для инвесторов',
    type: 'PPTX',
    size: '5.2 MB',
    date: '2025-10-01',
    category: 'Презентации',
    icon: 'Presentation',
    color: 'text-orange-600',
  },
  {
    id: '4',
    title: 'Корпоративная политика',
    type: 'DOCX',
    size: '890 KB',
    date: '2025-09-28',
    category: 'Документация',
    icon: 'FileText',
    color: 'text-blue-600',
  },
];

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState(DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">База знаний</h2>
          <p className="text-slate-600 mt-1">Загружайте документы для анализа и поиска информации</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Поиск документов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Icon name="Upload" size={18} className="mr-2" />
            Загрузить
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-white/80 p-1.5 rounded-xl shadow">
          <TabsTrigger value="all" className="rounded-lg">
            <Icon name="Folder" size={16} className="mr-2" />
            Все документы
          </TabsTrigger>
          <TabsTrigger value="recent" className="rounded-lg">
            <Icon name="Clock" size={16} className="mr-2" />
            Недавние
          </TabsTrigger>
          <TabsTrigger value="favorites" className="rounded-lg">
            <Icon name="Star" size={16} className="mr-2" />
            Избранное
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <Card key={doc.id} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon name={doc.icon as any} size={24} className={doc.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 mb-1 truncate">{doc.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{new Date(doc.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Icon name="Eye" size={14} className="mr-1" />
                        Просмотр
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Icon name="MessageSquare" size={14} className="mr-1" />
                        Анализ
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Icon name="MoreVertical" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <Card className="p-12 text-center border-0 shadow-lg">
            <Icon name="Clock" size={48} className="text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Недавно открытых документов пока нет</p>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <Card className="p-12 text-center border-0 shadow-lg">
            <Icon name="Star" size={48} className="text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Добавьте документы в избранное</p>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <Icon name="FileText" size={32} className="text-blue-600 mb-3" />
          <h3 className="font-bold text-xl text-slate-800 mb-2">Умный поиск</h3>
          <p className="text-slate-600 text-sm">
            Находите нужную информацию в документах на естественном языке
          </p>
        </Card>
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <Icon name="Brain" size={32} className="text-purple-600 mb-3" />
          <h3 className="font-bold text-xl text-slate-800 mb-2">Анализ контента</h3>
          <p className="text-slate-600 text-sm">
            Автоматическое извлечение ключевых идей и суммаризация
          </p>
        </Card>
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <Icon name="Link" size={32} className="text-green-600 mb-3" />
          <h3 className="font-bold text-xl text-slate-800 mb-2">Связи между данными</h3>
          <p className="text-slate-600 text-sm">
            Выявление связей между разными документами и источниками
          </p>
        </Card>
      </div>
    </div>
  );
}
