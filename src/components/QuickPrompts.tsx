import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const QUICK_PROMPTS = [
  { icon: 'MessageCircle', title: 'Общение', description: 'Задавайте вопросы, получайте умные ответы' },
  { icon: 'FileText', title: 'Создание текстов', description: 'Статьи, письма, посты для соцсетей' },
  { icon: 'Search', title: 'Анализ данных', description: 'Обработка информации, выводы' },
  { icon: 'GraduationCap', title: 'Обучение', description: 'Объяснения, решение задач' },
  { icon: 'Lightbulb', title: 'Идеи и советы', description: 'Генерация идей, рекомендации' },
  { icon: 'Globe', title: 'Переводы', description: 'Перевод на любые языки' },
  { icon: 'BarChart', title: 'Резюме', description: 'Краткое изложение длинных текстов' },
  { icon: 'Palette', title: 'Креатив', description: 'Истории, стихи, сценарии' },
];

export default function QuickPrompts({ onSelectPrompt }: QuickPromptsProps) {
  return (
    <Card className="p-4 shadow-xl border-0 bg-white/10 backdrop-blur-sm">
      
      <div className="grid grid-cols-2 gap-3">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 cursor-pointer hover:from-slate-700 hover:to-slate-600 transition-all shadow-lg hover:shadow-xl"
            onClick={() => onSelectPrompt(prompt.title)}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Icon name={prompt.icon as any} size={24} className="text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{prompt.title}</h4>
                <p className="text-xs text-white/70">{prompt.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}