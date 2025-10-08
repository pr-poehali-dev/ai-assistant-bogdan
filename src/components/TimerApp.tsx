import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

export default function TimerApp() {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInput, setTimerInput] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  const timerIntervalRef = useRef<number>();
  const stopwatchIntervalRef = useRef<number>();

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            playSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerRunning, timerSeconds]);

  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchIntervalRef.current = window.setInterval(() => {
        setStopwatchMs((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(stopwatchIntervalRef.current);
    }
    return () => clearInterval(stopwatchIntervalRef.current);
  }, [stopwatchRunning]);

  const playSound = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const startTimer = () => {
    const totalSeconds = timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds;
    if (totalSeconds > 0) {
      setTimerSeconds(totalSeconds);
      setTimerRunning(true);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
            <Icon name="Timer" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Таймер и Секундомер</h1>
            <p className="text-slate-600">Отслеживайте время для любых задач</p>
          </div>
        </div>

        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="timer" className="gap-2">
              <Icon name="Clock" size={18} />
              Таймер
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="gap-2">
              <Icon name="Stopwatch" size={18} />
              Секундомер
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-6">
            <div className="text-center">
              <div className="text-7xl font-mono font-bold text-slate-800 mb-6">
                {formatTime(timerSeconds)}
              </div>

              {!timerRunning && timerSeconds === 0 && (
                <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
                  <div>
                    <label className="text-sm text-slate-600 block mb-2">Часы</label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={timerInput.hours}
                      onChange={(e) => setTimerInput({ ...timerInput, hours: parseInt(e.target.value) || 0 })}
                      className="text-center text-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 block mb-2">Минуты</label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={timerInput.minutes}
                      onChange={(e) => setTimerInput({ ...timerInput, minutes: parseInt(e.target.value) || 0 })}
                      className="text-center text-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 block mb-2">Секунды</label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={timerInput.seconds}
                      onChange={(e) => setTimerInput({ ...timerInput, seconds: parseInt(e.target.value) || 0 })}
                      className="text-center text-xl"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                {!timerRunning && timerSeconds === 0 && (
                  <Button onClick={startTimer} size="lg" className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600">
                    <Icon name="Play" size={20} />
                    Запустить
                  </Button>
                )}
                {timerRunning && (
                  <Button onClick={() => setTimerRunning(false)} size="lg" className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-600">
                    <Icon name="Pause" size={20} />
                    Пауза
                  </Button>
                )}
                {!timerRunning && timerSeconds > 0 && (
                  <Button onClick={() => setTimerRunning(true)} size="lg" className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600">
                    <Icon name="Play" size={20} />
                    Продолжить
                  </Button>
                )}
                {timerSeconds > 0 && (
                  <Button onClick={() => { setTimerSeconds(0); setTimerRunning(false); }} size="lg" variant="outline" className="gap-2">
                    <Icon name="RotateCcw" size={20} />
                    Сброс
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <Button onClick={() => { setTimerInput({ hours: 0, minutes: 1, seconds: 0 }); }} variant="outline" size="sm">1 мин</Button>
                <Button onClick={() => { setTimerInput({ hours: 0, minutes: 5, seconds: 0 }); }} variant="outline" size="sm">5 мин</Button>
                <Button onClick={() => { setTimerInput({ hours: 0, minutes: 10, seconds: 0 }); }} variant="outline" size="sm">10 мин</Button>
                <Button onClick={() => { setTimerInput({ hours: 0, minutes: 15, seconds: 0 }); }} variant="outline" size="sm">15 мин</Button>
                <Button onClick={() => { setTimerInput({ hours: 0, minutes: 30, seconds: 0 }); }} variant="outline" size="sm">30 мин</Button>
                <Button onClick={() => { setTimerInput({ hours: 1, minutes: 0, seconds: 0 }); }} variant="outline" size="sm">1 час</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stopwatch" className="space-y-6">
            <div className="text-center">
              <div className="text-7xl font-mono font-bold text-slate-800 mb-6">
                {formatStopwatch(stopwatchMs)}
              </div>

              <div className="flex gap-3 justify-center">
                {!stopwatchRunning && stopwatchMs === 0 && (
                  <Button onClick={() => setStopwatchRunning(true)} size="lg" className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600">
                    <Icon name="Play" size={20} />
                    Запустить
                  </Button>
                )}
                {stopwatchRunning && (
                  <Button onClick={() => setStopwatchRunning(false)} size="lg" className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-600">
                    <Icon name="Pause" size={20} />
                    Пауза
                  </Button>
                )}
                {!stopwatchRunning && stopwatchMs > 0 && (
                  <Button onClick={() => setStopwatchRunning(true)} size="lg" className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600">
                    <Icon name="Play" size={20} />
                    Продолжить
                  </Button>
                )}
                {stopwatchMs > 0 && (
                  <Button onClick={() => { setStopwatchMs(0); setStopwatchRunning(false); }} size="lg" variant="outline" className="gap-2">
                    <Icon name="RotateCcw" size={20} />
                    Сброс
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
