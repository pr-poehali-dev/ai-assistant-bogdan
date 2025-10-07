import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type AIModel = 'gemini' | 'llama' | 'gigachat';

interface APIConfig {
  gemini: { key: string; enabled: boolean };
  llama: { key: string; enabled: boolean };
  gigachat: { key: string; enabled: boolean };
}

const ADMIN_PASSWORD = 'admin123';

const modelInfo = {
  gemini: { name: 'Режим Скорость', fullName: 'Быстрые ответы', color: 'from-blue-500 to-blue-600', icon: 'Zap' },
  llama: { name: 'Режим Точность', fullName: 'Детальный анализ', color: 'from-purple-500 to-purple-600', icon: 'Target' },
  gigachat: { name: 'Режим Креатив', fullName: 'Творческие решения', color: 'from-green-500 to-green-600', icon: 'Lightbulb' },
};

export function useAdminControls() {
  const { toast } = useToast();
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAdminLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowAdminDialog(false);
      setPasswordInput('');
      toast({
        title: 'Успешный вход',
        description: 'Добро пожаловать в панель управления',
      });
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный пароль',
        variant: 'destructive',
      });
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: 'Выход выполнен',
      description: 'Вы вышли из панели управления',
    });
  };

  const handleAPIKeyChange = (
    model: AIModel, 
    key: string, 
    apiConfig: APIConfig, 
    setApiConfig: (config: APIConfig) => void
  ) => {
    setApiConfig({
      ...apiConfig,
      [model]: { ...apiConfig[model], key },
    });
  };

  const handleToggleModel = (
    model: AIModel, 
    enabled: boolean, 
    apiConfig: APIConfig, 
    setApiConfig: (config: APIConfig) => void
  ) => {
    setApiConfig({
      ...apiConfig,
      [model]: { ...apiConfig[model], enabled },
    });
    toast({
      title: enabled ? 'Режим включен' : 'Режим отключен',
      description: `${modelInfo[model].name} ${enabled ? 'активирована' : 'деактивирована'}`,
    });
  };

  const saveSettings = (apiConfig: APIConfig) => {
    localStorage.setItem('ai-config', JSON.stringify(apiConfig));
    toast({
      title: 'Настройки сохранены',
      description: 'Конфигурация успешно обновлена',
    });
  };

  const clearStats = (setStats: (stats: any) => void) => {
    setStats({ gemini: 0, llama: 0, gigachat: 0 });
    toast({
      title: 'Статистика сброшена',
      description: 'Счетчики использования обнулены',
    });
  };

  return {
    showAdminDialog,
    setShowAdminDialog,
    passwordInput,
    setPasswordInput,
    isAuthenticated,
    handleAdminLogin,
    handleAdminLogout,
    handleAPIKeyChange,
    handleToggleModel,
    saveSettings,
    clearStats,
  };
}