import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const QUICK_PROMPTS = [
  { icon: 'Code', text: 'Напиши код для...', category: 'Программирование' },
  { icon: 'FileText', text: 'Объясни простыми словами...', category: 'Обучение' },
  { icon: 'Lightbulb', text: 'Дай идеи для...', category: 'Креатив' },
  { icon: 'Mail', text: 'Напиши письмо о...', category: 'Письма' },
  { icon: 'Briefcase', text: 'Создай бизнес-план...', category: 'Бизнес' },
  { icon: 'BookOpen', text: 'Расскажи о...', category: 'Знания' },
  { icon: 'Search', text: 'Найди информацию о...', category: 'Поиск' },
  { icon: 'Calculator', text: 'Реши задачу...', category: 'Математика' },
  { icon: 'Languages', text: 'Переведи на...', category: 'Перевод' },
  { icon: 'PenTool', text: 'Напиши статью про...', category: 'Контент' },
  { icon: 'Users', text: 'Дай совет по...', category: 'Консультация' },
  { icon: 'Rocket', text: 'Оптимизируй...', category: 'Улучшение' },
];

export default function QuickPrompts({ onSelectPrompt }: QuickPromptsProps) {
  return (
    <Card className="p-4 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Zap" size={18} className="text-yellow-600" />
        <h3 className="font-bold text-slate-800 text-sm">Быстрые промпты</h3>
      </div>
      
      <ScrollArea className="h-[400px] pr-2">
        <div className="grid grid-cols-1 gap-2">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="justify-start h-auto py-3 px-3 hover:bg-blue-50 hover:border-blue-300 transition-all"
              onClick={() => onSelectPrompt(prompt.text)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Icon name={prompt.icon as any} size={14} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-700">{prompt.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{prompt.category}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
