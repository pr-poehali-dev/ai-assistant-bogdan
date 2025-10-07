import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface StatsPanelProps {
  stats: Record<AIModel, number>;
  modelInfo: Record<AIModel, { name: string; fullName: string; color: string; icon: string }>;
  onClearStats: () => void;
}

export default function StatsPanel({ stats, modelInfo, onClearStats }: StatsPanelProps) {
  const totalRequests = Object.values(stats).reduce((a, b) => a + b, 0);
  const mostUsedModel = Object.entries(stats).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0] as AIModel;

  return (
    <Card className="p-6 shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-blue-600" />
          <h3 className="font-bold text-slate-800">Статистика</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearStats}>
          <Icon name="RotateCcw" size={14} />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Всего запросов</p>
          <p className="text-2xl font-bold text-blue-900">{totalRequests}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
          <p className="text-sm text-purple-600 mb-1">Популярная</p>
          <div className="flex items-center gap-1">
            <Icon name={modelInfo[mostUsedModel]?.icon as any} size={16} className="text-purple-900" />
            <p className="text-sm font-bold text-purple-900">{modelInfo[mostUsedModel]?.name}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(modelInfo).map(([key, info]) => {
          const count = stats[key as AIModel];
          const percentage = totalRequests > 0 ? (count / totalRequests) * 100 : 0;
          
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                    <Icon name={info.icon as any} size={12} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{info.name}</span>
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${info.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
