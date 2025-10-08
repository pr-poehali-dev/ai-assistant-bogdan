import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const lengthUnits = {
  'мм': 0.001,
  'см': 0.01,
  'м': 1,
  'км': 1000,
  'дюйм': 0.0254,
  'фут': 0.3048,
  'ярд': 0.9144,
  'миля': 1609.344,
};

const weightUnits = {
  'мг': 0.000001,
  'г': 0.001,
  'кг': 1,
  'т': 1000,
  'унция': 0.028349523125,
  'фунт': 0.45359237,
};

const temperatureConvert = (value: number, from: string, to: string): number => {
  let celsius = value;
  if (from === 'F') celsius = (value - 32) * 5/9;
  if (from === 'K') celsius = value - 273.15;
  
  if (to === 'C') return celsius;
  if (to === 'F') return celsius * 9/5 + 32;
  if (to === 'K') return celsius + 273.15;
  return celsius;
};

const volumeUnits = {
  'мл': 0.001,
  'л': 1,
  'м³': 1000,
  'галлон': 3.78541,
  'кварта': 0.946353,
  'пинта': 0.473176,
};

export default function UnitConverter() {
  const [lengthFrom, setLengthFrom] = useState('м');
  const [lengthTo, setLengthTo] = useState('км');
  const [lengthValue, setLengthValue] = useState('');

  const [weightFrom, setWeightFrom] = useState('кг');
  const [weightTo, setWeightTo] = useState('г');
  const [weightValue, setWeightValue] = useState('');

  const [tempFrom, setTempFrom] = useState('C');
  const [tempTo, setTempTo] = useState('F');
  const [tempValue, setTempValue] = useState('');

  const [volumeFrom, setVolumeFrom] = useState('л');
  const [volumeTo, setVolumeTo] = useState('мл');
  const [volumeValue, setVolumeValue] = useState('');

  const convertLength = (value: string): string => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    const meters = num * lengthUnits[lengthFrom];
    return (meters / lengthUnits[lengthTo]).toFixed(6).replace(/\.?0+$/, '');
  };

  const convertWeight = (value: string): string => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    const kg = num * weightUnits[weightFrom];
    return (kg / weightUnits[weightTo]).toFixed(6).replace(/\.?0+$/, '');
  };

  const convertTemp = (value: string): string => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return temperatureConvert(num, tempFrom, tempTo).toFixed(2);
  };

  const convertVolume = (value: string): string => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    const liters = num * volumeUnits[volumeFrom];
    return (liters / volumeUnits[volumeTo]).toFixed(6).replace(/\.?0+$/, '');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Icon name="Ruler" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Конвертер величин</h1>
            <p className="text-slate-600">Переводите единицы измерения</p>
          </div>
        </div>

        <Tabs defaultValue="length" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="length" className="gap-1.5">
              <Icon name="Ruler" size={16} />
              Длина
            </TabsTrigger>
            <TabsTrigger value="weight" className="gap-1.5">
              <Icon name="Weight" size={16} />
              Вес
            </TabsTrigger>
            <TabsTrigger value="temperature" className="gap-1.5">
              <Icon name="Thermometer" size={16} />
              Температура
            </TabsTrigger>
            <TabsTrigger value="volume" className="gap-1.5">
              <Icon name="Droplet" size={16} />
              Объём
            </TabsTrigger>
          </TabsList>

          <TabsContent value="length" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Из</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={lengthValue}
                    onChange={(e) => setLengthValue(e.target.value)}
                    className="text-lg"
                  />
                  <Select value={lengthFrom} onValueChange={setLengthFrom}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(lengthUnits).map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">В</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={convertLength(lengthValue)}
                    readOnly
                    className="text-lg bg-slate-50"
                  />
                  <Select value={lengthTo} onValueChange={setLengthTo}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(lengthUnits).map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button
              onClick={() => { const temp = lengthFrom; setLengthFrom(lengthTo); setLengthTo(temp); }}
              variant="outline"
              className="w-full gap-2"
            >
              <Icon name="ArrowLeftRight" size={16} />
              Поменять местами
            </Button>
          </TabsContent>

          <TabsContent value="weight" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Из</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={weightValue}
                    onChange={(e) => setWeightValue(e.target.value)}
                    className="text-lg"
                  />
                  <Select value={weightFrom} onValueChange={setWeightFrom}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(weightUnits).map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">В</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={convertWeight(weightValue)}
                    readOnly
                    className="text-lg bg-slate-50"
                  />
                  <Select value={weightTo} onValueChange={setWeightTo}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(weightUnits).map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button
              onClick={() => { const temp = weightFrom; setWeightFrom(weightTo); setWeightTo(temp); }}
              variant="outline"
              className="w-full gap-2"
            >
              <Icon name="ArrowLeftRight" size={16} />
              Поменять местами
            </Button>
          </TabsContent>

          <TabsContent value="temperature" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Из</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="text-lg"
                  />
                  <Select value={tempFrom} onValueChange={setTempFrom}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C">°C</SelectItem>
                      <SelectItem value="F">°F</SelectItem>
                      <SelectItem value="K">K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">В</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={convertTemp(tempValue)}
                    readOnly
                    className="text-lg bg-slate-50"
                  />
                  <Select value={tempTo} onValueChange={setTempTo}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C">°C</SelectItem>
                      <SelectItem value="F">°F</SelectItem>
                      <SelectItem value="K">K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button
              onClick={() => { const temp = tempFrom; setTempFrom(tempTo); setTempTo(temp); }}
              variant="outline"
              className="w-full gap-2"
            >
              <Icon name="ArrowLeftRight" size={16} />
              Поменять местами
            </Button>
          </TabsContent>

          <TabsContent value="volume" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Из</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={volumeValue}
                    onChange={(e) => setVolumeValue(e.target.value)}
                    className="text-lg"
                  />
                  <Select value={volumeFrom} onValueChange={setVolumeFrom}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(volumeUnits).map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">В</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={convertVolume(volumeValue)}
                    readOnly
                    className="text-lg bg-slate-50"
                  />
                  <Select value={volumeTo} onValueChange={setVolumeTo}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(volumeUnits).map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button
              onClick={() => { const temp = volumeFrom; setVolumeFrom(volumeTo); setVolumeTo(temp); }}
              variant="outline"
              className="w-full gap-2"
            >
              <Icon name="ArrowLeftRight" size={16} />
              Поменять местами
            </Button>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
