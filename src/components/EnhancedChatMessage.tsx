import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CodeBlock from '@/components/CodeBlock';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: AIModel;
  attachments?: Array<{ type: 'image' | 'file' | 'audio'; url: string; name: string; duration?: number }>;
  reactions?: Array<{ emoji: string; count: number }>;
}

interface EnhancedChatMessageProps {
  message: Message;
  modelInfo: Record<AIModel, { name: string; fullName: string; color: string; icon: string }>;
  isSpeaking: boolean;
  onSpeak: (text: string, lang?: string) => void;
  onCopy: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  voiceLang?: string;
  onVoiceLangChange?: (lang: string) => void;
  voiceRate?: number;
  voicePitch?: number;
  onVoiceRateChange?: (rate: number) => void;
  onVoicePitchChange?: (pitch: number) => void;
}

const REACTIONS = ['👍', '❤️', '😊', '🎉', '🤔', '👎'];

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

export default function EnhancedChatMessage({
  message,
  modelInfo,
  isSpeaking,
  onSpeak,
  onCopy,
  onRegenerate,
  onAddReaction,
  voiceLang = 'ru-RU',
  onVoiceLangChange,
  voiceRate = 1.0,
  voicePitch = 1.0,
  onVoiceRateChange,
  onVoicePitchChange,
}: EnhancedChatMessageProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const parseMessageContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index),
        });
      }

      parts.push({
        type: 'code',
        content: match[2].trim(),
        language: match[1] || 'javascript',
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex),
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text' as const, content }];
  };

  const messageParts = parseMessageContent(message.content);

  return (
    <div
      className={`flex gap-4 animate-fade-in group ${
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
      <div className="max-w-[75%]">
        <div
          className={`rounded-3xl px-6 py-4 shadow-md ${
            message.role === 'user'
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
              : 'bg-white border border-slate-200'
          }`}
        >
          <div className="text-[15px] leading-relaxed">
            {messageParts.map((part, idx) => {
              if (part.type === 'code') {
                return <CodeBlock key={idx} code={part.content} language={part.language || 'javascript'} />;
              }
              return <p key={idx} className="whitespace-pre-wrap break-words">{part.content}</p>;
            })}
          </div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment, idx) => (
                <div key={idx}>
                  {attachment.type === 'image' ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="rounded-xl max-w-full h-auto"
                    />
                  ) : attachment.type === 'audio' ? (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                          <Icon name="Mic" size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-700">Голосовое сообщение</div>
                          {attachment.duration && (
                            <div className="text-xs text-slate-500 font-medium">
                              Продолжительность: {Math.floor(attachment.duration / 60)}:{(attachment.duration % 60).toString().padStart(2, '0')}
                            </div>
                          )}
                        </div>
                      </div>
                      <audio controls src={attachment.url} className="w-full" style={{height: '40px'}} />
                    </div>
                  ) : (
                    <div className={`flex items-center gap-3 p-3 rounded-xl border-2 shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-white/20 border-white/30 text-white backdrop-blur-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        message.role === 'user' ? 'bg-white/30' : 'bg-blue-100'
                      }`}>
                        <Icon name="Paperclip" size={20} className={message.role === 'user' ? 'text-white' : 'text-blue-600'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{attachment.name}</div>
                        <div className={`text-xs ${message.role === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
                          Файл прикреплен
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
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

            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {message.role === 'assistant' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => onSpeak(message.content, voiceLang)}
                  >
                    <Icon name={isSpeaking ? 'VolumeX' : 'Volume2'} size={14} />
                  </Button>
                  {onVoiceLangChange && onVoiceRateChange && onVoicePitchChange && (
                    <Popover open={showVoiceSettings} onOpenChange={setShowVoiceSettings}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <Icon name="Settings2" size={14} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="start">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Язык озвучки</label>
                            <Select value={voiceLang} onValueChange={onVoiceLangChange}>
                              <SelectTrigger className="h-9">
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
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Скорость: {voiceRate.toFixed(1)}x
                            </label>
                            <Slider
                              value={[voiceRate]}
                              onValueChange={(vals) => onVoiceRateChange(vals[0])}
                              min={0.5}
                              max={2.0}
                              step={0.1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>0.5x</span>
                              <span>2.0x</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Тон: {voicePitch.toFixed(1)}
                            </label>
                            <Slider
                              value={[voicePitch]}
                              onValueChange={(vals) => onVoicePitchChange(vals[0])}
                              min={0.5}
                              max={2.0}
                              step={0.1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Низкий</span>
                              <span>Высокий</span>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => onCopy(message.content)}
                  >
                    <Icon name="Copy" size={14} />
                  </Button>
                  {onRegenerate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => onRegenerate(message.id)}
                    >
                      <Icon name="RefreshCw" size={14} />
                    </Button>
                  )}
                </>
              )}
              <DropdownMenu open={showReactions} onOpenChange={setShowReactions}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Icon name="Smile" size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto">
                  <div className="flex gap-1 p-1">
                    {REACTIONS.map((emoji) => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-lg hover:scale-125 transition-transform"
                        onClick={() => {
                          onAddReaction(message.id, emoji);
                          setShowReactions(false);
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {message.reactions.map((reaction, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-slate-200"
                  onClick={() => onAddReaction(message.id, reaction.emoji)}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-xs">{reaction.count}</span>
                </Badge>
              ))}
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