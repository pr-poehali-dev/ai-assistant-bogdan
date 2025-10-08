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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
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

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
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
      <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-red-50/50 to-orange-50/50">
        <div className="flex gap-3 max-w-4xl mx-auto items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={cancelRecording}
            className="h-14 w-14 rounded-2xl border-red-300 hover:bg-red-50"
          >
            <Icon name="X" size={20} className="text-red-600" />
          </Button>
          <div className="flex-1 bg-white rounded-2xl px-6 py-4 shadow-sm border border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-lg font-mono font-semibold text-slate-700">
                {formatTime(recordingTime)}
              </span>
              <div className="flex-1 flex items-center gap-1">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-red-400 rounded-full transition-all"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      opacity: 0.3 + Math.random() * 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <Button
            onClick={stopRecording}
            className="h-14 px-8 gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Icon name="Check" size={20} />
            <span className="font-medium">Отправить</span>
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
          className={`h-14 w-14 rounded-2xl ${isListening ? 'bg-red-50 border-red-300' : ''}`}
        >
          <Icon name={isListening ? 'MicOff' : 'Mic'} size={20} className={isListening ? 'text-red-600' : ''} />
        </Button>
        <div className="relative flex-1">
          <Input
            placeholder="Введите сообщение или используйте голосовой ввод..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
            disabled={isLoading}
            className="h-14 px-6 text-[15px] rounded-2xl border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white shadow-sm"
          />
        </div>
        {onVoiceMessageSend && (
          <Button
            variant="outline"
            size="icon"
            onClick={startRecording}
            className="h-14 w-14 rounded-2xl hover:bg-blue-50 hover:border-blue-300"
          >
            <Icon name="Mic2" size={20} className="text-blue-600" />
          </Button>
        )}
        <Button
          onClick={onSend}
          disabled={isLoading}
          className="h-14 px-8 gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
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
    </div>
  );
}