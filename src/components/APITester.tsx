import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function APITester() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const testAPI = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите API ключ OpenRouter',
        variant: 'destructive',
      });
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      const response = await fetch('https://functions.poehali.dev/81fdec08-160f-4043-a2da-cefa0ffbdf22', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Привет! Ответь одним словом: работаю',
          models: {
            gemini: {
              key: apiKey,
              enabled: true,
            },
            llama: {
              key: apiKey,
              enabled: true,
            },
          },
          history: [],
          settings: {
            temperature: 0.7,
            max_tokens: 50,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ Успех! Модель: ${data.model}\nОтвет: ${data.response}`);
        toast({
          title: '✅ API работает!',
          description: `${data.model} ответил: ${data.response.substring(0, 50)}...`,
        });
      } else {
        setResult(`❌ Ошибка: ${data.error}`);
        toast({
          title: '❌ Ошибка API',
          description: data.error || 'Проверьте ключ',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      setResult(`❌ Ошибка сети: ${error.message}`);
      toast({
        title: '❌ Ошибка подключения',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="Zap" size={24} className="text-blue-600" />
        Тестирование API
      </h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="api-key" className="text-sm font-semibold">
            OpenRouter API Key
          </Label>
          <Input
            id="api-key"
            type="password"
            placeholder="sk-or-v1-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-slate-500 mt-1">
            Получить на{' '}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              OpenRouter.ai
            </a>
          </p>
        </div>

        <Button
          onClick={testAPI}
          disabled={testing || !apiKey.trim()}
          className="w-full gap-2"
        >
          {testing ? (
            <>
              <Icon name="Loader2" size={18} className="animate-spin" />
              Тестирование...
            </>
          ) : (
            <>
              <Icon name="Play" size={18} />
              Протестировать API
            </>
          )}
        </Button>

        {result && (
          <Card className="p-4 bg-slate-50">
            <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
          </Card>
        )}

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Что тестируется:</h3>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Подключение к backend функции через OpenRouter</li>
            <li>Проверка API ключа (работает для Gemini и Llama)</li>
            <li>Обработка таймаутов (25 сек)</li>
            <li>Fallback между моделями (Gemini → Llama)</li>
            <li>Обработка ошибок</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}