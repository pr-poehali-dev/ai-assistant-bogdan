import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

export default function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  
  const intervalRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();

  useEffect(() => {
    audioContextRef.current = new AudioContext();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / bpm;
      intervalRef.current = window.setInterval(() => {
        playClick();
        setBeat((prev) => (prev + 1) % beatsPerMeasure);
      }, interval);
    } else {
      clearInterval(intervalRef.current);
      setBeat(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, bpm, beatsPerMeasure]);

  const playClick = () => {
    if (!audioContextRef.current) return;
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    const isFirstBeat = beat === 0;
    oscillator.frequency.value = isFirstBeat ? 1000 : 800;
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  };

  const tempoMarks = [
    { bpm: 40, name: 'Grave' },
    { bpm: 60, name: 'Largo' },
    { bpm: 76, name: 'Adagio' },
    { bpm: 108, name: 'Moderato' },
    { bpm: 120, name: 'Allegro' },
    { bpm: 168, name: 'Presto' },
    { bpm: 200, name: 'Prestissimo' },
  ];

  const getCurrentTempo = () => {
    for (let i = tempoMarks.length - 1; i >= 0; i--) {
      if (bpm >= tempoMarks[i].bpm) {
        return tempoMarks[i].name;
      }
    }
    return tempoMarks[0].name;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
            <Icon name="Music" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Метроном</h1>
            <p className="text-slate-600">Задавайте ритм для игры на инструментах</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <div className="text-8xl font-bold text-slate-800 mb-2 font-mono">
              {bpm}
            </div>
            <div className="text-2xl text-slate-600 font-semibold">
              {getCurrentTempo()}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              ударов в минуту (BPM)
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {Array.from({ length: beatsPerMeasure }, (_, i) => (
              <div
                key={i}
                className={`w-16 h-16 rounded-full border-4 transition-all ${
                  isPlaying && beat === i
                    ? i === 0
                      ? 'bg-red-500 border-red-600 scale-110 shadow-lg'
                      : 'bg-blue-500 border-blue-600 scale-110 shadow-lg'
                    : 'bg-slate-200 border-slate-300'
                }`}
              />
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-slate-700">Темп (BPM)</label>
              <div className="flex gap-2">
                <Button onClick={() => setBpm(Math.max(40, bpm - 5))} size="sm" variant="outline">
                  <Icon name="Minus" size={16} />
                </Button>
                <Button onClick={() => setBpm(Math.min(240, bpm + 5))} size="sm" variant="outline">
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
            </div>
            <Slider
              value={[bpm]}
              onValueChange={(value) => setBpm(value[0])}
              min={40}
              max={240}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-3 block">Размер такта</label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((count) => (
                <Button
                  key={count}
                  onClick={() => setBeatsPerMeasure(count)}
                  variant={beatsPerMeasure === count ? 'default' : 'outline'}
                  className={beatsPerMeasure === count ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : ''}
                >
                  {count}/4
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              size="lg"
              className={`h-16 text-lg gap-2 ${
                isPlaying
                  ? 'bg-gradient-to-r from-red-500 to-pink-600'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600'
              }`}
            >
              <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} />
              {isPlaying ? 'Остановить' : 'Запустить'}
            </Button>
            <Button
              onClick={() => { setIsPlaying(false); setBeat(0); }}
              size="lg"
              variant="outline"
              className="h-16 text-lg gap-2"
            >
              <Icon name="RotateCcw" size={24} />
              Сброс
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => setBpm(60)} variant="outline" size="sm">60 BPM</Button>
            <Button onClick={() => setBpm(120)} variant="outline" size="sm">120 BPM</Button>
            <Button onClick={() => setBpm(180)} variant="outline" size="sm">180 BPM</Button>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-indigo-600" />
          Музыкальные темпы
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
          <div><strong>Grave (40-60):</strong> Очень медленно</div>
          <div><strong>Largo (60-66):</strong> Широко</div>
          <div><strong>Adagio (66-76):</strong> Спокойно</div>
          <div><strong>Andante (76-108):</strong> Умеренно</div>
          <div><strong>Moderato (108-120):</strong> Сдержанно</div>
          <div><strong>Allegro (120-168):</strong> Весело</div>
          <div><strong>Presto (168-200):</strong> Быстро</div>
          <div><strong>Prestissimo (200+):</strong> Очень быстро</div>
        </div>
      </Card>
    </div>
  );
}
