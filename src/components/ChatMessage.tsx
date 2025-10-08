import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AIModel = 'gemini' | 'llama' | 'gigachat' | 'phi' | 'qwen' | 'mistral';

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
  onSpeak: (text: string, lang?: string) => void;
  voiceLang?: string;
  onVoiceLangChange?: (lang: string) => void;
}

const VOICE_LANGUAGES = [
  { code: 'ru-RU', name: '🇷🇺 Русский' },
  { code: 'en-US', name: '🇺🇸 Английский' },
  { code: 'es-ES', name: '🇪🇸 Испанский' },
  { code: 'fr-FR', name: '🇫🇷 Французский' },
  { code: 'de-DE', name: '🇩🇪 Немецкий' },
  { code: 'it-IT', name: '🇮🇹 Итальянский' },
  { code: 'pt-PT', name: '🇵🇹 Португальский' },
  { code: 'zh-CN', name: '🇨🇳 Китайский' },
  { code: 'ja-JP', name: '🇯🇵 Японский' },
  { code: 'ko-KR', name: '🇰🇷 Корейский' },
];

export default function ChatMessage({ message, modelInfo, isSpeaking, onSpeak, voiceLang = 'ru-RU', onVoiceLangChange }: ChatMessageProps) {
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
          {message.model && modelInfo[message.model] && (
            <Badge 
              variant="outline" 
              className={`text-xs font-semibold bg-gradient-to-r ${modelInfo[message.model].color} text-white border-0`}
            >
              <Icon name={modelInfo[message.model].icon as any} size={12} className="mr-1" />
              {modelInfo[message.model].name}
            </Badge>
          )}
          {message.role === 'assistant' && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => onSpeak(message.content, voiceLang)}
              >
                <Icon name={isSpeaking ? 'VolumeX' : 'Volume2'} size={14} />
              </Button>
              {onVoiceLangChange && (
                <Select value={voiceLang} onValueChange={onVoiceLangChange}>
                  <SelectTrigger className="h-6 w-[110px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code} className="text-xs">
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
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