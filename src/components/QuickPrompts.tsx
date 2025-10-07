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
    <div className="grid grid-cols-1 gap-2">
      {QUICK_PROMPTS.map((prompt, idx) => (
        <button
          key={idx}
          className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100 cursor-pointer transition-all border border-slate-200 hover:border-blue-300 text-left group"
          onClick={() => onSelectPrompt(prompt.title)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Icon name={prompt.icon as any} size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-800 mb-0.5">{prompt.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-1">{prompt.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}