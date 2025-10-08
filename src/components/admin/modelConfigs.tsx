export const modelConfigs = {
  gemini: {
    title: 'Gemini Flash (Скорость)',
    subtitle: 'google/gemini-flash-1.5-8b',
    iconName: 'Zap',
    colorClass: 'from-blue-500 to-blue-600',
    instructionColor: 'blue',
    instructionContent: (
      <>
        <p className="text-sm text-blue-900 font-semibold">📝 Инструкция:</p>
        <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
          <li>Перейдите на <a href="https://openrouter.ai/keys" target="_blank" rel="noopener" className="underline font-semibold">OpenRouter.ai</a></li>
          <li>Войдите через Google/GitHub</li>
          <li>Нажмите "Create Key"</li>
          <li>Скопируйте ключ (начинается с sk-or-v1-)</li>
          <li>Вставьте его в поле выше</li>
        </ol>
      </>
    ),
  },
  llama: {
    title: 'Llama 3.1 (Точность)',
    subtitle: 'meta-llama/llama-3.1-8b-instruct',
    iconName: 'Target',
    colorClass: 'from-purple-500 to-purple-600',
    instructionColor: 'purple',
    instructionContent: (
      <p className="text-sm text-purple-800">
        🔑 Используйте тот же OpenRouter ключ, что и для Gemini
      </p>
    ),
  },
  gigachat: {
    title: 'GigaChat (Креатив)',
    subtitle: 'GigaChat от Сбера',
    iconName: 'Sparkles',
    colorClass: 'from-green-500 to-green-600',
    keyLabel: 'GigaChat Client Secret (Base64)',
    placeholder: 'MDE5OWMwNmEt...',
    instructionColor: 'amber',
    instructionContent: (
      <>
        <p className="text-sm text-amber-800 mb-2">
          ⚠️ <strong>Внимание:</strong> GigaChat API может работать медленно (15-30 сек)
        </p>
        <p className="text-sm text-amber-700">
          <a href="https://developers.sber.ru/studio/workspaces" target="_blank" rel="noopener" className="underline font-semibold">
            Получить ключ на Sber AI Studio →
          </a>
        </p>
      </>
    ),
  },
  phi: {
    title: 'Phi-3.5 (Компактность)',
    subtitle: 'microsoft/phi-3.5-mini-128k-instruct',
    iconName: 'Brain',
    colorClass: 'from-indigo-500 to-indigo-600',
    instructionColor: 'indigo',
    instructionContent: (
      <p className="text-sm text-indigo-800">
        🔑 Используйте тот же OpenRouter ключ
      </p>
    ),
  },
  qwen: {
    title: 'Qwen 2.5 (Баланс)',
    subtitle: 'qwen/qwen-2.5-7b-instruct',
    iconName: 'Cpu',
    colorClass: 'from-orange-500 to-orange-600',
    instructionColor: 'orange',
    instructionContent: (
      <p className="text-sm text-orange-800">
        🔑 Используйте тот же OpenRouter ключ
      </p>
    ),
  },
  mistral: {
    title: 'Mistral Nemo (Эффективность)',
    subtitle: 'mistralai/mistral-nemo',
    iconName: 'Rocket',
    colorClass: 'from-rose-500 to-rose-600',
    instructionColor: 'rose',
    instructionContent: (
      <p className="text-sm text-rose-800">
        🔑 Используйте тот же OpenRouter ключ
      </p>
    ),
  },
};
