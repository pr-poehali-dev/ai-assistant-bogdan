import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: AIModel;
  attachments?: Array<{ type: 'image' | 'file'; url: string; name: string }>;
  reactions?: Array<{ emoji: string; count: number }>;
}

interface EnhancedChatMessageProps {
  message: Message;
  modelInfo: Record<AIModel, { name: string; fullName: string; color: string; icon: string }>;
  isSpeaking: boolean;
  onSpeak: (text: string) => void;
  onCopy: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const REACTIONS = ['👍', '❤️', '😊', '🎉', '🤔', '👎'];

export default function EnhancedChatMessage({
  message,
  modelInfo,
  isSpeaking,
  onSpeak,
  onCopy,
  onRegenerate,
  onAddReaction,
}: EnhancedChatMessageProps) {
  const [showReactions, setShowReactions] = useState(false);

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
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
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
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100">
                      <Icon name="File" size={16} />
                      <span className="text-sm">{attachment.name}</span>
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
            {message.model && (
              <Badge variant="outline" className="text-xs">
                {modelInfo[message.model].name}
              </Badge>
            )}
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {message.role === 'assistant' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => onSpeak(message.content)}
                  >
                    <Icon name={isSpeaking ? 'VolumeX' : 'Volume2'} size={14} />
                  </Button>
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
