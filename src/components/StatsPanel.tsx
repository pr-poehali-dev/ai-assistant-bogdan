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
    <div className="space-y-3">
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <p className="text-sm opacity-90 mb-1">Всего запросов</p>
        <p className="text-3xl font-bold">{totalRequests}</p>
      </div>

      <div className="space-y-2">
        {Object.entries(modelInfo).map(([key, info]) => {
          const count = stats[key as AIModel];
          
          return (
            <div key={key} className="p-3 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                    <Icon name={info.icon as any} size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{info.name}</span>
                </div>
                <Badge className={`bg-gradient-to-r ${info.color} text-white border-0`}>
                  {count}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
