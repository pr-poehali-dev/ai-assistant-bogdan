import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ContinuousVoiceModeProps {
  isActive: boolean;
  onToggle: () => void;
  onVoiceInput: (text: string) => void;
  onVoiceOutput: (text: string) => void;
}

export default function ContinuousVoiceMode({
  isActive,
  onToggle,
  onVoiceInput,
  onVoiceOutput,
}: ContinuousVoiceModeProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isActive) {
      setIsListening(false);
      setIsSpeaking(false);
      window.speechSynthesis.cancel();
    } else {
      startListening();
    }
  }, [isActive]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast({
        title: 'Не поддерживается',
        description: 'Голосовой ввод недоступен в вашем браузере',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'ru-RU';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      onVoiceInput(transcript);
      
      setTimeout(() => {
        if (isActive) {
          recognition.start();
        }
      }, 1000);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isActive && !isSpeaking) {
        setTimeout(() => recognition.start(), 500);
      }
    };

    recognition.start();
  };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all ${
      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}>
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 rounded-full shadow-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-full px-6 py-4 flex items-center gap-4">
          <div className="relative">
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-75" />
            )}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isListening ? 'bg-purple-500' : 'bg-slate-300'
            }`}>
              <Icon name="Mic" size={24} className="text-white" />
            </div>
          </div>

          <div>
            <div className="font-semibold text-sm">Режим голосового общения</div>
            <div className="text-xs text-slate-500">
              {isListening ? 'Слушаю...' : 'Говорите с ИИ'}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="rounded-full"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
