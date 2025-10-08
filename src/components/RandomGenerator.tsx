import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function RandomGenerator() {
  const [numberMin, setNumberMin] = useState(1);
  const [numberMax, setNumberMax] = useState(100);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);

  const [listItems, setListItems] = useState('');
  const [shuffledList, setShuffledList] = useState<string[]>([]);

  const [yesNoResult, setYesNoResult] = useState<string | null>(null);

  const [diceCount, setDiceCount] = useState(1);
  const [diceResults, setDiceResults] = useState<number[]>([]);

  const generateNumber = () => {
    const num = Math.floor(Math.random() * (numberMax - numberMin + 1)) + numberMin;
    setRandomNumber(num);
  };

  const shuffleList = () => {
    const items = listItems.split('\n').filter(item => item.trim() !== '');
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setShuffledList(shuffled);
  };

  const generateYesNo = () => {
    const results = ['Да ✅', 'Нет ❌', 'Возможно 🤔', 'Определённо да 🎉', 'Определённо нет 🚫'];
    setYesNoResult(results[Math.floor(Math.random() * results.length)]);
  };

  const rollDice = () => {
    const results = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
    setDiceResults(results);
  };

  const flipCoin = () => {
    setYesNoResult(Math.random() < 0.5 ? 'Орёл 🦅' : 'Решка 🪙');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
            <Icon name="Sparkles" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Генератор случайностей</h1>
            <p className="text-slate-600">Случайные числа, списки и решения</p>
          </div>
        </div>

        <Tabs defaultValue="number" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="number" className="gap-1.5">
              <Icon name="Hash" size={16} />
              Число
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-1.5">
              <Icon name="List" size={16} />
              Список
            </TabsTrigger>
            <TabsTrigger value="decision" className="gap-1.5">
              <Icon name="HelpCircle" size={16} />
              Решение
            </TabsTrigger>
            <TabsTrigger value="dice" className="gap-1.5">
              <Icon name="Dices" size={16} />
              Кости
            </TabsTrigger>
          </TabsList>

          <TabsContent value="number" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">От</label>
                <Input
                  type="number"
                  value={numberMin}
                  onChange={(e) => setNumberMin(parseInt(e.target.value) || 0)}
                  className="text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">До</label>
                <Input
                  type="number"
                  value={numberMax}
                  onChange={(e) => setNumberMax(parseInt(e.target.value) || 100)}
                  className="text-lg"
                />
              </div>
            </div>

            {randomNumber !== null && (
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <div className="text-center text-7xl font-bold text-blue-600">
                  {randomNumber}
                </div>
              </Card>
            )}

            <Button onClick={generateNumber} className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-blue-500 to-cyan-600">
              <Icon name="Sparkles" size={24} />
              Сгенерировать число
            </Button>
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Введите список (каждый элемент с новой строки)</label>
              <Textarea
                value={listItems}
                onChange={(e) => setListItems(e.target.value)}
                placeholder="Вариант 1&#10;Вариант 2&#10;Вариант 3"
                className="min-h-32 text-base"
              />
            </div>

            {shuffledList.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <h3 className="font-bold text-lg mb-3 text-purple-800">Перемешанный список:</h3>
                <ol className="space-y-2">
                  {shuffledList.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-700">
                      <span className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            )}

            <Button onClick={shuffleList} className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-purple-500 to-pink-600">
              <Icon name="Shuffle" size={24} />
              Перемешать список
            </Button>
          </TabsContent>

          <TabsContent value="decision" className="space-y-6">
            {yesNoResult && (
              <Card className="p-12 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="text-center text-5xl font-bold text-green-600">
                  {yesNoResult}
                </div>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={generateYesNo} className="h-16 text-lg gap-2 bg-gradient-to-r from-green-500 to-emerald-600">
                <Icon name="CircleHelp" size={24} />
                Да или Нет?
              </Button>
              <Button onClick={flipCoin} className="h-16 text-lg gap-2 bg-gradient-to-r from-yellow-500 to-orange-600">
                <Icon name="Coins" size={24} />
                Подбросить монетку
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="dice" className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Количество костей: {diceCount}</label>
              <Input
                type="range"
                min="1"
                max="10"
                value={diceCount}
                onChange={(e) => setDiceCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {diceResults.length > 0 && (
              <Card className="p-8 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <div className="flex flex-wrap gap-4 justify-center">
                  {diceResults.map((result, index) => (
                    <div key={index} className="w-20 h-20 rounded-xl bg-white border-4 border-red-500 flex items-center justify-center text-4xl font-bold text-red-600 shadow-lg">
                      {result}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6 text-2xl font-bold text-slate-700">
                  Сумма: {diceResults.reduce((a, b) => a + b, 0)}
                </div>
              </Card>
            )}

            <Button onClick={rollDice} className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-red-500 to-orange-600">
              <Icon name="Dices" size={24} />
              Бросить кости
            </Button>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
