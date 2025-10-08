import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';

interface PromptTemplate {
  id: string;
  name: string;
  icon: string;
  prompt: string;
  category: string;
}

const TEMPLATES: PromptTemplate[] = [
  {
    id: 'write-article',
    name: 'Написать статью',
    icon: 'FileText',
    prompt: 'Напиши подробную статью на тему: [тема]. Включи введение, основную часть с подзаголовками и заключение.',
    category: 'Текст'
  },
  {
    id: 'check-grammar',
    name: 'Проверить грамматику',
    icon: 'CheckCircle',
    prompt: 'Проверь текст на грамматические и орфографические ошибки. Исправь их и объясни найденные ошибки.',
    category: 'Текст'
  },
  {
    id: 'summarize',
    name: 'Сделать краткое резюме',
    icon: 'Minimize2',
    prompt: 'Прочитай текст и составь краткое резюме основных идей. Выдели ключевые моменты списком.',
    category: 'Текст'
  },
  {
    id: 'translate',
    name: 'Перевести текст',
    icon: 'Languages',
    prompt: 'Переведи следующий текст на [язык]. Сохрани стиль и тон оригинала.',
    category: 'Текст'
  },
  {
    id: 'explain-code',
    name: 'Объяснить код',
    icon: 'Code',
    prompt: 'Объясни что делает этот код построчно. Укажи назначение функций и логику работы.',
    category: 'Код'
  },
  {
    id: 'debug-code',
    name: 'Найти ошибки в коде',
    icon: 'Bug',
    prompt: 'Проанализируй код на ошибки и проблемы. Предложи исправления с объяснениями.',
    category: 'Код'
  },
  {
    id: 'optimize-code',
    name: 'Оптимизировать код',
    icon: 'Zap',
    prompt: 'Проанализируй код и предложи оптимизации для улучшения производительности и читаемости.',
    category: 'Код'
  },
  {
    id: 'brainstorm',
    name: 'Сгенерировать идеи',
    icon: 'Lightbulb',
    prompt: 'Помоги провести мозговой штурм и предложи 10 креативных идей для: [тема]',
    category: 'Творчество'
  },
  {
    id: 'write-email',
    name: 'Написать письмо',
    icon: 'Mail',
    prompt: 'Напиши профессиональное деловое письмо на тему: [тема]. Используй вежливый и официальный тон.',
    category: 'Бизнес'
  },
  {
    id: 'plan-project',
    name: 'План проекта',
    icon: 'ListChecks',
    prompt: 'Создай детальный план проекта для: [описание]. Включи этапы, сроки и ресурсы.',
    category: 'Бизнес'
  },
];

interface PromptTemplatesButtonProps {
  onTemplateSelect: (template: string) => void;
}

export default function PromptTemplatesButton({ onTemplateSelect }: PromptTemplatesButtonProps) {
  const categories = Array.from(new Set(TEMPLATES.map(t => t.category)));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Icon name="Sparkles" size={16} />
          Шаблоны
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Icon name="Library" size={16} />
          Готовые шаблоны промптов
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {categories.map((category) => (
          <div key={category}>
            <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
              {category}
            </DropdownMenuLabel>
            {TEMPLATES
              .filter(t => t.category === category)
              .map((template) => (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => onTemplateSelect(template.prompt)}
                  className="cursor-pointer"
                >
                  <Icon name={template.icon as any} size={16} className="mr-2" />
                  {template.name}
                </DropdownMenuItem>
              ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
