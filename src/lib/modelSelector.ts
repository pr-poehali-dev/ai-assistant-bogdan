type AIModel = 'gemini' | 'llama' | 'gigachat' | 'phi' | 'qwen' | 'mistral';

interface ModelCapabilities {
  speed: number;
  accuracy: number;
  creativity: number;
  codeQuality: number;
  contextSize: number;
}

const modelCapabilities: Record<AIModel, ModelCapabilities> = {
  gemini: {
    speed: 9,
    accuracy: 7,
    creativity: 6,
    codeQuality: 8,
    contextSize: 8,
  },
  llama: {
    speed: 6,
    accuracy: 9,
    creativity: 7,
    codeQuality: 9,
    contextSize: 9,
  },
  gigachat: {
    speed: 7,
    accuracy: 7,
    creativity: 9,
    codeQuality: 6,
    contextSize: 7,
  },
  phi: {
    speed: 8,
    accuracy: 6,
    creativity: 5,
    codeQuality: 7,
    contextSize: 6,
  },
  qwen: {
    speed: 8,
    accuracy: 8,
    creativity: 7,
    codeQuality: 8,
    contextSize: 8,
  },
  mistral: {
    speed: 9,
    accuracy: 7,
    creativity: 6,
    codeQuality: 7,
    contextSize: 7,
  },
};

interface QueryAnalysis {
  type: 'code' | 'creative' | 'analytical' | 'general' | 'long-context';
  keywords: string[];
}

function analyzeQuery(query: string): QueryAnalysis {
  const lowerQuery = query.toLowerCase();
  
  const codeKeywords = ['код', 'функци', 'класс', 'компонент', 'баг', 'ошибка', 'typescript', 'javascript', 'python', 'react', 'исправ', 'debug', 'api', 'endpoint'];
  const creativeKeywords = ['созда', 'напиши', 'придума', 'идея', 'дизайн', 'текст', 'история', 'статья', 'контент', 'пост'];
  const analyticalKeywords = ['анализ', 'сравни', 'объясни', 'почему', 'как работает', 'причина', 'следстви', 'детально', 'подробно'];
  const longContextKeywords = ['весь', 'все файлы', 'целиком', 'полностью', 'проект', 'документ'];
  
  const hasCodeKeywords = codeKeywords.some(kw => lowerQuery.includes(kw));
  const hasCreativeKeywords = creativeKeywords.some(kw => lowerQuery.includes(kw));
  const hasAnalyticalKeywords = analyticalKeywords.some(kw => lowerQuery.includes(kw));
  const hasLongContext = longContextKeywords.some(kw => lowerQuery.includes(kw)) || query.length > 500;
  
  if (hasCodeKeywords) {
    return { type: 'code', keywords: codeKeywords.filter(kw => lowerQuery.includes(kw)) };
  }
  if (hasCreativeKeywords) {
    return { type: 'creative', keywords: creativeKeywords.filter(kw => lowerQuery.includes(kw)) };
  }
  if (hasAnalyticalKeywords) {
    return { type: 'analytical', keywords: analyticalKeywords.filter(kw => lowerQuery.includes(kw)) };
  }
  if (hasLongContext) {
    return { type: 'long-context', keywords: longContextKeywords.filter(kw => lowerQuery.includes(kw)) };
  }
  
  return { type: 'general', keywords: [] };
}

export function selectBestModel(query: string, enabledModels: AIModel[]): { model: AIModel; reason: string } {
  if (enabledModels.length === 0) {
    return { model: 'gemini', reason: 'Нет доступных моделей' };
  }
  
  if (enabledModels.length === 1) {
    return { model: enabledModels[0], reason: 'Единственная доступная модель' };
  }
  
  const analysis = analyzeQuery(query);
  
  const scores = enabledModels.map(model => {
    const cap = modelCapabilities[model];
    let score = 0;
    let reason = '';
    
    switch (analysis.type) {
      case 'code':
        score = cap.codeQuality * 0.5 + cap.accuracy * 0.3 + cap.speed * 0.2;
        reason = 'Код и техническая точность';
        break;
      case 'creative':
        score = cap.creativity * 0.6 + cap.speed * 0.3 + cap.accuracy * 0.1;
        reason = 'Креативность и генерация идей';
        break;
      case 'analytical':
        score = cap.accuracy * 0.6 + cap.contextSize * 0.3 + cap.codeQuality * 0.1;
        reason = 'Детальный анализ';
        break;
      case 'long-context':
        score = cap.contextSize * 0.7 + cap.accuracy * 0.2 + cap.speed * 0.1;
        reason = 'Большой контекст';
        break;
      case 'general':
      default:
        score = cap.speed * 0.4 + cap.accuracy * 0.3 + cap.creativity * 0.3;
        reason = 'Универсальный запрос';
        break;
    }
    
    return { model, score, reason };
  });
  
  scores.sort((a, b) => b.score - a.score);
  
  return { model: scores[0].model, reason: scores[0].reason };
}

export function getModelDisplayName(model: AIModel): string {
  const names: Record<AIModel, string> = {
    gemini: 'Gemini (Скорость)',
    llama: 'Llama (Точность)',
    gigachat: 'GigaChat (Креатив)',
    phi: 'Phi (Компактность)',
    qwen: 'Qwen (Баланс)',
    mistral: 'Mistral (Эффективность)',
  };
  return names[model];
}
