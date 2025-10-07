import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import BurgerMenu from '@/components/BurgerMenu';
import AboutPage from '@/components/AboutPage';
import FeaturesPage from '@/components/FeaturesPage';
import TeamPage from '@/components/TeamPage';
import DocsPage from '@/components/DocsPage';
import EnhancedChatArea from '@/components/EnhancedChatArea';
import AdminPanel from '@/components/AdminPanel';
import AdminLoginDialog from '@/components/dialogs/AdminLoginDialog';
import EnhancedSettingsDialog from '@/components/dialogs/EnhancedSettingsDialog';
import SessionManager from '@/components/SessionManager';
import StatsPanel from '@/components/StatsPanel';
import QuickPrompts from '@/components/QuickPrompts';
import { useChatLogic } from '@/hooks/useChatLogic';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useAdminControls } from '@/hooks/useAdminControls';
import { useToast } from '@/hooks/use-toast';

const modelInfo = {
  gemini: { name: 'Режим Скорость', fullName: 'Быстрые ответы для повседневных задач', color: 'from-blue-500 to-blue-600', icon: 'Zap' },
  llama: { name: 'Режим Точность', fullName: 'Детальный анализ сложных вопросов', color: 'from-purple-500 to-purple-600', icon: 'Target' },
  gigachat: { name: 'Режим Креатив', fullName: 'Творческие и нестандартные решения', color: 'from-green-500 to-green-600', icon: 'Lightbulb' },
};

export default function Index() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState('chat');
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatLogic = useChatLogic();
  const voiceControl = useVoiceControl();
  const sessionManager = useSessionManager(chatLogic.settings.auto_save);
  const adminControls = useAdminControls();

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = chatLogic.messages.filter(m => 
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages([]);
    }
  }, [searchQuery, chatLogic.messages]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'k':
            e.preventDefault();
            handleCreateNewSession();
            break;
          case 'f':
            e.preventDefault();
            setShowSearch(!showSearch);
            break;
          case 'e':
            e.preventDefault();
            chatLogic.exportChat();
            break;
          case '/':
            e.preventDefault();
            setShowSettingsDialog(!showSettingsDialog);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [showSearch, showSettingsDialog]);

  const handleCreateNewSession = () => {
    const initialMessages = [{
      id: '1',
      role: 'assistant' as const,
      content: 'Здравствуйте! Чем могу помочь?',
      timestamp: new Date(),
    }];
    const newSession = sessionManager.createNewSession(initialMessages);
    chatLogic.setMessages(newSession.messages);
  };

  const handleSwitchSession = (sessionId: string) => {
    const messages = sessionManager.switchSession(sessionId);
    if (messages) {
      chatLogic.setMessages(messages);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const wasCurrentSession = sessionManager.deleteSession(sessionId);
    if (wasCurrentSession) {
      chatLogic.clearHistory();
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('ai-settings', JSON.stringify(chatLogic.settings));
    setShowSettingsDialog(false);
    toast({
      title: 'Настройки сохранены',
      description: 'Параметры помощника обновлены',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
            <BurgerMenu onNavigate={setCurrentPage} currentPage={currentPage} />
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur opacity-20"></div>
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Icon name="MessageSquare" size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Богдан
              </h1>
              <p className="text-sm text-slate-500 font-medium">Персональный помощник</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentPage === 'chat' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettingsDialog(true)}
                className="rounded-xl hover:bg-slate-100"
              >
                <Icon name="Sliders" size={20} className="text-slate-600" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (adminControls.isAuthenticated) {
                  adminControls.handleAdminLogout();
                } else {
                  adminControls.setShowAdminDialog(true);
                }
              }}
              className="rounded-xl hover:bg-slate-100"
            >
              <Icon name={adminControls.isAuthenticated ? 'LogOut' : 'Settings'} size={20} className="text-slate-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'team' && <TeamPage />}
        {currentPage === 'docs' && <DocsPage />}
        {currentPage === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <SessionManager
                sessions={sessionManager.chatSessions}
                currentSessionId={sessionManager.currentSessionId}
                onCreateSession={handleCreateNewSession}
                onSwitchSession={handleSwitchSession}
                onDeleteSession={handleDeleteSession}
                onRenameSession={sessionManager.renameSession}
                onExportAll={sessionManager.exportAllSessions}
                onImport={sessionManager.importSessions}
              />
              <StatsPanel
                stats={chatLogic.stats}
                modelInfo={modelInfo}
                onClearStats={() => adminControls.clearStats(chatLogic.setStats)}
              />
              <QuickPrompts
                onSelectPrompt={(prompt) => chatLogic.setInputMessage(prompt)}
              />
            </div>

            <div className={adminControls.isAuthenticated ? 'lg:col-span-4' : 'lg:col-span-5'}>
              <EnhancedChatArea
                messages={chatLogic.messages}
                currentModel={chatLogic.currentModel}
                selectedModel={chatLogic.selectedModel}
                isLoading={chatLogic.isLoading}
                inputMessage={chatLogic.inputMessage}
                isListening={voiceControl.isListening}
                isSpeaking={voiceControl.isSpeaking}
                showSearch={showSearch}
                searchQuery={searchQuery}
                filteredMessages={filteredMessages}
                modelInfo={modelInfo}
                onInputChange={chatLogic.setInputMessage}
                onSendMessage={chatLogic.handleSendMessage}
                onExportChat={chatLogic.exportChat}
                onClearHistory={chatLogic.clearHistory}
                onStartListening={() => voiceControl.startListening(chatLogic.setInputMessage)}
                onStopListening={voiceControl.stopListening}
                onSpeak={voiceControl.speakText}
                onCopyMessage={chatLogic.copyMessageToClipboard}
                onRegenerateResponse={chatLogic.regenerateResponse}
                onAddReaction={chatLogic.addReaction}
                onToggleSearch={() => setShowSearch(!showSearch)}
                onSearchChange={setSearchQuery}
                onSelectSearchResult={(id) => {
                  const element = document.getElementById(`message-${id}`);
                  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                onModelSelect={chatLogic.setSelectedModel}
                onFileUpload={chatLogic.handleFileUpload}
                fileInputRef={fileInputRef}
              />
            </div>

            {adminControls.isAuthenticated && (
              <AdminPanel
                apiConfig={chatLogic.apiConfig}
                stats={chatLogic.stats}
                modelInfo={modelInfo}
                onAPIKeyChange={(model, key) => 
                  adminControls.handleAPIKeyChange(model, key, chatLogic.apiConfig, chatLogic.setApiConfig)
                }
                onToggleModel={(model, enabled) => 
                  adminControls.handleToggleModel(model, enabled, chatLogic.apiConfig, chatLogic.setApiConfig)
                }
                onSaveSettings={() => adminControls.saveSettings(chatLogic.apiConfig)}
                onClearStats={() => adminControls.clearStats(chatLogic.setStats)}
              />
            )}
          </div>
        )}
      </div>

      <AdminLoginDialog
        open={adminControls.showAdminDialog}
        onOpenChange={adminControls.setShowAdminDialog}
        passwordInput={adminControls.passwordInput}
        onPasswordChange={adminControls.setPasswordInput}
        onLogin={adminControls.handleAdminLogin}
      />

      <EnhancedSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        settings={chatLogic.settings}
        onSettingsChange={chatLogic.setSettings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}