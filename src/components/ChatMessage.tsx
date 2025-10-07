import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: AIModel;
}

interface ChatMessageProps {
  message: Message;
  modelInfo: Record<AIModel, { name: string; fullName: string; color: string; icon: string }>;
  isSpeaking: boolean;
  onSpeak: (text: string) => void;
}

export default function ChatMessage({ message, modelInfo, isSpeaking, onSpeak }: ChatMessageProps) {
  return (
    <div
      className={`flex gap-4 animate-fade-in ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-20"></div>
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Icon name="Sparkles" size={18} className="text-white" />
          </div>
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-3xl px-6 py-4 shadow-md ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-white border border-slate-200'
        }`}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <div className="flex items-center gap-2 mt-2">
          <p
            className={`text-xs ${
              message.role === 'user' ? 'text-blue-100' : 'text-slate-400'
            }`}
          >
            {message.timestamp.toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {message.model && (
            <Badge variant="outline" className="text-xs">
              {modelInfo[message.model].name}
            </Badge>
          )}
          {message.role === 'assistant' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => onSpeak(message.content)}
            >
              <Icon name={isSpeaking ? 'VolumeX' : 'Volume2'} size={14} />
            </Button>
          )}
        </div>
      </div>
      {message.role === 'user' && (
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl blur opacity-20"></div>
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-lg">
            <Icon name="User" size={18} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
