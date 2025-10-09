import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import SimpleSettings from '@/components/SimpleSettings';
import KnowledgeBasePanel from '@/components/KnowledgeBasePanel';
import { useSimpleChat } from '@/hooks/useSimpleChat';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function SimpleChat() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    apiKey,
    setApiKey,
    handleSendMessage,
    clearHistory,
  } = useSimpleChat();

  const [showSettings, setShowSettings] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Icon name="Sparkles" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">AI Ассистент</h1>
            <p className="text-xs text-slate-500">Работает на OpenRouter</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowKnowledgeBase(true)}
            title="База знаний"
          >
            <Icon name="Database" size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={clearHistory}
            title="Очистить историю"
          >
            <Icon name="Trash2" size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettings(true)}
            title="Настройки API"
          >
            <Icon name="Settings" size={18} />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Sparkles" size={24} className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-800">Что я умею</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <Icon name="MessageSquare" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Общение и консультации</h3>
                    <p className="text-sm text-slate-600">Отвечаю на вопросы, объясняю сложные темы простым языком</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <Icon name="Code" size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Помощь с кодом</h3>
                    <p className="text-sm text-slate-600">Пишу, исправляю и объясняю код на разных языках программирования</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <Icon name="FileText" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Создание текстов</h3>
                    <p className="text-sm text-slate-600">Помогаю писать статьи, письма, резюме и другие тексты</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <Icon name="Lightbulb" size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Генерация идей</h3>
                    <p className="text-sm text-slate-600">Помогаю придумывать креативные решения и концепции</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                  <Icon name="Languages" size={20} className="text-pink-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Перевод текстов</h3>
                    <p className="text-sm text-slate-600">Перевожу между языками и помогаю с изучением</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                  <Icon name="Calculator" size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Решение задач</h3>
                    <p className="text-sm text-slate-600">Помогаю с математикой, логикой и аналитикой</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl">
                  <Icon name="BookOpen" size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Обучение</h3>
                    <p className="text-sm text-slate-600">Объясняю новые темы, помогаю готовиться к экзаменам</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                  <Icon name="Search" size={20} className="text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Поиск информации</h3>
                    <p className="text-sm text-slate-600">Нахожу и структурирую информацию по вашему запросу</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                <p className="text-sm font-medium mb-2">💡 Совет для начала работы:</p>
                <p className="text-sm opacity-90">Просто напишите мне что угодно! Я работаю на нескольких бесплатных AI-моделях и автоматически выберу лучшую для вашего запроса.</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Bot" size={16} className="text-white" />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: ru })}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={16} className="text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Icon name="Bot" size={16} className="text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="resize-none min-h-[60px]"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="h-[60px] px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>

      {showSettings && (
        <SimpleSettings
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showKnowledgeBase && (
        <KnowledgeBasePanel
          userId="default"
          onClose={() => setShowKnowledgeBase(false)}
        />
      )}
    </div>
  );
}