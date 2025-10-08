import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import AIAssistants from '@/components/AIAssistants';
import KnowledgeBase from '@/components/KnowledgeBase';
import Marketplace from '@/components/Marketplace';
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
  const [activeTab, setActiveTab] = useState('chat');
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

  if (currentPage !== 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
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
                <p className="text-sm text-slate-500 font-medium">Экосистема ИИ</p>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'features' && <FeaturesPage />}
          {currentPage === 'team' && <TeamPage />}
          {currentPage === 'docs' && <DocsPage />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between max-w-[1600px]">
          <div className="flex items-center gap-3">
            <BurgerMenu onNavigate={setCurrentPage} currentPage={currentPage} />
            <div className="relative">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Icon name="Bot" size={20} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Богдан AI
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">Экосистема искусственного интеллекта</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettingsDialog(true)}
              className="rounded-xl hover:bg-slate-100"
            >
              <Icon name="Sliders" size={20} className="text-slate-600" />
            </Button>
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

      <div className="container mx-auto px-4 py-3 max-w-[1600px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-lg mb-3 max-w-3xl mx-auto">
            <TabsTrigger value="chat" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-xs">
              <Icon name="MessageSquare" size={14} className="mr-1.5" />
              Чат
            </TabsTrigger>
            <TabsTrigger value="assistants" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs">
              <Icon name="Users" size={14} className="mr-1.5" />
              Ассистенты
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white text-xs">
              <Icon name="BookOpen" size={14} className="mr-1.5" />
              База знаний
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white text-xs">
              <Icon name="ShoppingBag" size={14} className="mr-1.5" />
              Маркетплейс
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white text-xs">
              <Icon name="BarChart3" size={14} className="mr-1.5" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-0">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3 space-y-3">
                <Card className="p-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5 text-sm">
                    <Icon name="Folder" size={16} className="text-blue-600" />
                    Сессии
                  </h3>
                  <Button
                    onClick={handleCreateNewSession}
                    size="sm"
                    className="w-full gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg h-8 mb-2"
                  >
                    <Icon name="Plus" size={14} />
                    <span className="text-xs">Новая сессия</span>
                  </Button>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {sessionManager.chatSessions.slice(0, 5).map((session) => (
                      <button
                        key={session.id}
                        onClick={() => handleSwitchSession(session.id)}
                        className={`w-full p-2 rounded-lg text-left text-xs transition-colors ${
                          sessionManager.currentSessionId === session.id
                            ? 'bg-blue-100 text-blue-900 font-medium'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="truncate">{session.name}</div>
                        <div className="text-[10px] text-slate-500">{session.messages.length} сообщ.</div>
                      </button>
                    ))}
                  </div>
                </Card>
                <Card className="p-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5 text-sm">
                    <Icon name="TrendingUp" size={16} className="text-green-600" />
                    Статистика
                  </h3>
                  <StatsPanel
                    stats={chatLogic.stats}
                    modelInfo={modelInfo}
                    onClearStats={() => adminControls.clearStats(chatLogic.setStats)}
                  />
                </Card>
              </div>

              <div className="col-span-6">
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

              <div className="col-span-3 space-y-3">
                {!adminControls.isAuthenticated && Object.values(chatLogic.apiConfig).every(c => !c.key || !c.enabled) && (
                  <Card className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg">
                    <div className="flex items-start gap-2">
                      <Icon name="AlertCircle" size={16} className="text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-amber-900 text-xs mb-1">Требуется настройка</h4>
                        <Button
                          size="sm"
                          onClick={() => adminControls.setShowAdminDialog(true)}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7 w-full mt-1"
                        >
                          <Icon name="Settings" size={12} className="mr-1" />
                          Настроить
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
                <Card className="p-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5 text-sm">
                    <Icon name="Sparkles" size={16} className="text-purple-600" />
                    Быстрые действия
                  </h3>
                  <QuickPrompts
                    onSelectPrompt={(prompt) => chatLogic.setInputMessage(prompt)}
                  />
                </Card>
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
            </div>
          </TabsContent>

          <TabsContent value="assistants" className="mt-0">
            <AIAssistants />
          </TabsContent>

          <TabsContent value="knowledge" className="mt-0">
            <KnowledgeBase />
          </TabsContent>

          <TabsContent value="marketplace" className="mt-0">
            <Marketplace />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <div className="text-center space-y-4">
                <Icon name="BarChart3" size={64} className="text-blue-600 mx-auto" />
                <h2 className="text-3xl font-bold text-slate-800">Аналитика</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Детальная статистика использования, анализ эффективности запросов и персональные рекомендации
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                    <Icon name="Activity" size={32} className="text-blue-600 mb-3" />
                    <h3 className="font-bold text-xl text-slate-800 mb-2">Активность</h3>
                    <p className="text-3xl font-bold text-blue-600">{chatLogic.messages.length}</p>
                    <p className="text-sm text-slate-600 mt-1">Всего сообщений</p>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                    <Icon name="Clock" size={32} className="text-purple-600 mb-3" />
                    <h3 className="font-bold text-xl text-slate-800 mb-2">Сессии</h3>
                    <p className="text-3xl font-bold text-purple-600">{sessionManager.chatSessions.length}</p>
                    <p className="text-sm text-slate-600 mt-1">Всего диалогов</p>
                  </Card>
                  <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-0">
                    <Icon name="TrendingUp" size={32} className="text-green-600 mb-3" />
                    <h3 className="font-bold text-xl text-slate-800 mb-2">Эффективность</h3>
                    <p className="text-3xl font-bold text-green-600">98%</p>
                    <p className="text-sm text-slate-600 mt-1">Успешных ответов</p>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
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