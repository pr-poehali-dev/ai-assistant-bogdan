import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onVoiceMessageSend?: (audioBlob: Blob, duration: number) => void;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isLoading,
  isListening,
  onStartListening,
  onStopListening,
  onVoiceMessageSend,
}: ChatInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        } 
      });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (onVoiceMessageSend && recordingTime > 0) {
          onVoiceMessageSend(audioBlob, recordingTime);
        }
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Не удалось получить доступ к микрофону. Проверьте разрешения.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      audioChunksRef.current = [];
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  if (isRecording) {
    return (
      <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-red-50 via-orange-50 to-pink-50 animate-gradient">
        <div className="flex gap-3 max-w-4xl mx-auto items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={cancelRecording}
            className="h-16 w-16 rounded-3xl border-2 border-red-300 hover:bg-red-100 hover:border-red-400 transition-all shadow-lg"
          >
            <Icon name="X" size={24} className="text-red-600" />
          </Button>
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-5 shadow-xl border-2 border-red-200">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
              </div>
              <span className="text-xl font-mono font-bold text-slate-800">
                {formatTime(recordingTime)}
              </span>
              <div className="flex-1 flex items-center gap-1 h-10">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-red-400 to-orange-400 rounded-full transition-all animate-pulse"
                    style={{
                      height: `${Math.random() * 30 + 10}px`,
                      opacity: 0.4 + Math.random() * 0.6,
                      animationDelay: `${i * 50}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500 text-center font-medium">
              🎤 Запись голосового сообщения...
            </div>
          </div>
          <Button
            onClick={stopRecording}
            className="h-16 px-10 gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-green-400"
          >
            <Icon name="Check" size={24} />
            <span className="font-bold text-lg">Отправить</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
      <div className="flex gap-3 max-w-4xl mx-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={isListening ? onStopListening : onStartListening}
          className={`h-14 w-14 rounded-2xl transition-all ${
            isListening 
              ? 'bg-red-50 border-red-300 hover:bg-red-100 shadow-lg' 
              : 'hover:bg-slate-50 hover:border-blue-300'
          }`}
          title="Голосовой ввод текста"
        >
          <Icon name={isListening ? 'MicOff' : 'Mic'} size={20} className={isListening ? 'text-red-600' : 'text-slate-700'} />
        </Button>
        <div className="relative flex-1">
          <Input
            placeholder="Напишите сообщение или используйте голосовой ввод..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
            disabled={isLoading}
            className="h-14 px-6 text-[15px] rounded-2xl border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white shadow-sm transition-all"
          />
          {isListening && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-red-500 rounded-full animate-pulse"
                    style={{
                      height: `${12 + i * 4}px`,
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-red-600 font-medium">Слушаю...</span>
            </div>
          )}
        </div>
        {onVoiceMessageSend && (
          <Button
            variant="outline"
            size="icon"
            onClick={startRecording}
            className="h-14 w-14 rounded-2xl hover:bg-purple-50 hover:border-purple-300 transition-all group"
            title="Записать голосовое сообщение"
          >
            <Icon name="Mic" size={20} className="text-purple-600 group-hover:scale-110 transition-transform" />
          </Button>
        )}
        <Button
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          className="h-14 px-8 gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Icon name="Loader2" size={20} className="animate-spin" />
              <span className="font-medium">Отправка...</span>
            </>
          ) : (
            <>
              <Icon name="Send" size={20} />
              <span className="font-medium">Отправить</span>
            </>
          )}
        </Button>
      </div>
      <div className="max-w-4xl mx-auto mt-2 text-center">
        <p className="text-xs text-slate-500">
          <Icon name="Mic" size={12} className="inline mr-1" />
          Голосовой ввод — диктуйте текст  |
          <Icon name="Mic" size={12} className="inline mx-1" />
          Запись голоса — автораспознавание речи + отправка ИИ
        </p>
      </div>
    </div>
  );
}