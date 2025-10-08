import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface StatsPanelProps {
  stats: Record<AIModel, number>;
  modelInfo: Record<AIModel, { name: string; fullName: string; color: string; icon: string }>;
  onClearStats: () => void;
}

export default function StatsPanel({ stats, modelInfo }: StatsPanelProps) {
  const totalRequests = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-2">
      <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center">
        <p className="text-xs opacity-90">Запросов</p>
        <p className="text-2xl font-bold">{totalRequests}</p>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {Object.entries(modelInfo).map(([key, info]) => {
          const count = stats[key as AIModel];
          return (
            <div key={key} className="p-1.5 rounded-lg bg-slate-50 text-center">
              <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-1`}>
                <Icon name={info.icon as any} size={12} className="text-white" />
              </div>
              <p className="text-xs font-bold text-slate-700">{count}</p>
              <p className="text-[10px] text-slate-500 truncate">{info.name.replace('Режим ', '')}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}