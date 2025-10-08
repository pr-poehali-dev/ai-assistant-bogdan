import { TabsContent } from '@/components/ui/tabs';
import EnhancedChatArea from '@/components/EnhancedChatArea';
import ChatSidebar from '@/components/chat/ChatSidebar';

interface ChatTabContentProps {
  leftPanelCollapsed: boolean;
  sessions: any[];
  currentSessionId: string;
  stats: any;
  modelInfo: any;
  messages: any[];
  currentModel: string;
  selectedModel: string;
  isLoading: boolean;
  inputMessage: string;
  isListening: boolean;
  isSpeaking: boolean;
  showSearch: boolean;
  searchQuery: string;
  filteredMessages: any[];
  fileInputRef: any;
  onToggleCollapse: () => void;
  onCreateSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onClearStats: () => void;
  onInputChange: (message: string) => void;
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
  onAddReaction: (messageId: string, reaction: string) => void;
  onToggleSearch: () => void;
  onSearchChange: (query: string) => void;
  onSelectSearchResult: (id: string) => void;
  onModelSelect: (model: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVoiceMessageSend?: (audioBlob: Blob, duration: number) => void;
}

export default function ChatTabContent({
  leftPanelCollapsed,
  sessions,
  currentSessionId,
  stats,
  modelInfo,
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
  fileInputRef,
  onToggleCollapse,
  onCreateSession,
  onSwitchSession,
  onClearStats,
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
  voiceLang,
  onVoiceLangChange,
  voiceRate,
  voicePitch,
  onVoiceRateChange,
  onVoicePitchChange
}: ChatTabContentProps) {
  return (
    <TabsContent value="chat" className="mt-0">
      <div className="grid grid-cols-12 gap-2 sm:gap-4">
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          stats={stats}
          modelInfo={modelInfo}
          collapsed={leftPanelCollapsed}
          onCreateSession={onCreateSession}
          onSwitchSession={onSwitchSession}
          onToggleCollapse={onToggleCollapse}
          onClearStats={onClearStats}
        />

        <div className={leftPanelCollapsed ? "col-span-11 lg:col-span-9" : "col-span-12 lg:col-span-9"}>
          <EnhancedChatArea
            messages={messages}
            currentModel={currentModel}
            selectedModel={selectedModel}
            isLoading={isLoading}
            inputMessage={inputMessage}
            isListening={isListening}
            isSpeaking={isSpeaking}
            showSearch={showSearch}
            searchQuery={searchQuery}
            filteredMessages={filteredMessages}
            modelInfo={modelInfo}
            onInputChange={onInputChange}
            onSendMessage={onSendMessage}
            onExportChat={onExportChat}
            onClearHistory={onClearHistory}
            onStartListening={onStartListening}
            onStopListening={onStopListening}
            onSpeak={onSpeak}
            onCopyMessage={onCopyMessage}
            onRegenerateResponse={onRegenerateResponse}
            onAddReaction={onAddReaction}
            onToggleSearch={onToggleSearch}
            onSearchChange={onSearchChange}
            onSelectSearchResult={onSelectSearchResult}
            onModelSelect={onModelSelect}
            onFileUpload={onFileUpload}
            fileInputRef={fileInputRef}
            voiceLang={voiceLang}
            onVoiceLangChange={onVoiceLangChange}
            voiceRate={voiceRate}
            voicePitch={voicePitch}
            onVoiceRateChange={onVoiceRateChange}
            onVoicePitchChange={onVoicePitchChange}
            onVoiceMessageSend={onVoiceMessageSend}
          />
        </div>
      </div>
    </TabsContent>
  );
}