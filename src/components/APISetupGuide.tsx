import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function APISetupGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Icon name="BookOpen" size={14} />
          Инструкция по настройке
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="BookOpen" size={20} />
            Как получить бесплатные API ключи
          </DialogTitle>
          <DialogDescription>
            Пошаговые инструкции для каждого ИИ-сервиса
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="gemini" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
            <TabsTrigger value="llama">Llama</TabsTrigger>
            <TabsTrigger value="gigachat">GigaChat</TabsTrigger>
          </TabsList>

          <TabsContent value="gemini" className="space-y-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Icon name="Zap" size={20} className="text-blue-600" />
                Google Gemini 2.0 Flash
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Перейдите на сайт</p>
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline flex items-center gap-1 mt-1"
                    >
                      Google AI Studio
                      <Icon name="ExternalLink" size={12} />
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Войдите через Google аккаунт</p>
                    <p className="text-slate-600 mt-1">Используйте любой Gmail</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Нажмите "Get API key"</p>
                    <p className="text-slate-600 mt-1">Или "Create API key in new project"</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Скопируйте API ключ</p>
                    <p className="text-slate-600 mt-1">Формат: AIzaSy... (39 символов)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <p className="font-semibold">Вставьте ключ в панель управления</p>
                    <p className="text-slate-600 mt-1">Включите режим "Скорость" и протестируйте</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-xs text-slate-700">
                  <Icon name="Gift" size={12} className="inline mr-1" />
                  <strong>Бесплатно:</strong> 1500 запросов в день
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="llama" className="space-y-4">
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Icon name="Target" size={20} className="text-purple-600" />
                Meta Llama 3.3 70B
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Зарегистрируйтесь</p>
                    <a
                      href="https://api.together.xyz/signup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline flex items-center gap-1 mt-1"
                    >
                      Together AI
                      <Icon name="ExternalLink" size={12} />
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Подтвердите email</p>
                    <p className="text-slate-600 mt-1">Проверьте почту и кликните на ссылку</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Перейдите в Settings → API Keys</p>
                    <p className="text-slate-600 mt-1">Левое меню в личном кабинете</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Создайте новый ключ</p>
                    <p className="text-slate-600 mt-1">Нажмите "+ Add API Key"</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <p className="font-semibold">Скопируйте ключ</p>
                    <p className="text-slate-600 mt-1">Формат начинается с цифр и букв (64+ символов)</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-xs text-slate-700">
                  <Icon name="Gift" size={12} className="inline mr-1" />
                  <strong>Бесплатно:</strong> $5 кредитов при регистрации
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gigachat" className="space-y-4">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Icon name="Lightbulb" size={20} className="text-green-600" />
                Sber GigaChat
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Перейдите на портал</p>
                    <a
                      href="https://developers.sber.ru/studio/workspaces"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline flex items-center gap-1 mt-1"
                    >
                      Sber AI Developers
                      <Icon name="ExternalLink" size={12} />
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Авторизуйтесь через Sber ID</p>
                    <p className="text-slate-600 mt-1">Нужен российский номер телефона</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Создайте проект GigaChat API</p>
                    <p className="text-slate-600 mt-1">Выберите "Физическое лицо"</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Получите Client Secret</p>
                    <p className="text-slate-600 mt-1">Скопируйте значение в формате Base64</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <p className="font-semibold">Вставьте в панель управления</p>
                    <p className="text-slate-600 mt-1">Включите режим "Креатив"</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-xs text-slate-700">
                  <Icon name="Gift" size={12} className="inline mr-1" />
                  <strong>Бесплатно:</strong> Версия для физ. лиц
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 mt-4">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Icon name="Lightbulb" size={16} className="text-amber-600" />
            Рекомендации
          </h4>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li>Начните с Gemini — проще всего получить ключ</li>
            <li>Настройте 2-3 режима для резервирования</li>
            <li>Используйте кнопку "Протестировать" после настройки</li>
            <li>Храните ключи в безопасности, не делитесь ими</li>
          </ul>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
