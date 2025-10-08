import { useState, useEffect, useRef } from 'react';
import { Tabs } from '@/components/ui/tabs';
import PageHeader from '@/components/layout/PageHeader';
import ChatHeader from '@/components/layout/ChatHeader';
import TabNavigation from '@/components/layout/TabNavigation';
import MobileTabMenu from '@/components/layout/MobileTabMenu';
import ChatTabContent from '@/components/tabs/ChatTabContent';
import AllTabsContent from '@/components/tabs/AllTabsContent';
import AdminLoginDialog from '@/components/dialogs/AdminLoginDialog';
import EnhancedSettingsDialog from '@/components/dialogs/EnhancedSettingsDialog';
import AdminPanelOverlay from '@/components/dialogs/AdminPanelOverlay';
import AboutPage from '@/components/AboutPage';
import FeaturesPage from '@/components/FeaturesPage';
import TeamPage from '@/components/TeamPage';
import DocsPage from '@/components/DocsPage';
import { useChatLogic } from '@/hooks/useChatLogic';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useAdminControls } from '@/hooks/useAdminControls';
import { useToast } from '@/hooks/use-toast';
import ThemeModeIndicator from '@/components/ThemeModeIndicator';

const modelInfo = {
  gemini: { name: 'Режим Скорость', fullName: 'Быстрые ответы для повседневных задач', color: 'from-blue-500 to-blue-600', icon: 'Zap' },
  llama: { name: 'Режим Точность', fullName: 'Детальный анализ сложных вопросов', color: 'from-purple-500 to-purple-600', icon: 'Target' },
  gigachat: { name: 'Режим Креатив', fullName: 'Творческие и нестандартные решения', color: 'from-green-500 to-green-600', icon: 'Lightbulb' },
};

export default function Index() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState('chat');
  const [activeTab, setActiveTab] = useState('chat');
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(window.innerWidth < 1024);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [voiceLang, setVoiceLang] = useState('ru-RU');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark-mode');
    const autoMode = localStorage.getItem('auto-dark-mode');
    
    if (autoMode === 'true') {
      const hour = new Date().getHours();
      return hour >= 19 || hour < 7;
    }
    
    return saved ? JSON.parse(saved) : false;
  });
  const [autoMode, setAutoMode] = useState(() => {
    const saved = localStorage.getItem('auto-dark-mode');
    return saved === 'true';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('dark-mode', JSON.stringify(isDarkMode));
    localStorage.setItem('auto-dark-mode', JSON.stringify(autoMode));
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, autoMode]);

  useEffect(() => {
    if (!autoMode) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      const shouldBeDark = hour >= 19 || hour < 7;
      
      if (shouldBeDark !== isDarkMode) {
        setIsDarkMode(shouldBeDark);
        toast({
          title: shouldBeDark ? '🌙 Тёмная тема включена' : '☀️ Светлая тема включена',
          description: 'Автоматическое переключение по времени суток',
        });
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, [autoMode, isDarkMode, toast]);

  const toggleAutoMode = () => {
    const newAutoMode = !autoMode;
    setAutoMode(newAutoMode);
    
    if (newAutoMode) {
      const hour = new Date().getHours();
      const shouldBeDark = hour >= 19 || hour < 7;
      setIsDarkMode(shouldBeDark);
      
      toast({
        title: '🌟 Авторежим включён',
        description: `Тема будет меняться: 🌙 19:00-7:00 (тёмная), ☀️ 7:00-19:00 (светлая)`,
      });
    } else {
      toast({
        title: '🔒 Авторежим выключён',
        description: 'Теперь тема переключается вручную',
      });
    }
  };

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
          case 'd':
            e.preventDefault();
            setIsDarkMode(!isDarkMode);
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

  const handleSaveSettings = () => {
    localStorage.setItem('ai-settings', JSON.stringify(chatLogic.settings));
    setShowSettingsDialog(false);
    toast({
      title: 'Настройки сохранены',
      description: 'Параметры помощника обновлены',
    });
  };

  const handleAdminClick = () => {
    if (adminControls.isAuthenticated) {
      setShowAdminPanel(!showAdminPanel);
    } else {
      adminControls.setShowAdminDialog(true);
    }
  };

  if (currentPage !== 'chat') {
    return (
      <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'}`}>
        <PageHeader 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          onSettingsClick={() => setShowSettingsDialog(true)}
          onAdminClick={handleAdminClick}
          isAdminAuthenticated={adminControls.isAuthenticated}
          isDarkMode={isDarkMode}
          autoMode={autoMode}
          onToggleDarkMode={() => {
            if (autoMode) {
              toast({
                title: '⚠️ Авторежим включён',
                description: 'Выключите авторежим для ручного управления',
                variant: 'destructive',
              });
            } else {
              setIsDarkMode(!isDarkMode);
            }
          }}
          onToggleAutoMode={toggleAutoMode}
        />
        <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 max-w-7xl">
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'features' && <FeaturesPage />}
          {currentPage === 'team' && <TeamPage />}
          {currentPage === 'docs' && <DocsPage />}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'}`}>
      <ChatHeader
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onSettingsClick={() => setShowSettingsDialog(true)}
        onAdminClick={handleAdminClick}
        isAdminAuthenticated={adminControls.isAuthenticated}
        showAdminPanel={showAdminPanel}
        isDarkMode={isDarkMode}
        autoMode={autoMode}
        onToggleDarkMode={() => {
          if (autoMode) {
            toast({
              title: '⚠️ Авторежим включён',
              description: 'Выключите авторежим для ручного управления',
              variant: 'destructive',
            });
          } else {
            setIsDarkMode(!isDarkMode);
          }
        }}
        onToggleAutoMode={toggleAutoMode}
      />

      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 max-w-[1600px]">
        <div className="hidden sm:flex items-center justify-center gap-3 mb-2">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <ThemeModeIndicator autoMode={autoMode} isDarkMode={isDarkMode} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ChatTabContent
            leftPanelCollapsed={leftPanelCollapsed}
            sessions={sessionManager.chatSessions}
            currentSessionId={sessionManager.currentSessionId}
            stats={chatLogic.stats}
            modelInfo={modelInfo}
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
            fileInputRef={fileInputRef}
            onToggleCollapse={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            onCreateSession={handleCreateNewSession}
            onSwitchSession={handleSwitchSession}
            onClearStats={() => adminControls.clearStats(chatLogic.setStats)}
            onInputChange={chatLogic.setInputMessage}
            onSendMessage={chatLogic.handleSendMessage}
            onExportChat={chatLogic.exportChat}
            onClearHistory={chatLogic.clearHistory}
            onStartListening={() => voiceControl.startListening(chatLogic.setInputMessage)}
            onStopListening={voiceControl.stopListening}
            onSpeak={(text, lang) => voiceControl.speakText(text, lang || voiceLang)}
            voiceLang={voiceLang}
            onVoiceLangChange={setVoiceLang}
            voiceRate={voiceControl.voiceRate}
            voicePitch={voiceControl.voicePitch}
            onVoiceRateChange={voiceControl.setVoiceRate}
            onVoicePitchChange={voiceControl.setVoicePitch}
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
            onVoiceMessageSend={chatLogic.handleVoiceMessageSend}
          />

          <AllTabsContent
            messagesCount={chatLogic.messages.length}
            sessionsCount={sessionManager.chatSessions.length}
          />
        </Tabs>
        
        <MobileTabMenu activeTab={activeTab} onTabChange={setActiveTab} />
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

      <AdminPanelOverlay
        show={showAdminPanel && adminControls.isAuthenticated}
        apiConfig={chatLogic.apiConfig}
        onClose={() => setShowAdminPanel(false)}
        onAPIKeyChange={(model, key) => 
          adminControls.handleAPIKeyChange(model, key, chatLogic.apiConfig, chatLogic.setApiConfig)
        }
        onToggleModel={(model, enabled) => 
          adminControls.handleToggleModel(model, enabled, chatLogic.apiConfig, chatLogic.setApiConfig)
        }
        onSaveSettings={() => {
          adminControls.saveSettings(chatLogic.apiConfig);
          setShowAdminPanel(false);
        }}
      />
    </div>
  );
}