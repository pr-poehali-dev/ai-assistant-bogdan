import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: AIModel;
}

interface ChatAreaProps {
  messages: Message[];
  currentModel: AIModel | null;
  isLoading: boolean;
  inputMessage: string;
  isListening: boolean;
  isSpeaking: boolean;
  modelInfo: Record<AIModel, { name: string; fullName: string; color: string; icon: string }>;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onExportChat: () => void;
  onClearHistory: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onSpeak: (text: string) => void;
}

export default function ChatArea({
  messages,
  currentModel,
  isLoading,
  inputMessage,
  isListening,
  isSpeaking,
  modelInfo,
  onInputChange,
  onSendMessage,
  onExportChat,
  onClearHistory,
  onStartListening,
  onStopListening,
  onSpeak,
}: ChatAreaProps) {
  return (
    <Card className="h-[calc(100vh-160px)] flex flex-col shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
      <div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentModel && (
            <Badge className={`bg-gradient-to-r ${modelInfo[currentModel].color} text-white`}>
              <Icon name={modelInfo[currentModel].icon as any} size={14} className="mr-1" />
              {modelInfo[currentModel].name}
            </Badge>
          )}
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {messages.length - 1} сообщений
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onExportChat} className="gap-1">
            <Icon name="Download" size={16} />
            Экспорт
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearHistory} className="gap-1">
            <Icon name="Trash2" size={16} />
            Очистить
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-8">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              modelInfo={modelInfo}
              isSpeaking={isSpeaking}
              onSpeak={onSpeak}
            />
          ))}
          {isLoading && (
            <div className="flex gap-4 justify-start animate-fade-in">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-20"></div>
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Icon name="Loader2" size={18} className="text-white animate-spin" />
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl px-6 py-4 shadow-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <ChatInput
        value={inputMessage}
        onChange={onInputChange}
        onSend={onSendMessage}
        isLoading={isLoading}
        isListening={isListening}
        onStartListening={onStartListening}
        onStopListening={onStopListening}
      />
    </Card>
  );
}
