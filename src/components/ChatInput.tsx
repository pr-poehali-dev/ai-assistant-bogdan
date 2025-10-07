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
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  isLoading,
  isListening,
  onStartListening,
  onStopListening,
}: ChatInputProps) {
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
