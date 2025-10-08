import Icon from '@/components/ui/icon';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const QUICK_PROMPTS = [
  { icon: 'MessageCircle', title: 'Общение', description: 'Диалог, вопросы и ответы' },
  { icon: 'FileText', title: 'Тексты', description: 'Статьи, посты, письма' },
  { icon: 'Code', title: 'Код', description: 'Программирование на любом языке' },
  { icon: 'Search', title: 'Анализ', description: 'Обработка и структурирование данных' },
  { icon: 'GraduationCap', title: 'Обучение', description: 'Объяснения сложных тем' },
  { icon: 'Lightbulb', title: 'Идеи', description: 'Генерация креативных решений' },
  { icon: 'Globe', title: 'Перевод', description: 'Перевод на 100+ языков' },
  { icon: 'BarChart', title: 'Резюме', description: 'Краткое изложение текстов' },
  { icon: 'Palette', title: 'Креатив', description: 'Стихи, сценарии, истории' },
  { icon: 'Mail', title: 'Email', description: 'Деловая и личная переписка' },
  { icon: 'Briefcase', title: 'Бизнес', description: 'Планы, стратегии, отчеты' },
  { icon: 'BookOpen', title: 'Знания', description: 'Энциклопедические данные' },
  { icon: 'Calculator', title: 'Математика', description: 'Решение задач и формул' },
  { icon: 'Brain', title: 'Логика', description: 'Рассуждения и выводы' },
  { icon: 'Image', title: 'Описание', description: 'Анализ изображений' },
  { icon: 'Music', title: 'Музыка', description: 'Тексты песен, аккорды' },
  { icon: 'Video', title: 'Видео', description: 'Сценарии и монтаж' },
  { icon: 'ShoppingCart', title: 'Маркетинг', description: 'Рекламные кампании' },
  { icon: 'Target', title: 'SEO', description: 'Оптимизация контента' },
  { icon: 'TrendingUp', title: 'Аналитика', description: 'Метрики и KPI' },
  { icon: 'Users', title: 'HR', description: 'Вакансии, собеседования' },
  { icon: 'FileSearch', title: 'Исследования', description: 'Научные работы' },
  { icon: 'Newspaper', title: 'Новости', description: 'Пресс-релизы, статьи' },
  { icon: 'Headphones', title: 'Поддержка', description: 'Ответы клиентам' },
  { icon: 'Database', title: 'SQL', description: 'Запросы к базам данных' },
  { icon: 'GitBranch', title: 'Git', description: 'Коммиты, документация' },
  { icon: 'Terminal', title: 'CLI', description: 'Команды терминала' },
  { icon: 'Bug', title: 'Debugging', description: 'Поиск и исправление ошибок' },
  { icon: 'Shield', title: 'Безопасность', description: 'Аудит кода, уязвимости' },
  { icon: 'Zap', title: 'API', description: 'Интеграции и REST API' },
  { icon: 'Layers', title: 'Архитектура', description: 'Проектирование систем' },
  { icon: 'Settings', title: 'Конфиги', description: 'Настройка окружений' },
  { icon: 'Smartphone', title: 'Мобильные', description: 'iOS, Android разработка' },
  { icon: 'Globe2', title: 'Веб', description: 'Frontend и Backend' },
  { icon: 'Cloud', title: 'DevOps', description: 'CI/CD, Docker, K8s' },
  { icon: 'Lock', title: 'Криптография', description: 'Шифрование данных' },
];

export default function QuickPrompts({ onSelectPrompt }: QuickPromptsProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5 max-h-[calc(100vh-200px)] overflow-y-auto">
      {QUICK_PROMPTS.slice(0, 20).map((prompt, idx) => (
        <button
          key={idx}
          className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 cursor-pointer transition-all border border-slate-200 hover:border-blue-300 text-left group"
          onClick={() => onSelectPrompt(prompt.title)}
          title={prompt.description}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Icon name={prompt.icon as any} size={14} className="text-white" />
            </div>
            <p className="text-xs font-semibold text-slate-700 truncate">{prompt.title}</p>
          </div>
        </button>
      ))}
    </div>
  );
}