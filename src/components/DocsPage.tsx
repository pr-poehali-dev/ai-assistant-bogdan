import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Документация
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Полное руководство по использованию платформы Богдан
        </p>
      </div>

      <Tabs defaultValue="quick-start" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="quick-start" className="rounded-lg">
            Быстрый старт
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="rounded-lg">
            API Ключи
          </TabsTrigger>
          <TabsTrigger value="features" className="rounded-lg">
            Функции
          </TabsTrigger>
          <TabsTrigger value="faq" className="rounded-lg">
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick-start" className="mt-6 space-y-6">
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="Play" size={24} className="text-blue-600" />
              Начало работы
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Получите API ключи
                  </h3>
                  <p className="text-slate-600">
                    Зарегистрируйтесь на платформах провайдеров для получения API ключей
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Настройте режимы</h3>
                  <p className="text-slate-600">
                    Откройте панель управления (иконка настроек) и введите ваши API ключи для
                    каждого режима работы
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Начните общаться</h3>
                  <p className="text-slate-600">
                    Введите ваш вопрос в поле ввода и получите ответ. Система
                    автоматически выберет оптимальный режим работы
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="mt-6 space-y-6">
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="Key" size={24} className="text-blue-600" />
              Как получить API ключи
            </h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                  <Badge className="bg-blue-500">Режим Скорость</Badge>
                  Быстрые ответы
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-600">
                  <li>Перейдите на aistudio.google.com</li>
                  <li>Войдите через Google аккаунт</li>
                  <li>Нажмите "Get API Key"</li>
                  <li>Скопируйте ключ и вставьте в настройки Богдана</li>
                </ol>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                  <Badge className="bg-purple-500">Режим Точность</Badge>
                  Детальный анализ
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-600">
                  <li>Зарегистрируйтесь на api.together.xyz</li>
                  <li>Подтвердите email</li>
                  <li>В разделе API Keys создайте новый ключ</li>
                  <li>Скопируйте и добавьте в настройки</li>
                </ol>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                  <Badge className="bg-green-500">Режим Креатив</Badge>
                  Творческие решения
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-600">
                  <li>Перейдите на developers.sber.ru/gigachat</li>
                  <li>Авторизуйтесь через Сбер ID</li>
                  <li>Создайте новый проект</li>
                  <li>Получите Client ID и Secret</li>
                  <li>Объедините в формате Base64(client_id:secret)</li>
                </ol>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6 space-y-6">
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Основные функции</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Icon name="Mic" size={18} className="text-blue-600" />
                  Голосовой ввод
                </h3>
                <p className="text-slate-600">
                  Нажмите на иконку микрофона рядом с полем ввода и начните говорить. Система
                  автоматически распознает речь и конвертирует в текст.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Icon name="Volume2" size={18} className="text-blue-600" />
                  Озвучивание ответов
                </h3>
                <p className="text-slate-600">
                  Кликните на иконку динамика в сообщении AI, чтобы услышать ответ голосом.
                  Поддерживается несколько языков.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Icon name="Sliders" size={18} className="text-blue-600" />
                  Настройки AI
                </h3>
                <p className="text-slate-600">
                  Регулируйте температуру (креативность), максимальное количество токенов
                  (длина ответа) и задавайте системные промпты для более точного поведения AI.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6 space-y-6">
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Безопасны ли мои API ключи?
                </h3>
                <p className="text-slate-600">
                  Да! Все ключи хранятся только в вашем браузере (LocalStorage) и никогда не
                  отправляются на наши серверы.
                </p>
              </div>

              <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Какие режимы доступны бесплатно?
                </h3>
                <p className="text-slate-600">
                  Все три режима работы доступны в бесплатных тарифах провайдеров с определенными лимитами на количество запросов.
                </p>
              </div>

              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Сохраняется ли история чата?
                </h3>
                <p className="text-slate-600">
                  Да, история автоматически сохраняется локально. Вы можете экспортировать её
                  в текстовый файл или очистить в любой момент.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}