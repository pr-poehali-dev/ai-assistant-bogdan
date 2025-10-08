import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

export default function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => setCount(count + step);
  const decrement = () => setCount(count - step);
  const reset = () => setCount(0);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <Icon name="Hash" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Счётчик</h1>
            <p className="text-slate-600">Считайте всё, что угодно</p>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-12">
            <div className="text-8xl font-bold text-slate-800 mb-4 font-mono">
              {count}
            </div>
            <div className="text-slate-600 text-lg">
              {count === 0 ? 'Начните считать' : 
               count === 1 ? '1 элемент' :
               count < 5 ? `${count} элемента` : 
               `${count} элементов`}
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center">
            <label className="text-sm font-medium text-slate-700">Шаг:</label>
            <Input
              type="number"
              value={step}
              onChange={(e) => setStep(parseInt(e.target.value) || 1)}
              className="w-24 text-center"
              min="1"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={decrement}
              size="lg"
              className="h-24 text-2xl gap-3 bg-gradient-to-r from-red-500 to-pink-600"
            >
              <Icon name="Minus" size={32} />
              -{step}
            </Button>
            
            <Button
              onClick={reset}
              size="lg"
              variant="outline"
              className="h-24 text-xl gap-2"
            >
              <Icon name="RotateCcw" size={28} />
              Сброс
            </Button>
            
            <Button
              onClick={increment}
              size="lg"
              className="h-24 text-2xl gap-3 bg-gradient-to-r from-green-500 to-emerald-600"
            >
              <Icon name="Plus" size={32} />
              +{step}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button onClick={() => setCount(count + 10)} variant="outline" className="gap-2">
              <Icon name="ChevronsUp" size={18} />
              +10
            </Button>
            <Button onClick={() => setCount(count - 10)} variant="outline" className="gap-2">
              <Icon name="ChevronsDown" size={18} />
              -10
            </Button>
            <Button onClick={() => setCount(count * 2)} variant="outline" className="gap-2">
              <Icon name="X" size={18} />
              ×2
            </Button>
            <Button onClick={() => setCount(Math.floor(count / 2))} variant="outline" className="gap-2">
              <Icon name="Divide" size={18} />
              ÷2
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
