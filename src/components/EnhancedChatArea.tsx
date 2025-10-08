import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import EnhancedChatMessage from '@/components/EnhancedChatMessage';
import ChatInput from '@/components/ChatInput';
import SearchBar from '@/components/SearchBar';

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

interface EnhancedChatAreaProps {
  messages: Message[];
  currentModel: AIModel | null;
  selectedModel: AIModel | 'auto';
  isLoading: boolean;
  inputMessage: string;
  isListening: boolean;
  isSpeaking: boolean;
  showSearch: boolean;
  searchQuery: string;
  filteredMessages: Message[];
  modelInfo: Record<AIModel, { name: string; fullName: string; color: string; icon: string }>;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onExportChat: () => void;
  onClearHistory: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onSpeak: (text: string, lang?: string) => void;
  voiceLang?: string;
  onVoiceLangChange?: (lang: string) => void;
  voiceRate?: number;
  voicePitch?: number;
  onVoiceRateChange?: (rate: number) => void;
  onVoicePitchChange?: (pitch: number) => void;
  onCopyMessage: (content: string) => void;
  onRegenerateResponse: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onToggleSearch: () => void;
  onSearchChange: (query: string) => void;
  onSelectSearchResult: (messageId: string) => void;
  onModelSelect: (model: AIModel | 'auto') => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function EnhancedChatArea({
  messages,
  currentModel,
  selectedModel,
  isLoading,
  inputMessage,
  isListening,
  isSpeaking,
  showSearch,
  searchQuery,
  filteredMessages,
  modelInfo,
  onInputChange,
  onSendMessage,
  onExportChat,
  onClearHistory,
  onStartListening,
  onStopListening,
  onSpeak,
  onCopyMessage,
  onRegenerateResponse,
  onAddReaction,
  onToggleSearch,
  onSearchChange,
  onSelectSearchResult,
  onModelSelect,
  onFileUpload,
  fileInputRef,
  voiceLang,
  onVoiceLangChange,
  voiceRate,
  voicePitch,
  onVoiceRateChange,
  onVoicePitchChange,
}: EnhancedChatAreaProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0 && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      Array.from(files).forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
      
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
      
      onFileUpload({ target: fileInputRef.current } as any);
    }
  };
  return (
    <Card 
      className="h-[calc(100vh-160px)] flex flex-col shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm border-4 border-dashed border-blue-500 rounded-lg flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon name="Upload" size={32} className="text-blue-600" />
              </div>
              <p className="text-xl font-semibold text-slate-800">Отпустите файлы здесь</p>
              <p className="text-sm text-slate-500">Поддерживаются: изображения, PDF, DOC, TXT</p>
            </div>
          </div>
        </div>
      )}
      {showSearch && (
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          filteredMessages={filteredMessages}
          onClose={onToggleSearch}
          onSelectMessage={onSelectSearchResult}
        />
      )}

      <div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={selectedModel} onValueChange={onModelSelect}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Выбрать модель" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                <div className="flex items-center gap-2">
                  <Icon name="Zap" size={14} />
                  <span>Авто-выбор</span>
                </div>
              </SelectItem>
              {Object.entries(modelInfo).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <Icon name={info.icon as any} size={14} />
                    <span>{info.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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
          <Button variant="ghost" size="sm" onClick={onToggleSearch} className="gap-1">
            <Icon name="Search" size={16} />
            Поиск
          </Button>
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1">
            <Icon name="Paperclip" size={16} />
            Файл
          </Button>
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
            <EnhancedChatMessage
              key={message.id}
              message={message}
              modelInfo={modelInfo}
              isSpeaking={isSpeaking}
              onSpeak={onSpeak}
              onCopy={onCopyMessage}
              onRegenerate={message.role === 'assistant' ? onRegenerateResponse : undefined}
              onAddReaction={onAddReaction}
              voiceLang={voiceLang}
              onVoiceLangChange={onVoiceLangChange}
              voiceRate={voiceRate}
              voicePitch={voicePitch}
              onVoiceRateChange={onVoiceRateChange}
              onVoicePitchChange={onVoicePitchChange}
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

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={onFileUpload}
      />

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