import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const VOICE_LANGUAGES = [
  { code: 'ru-RU', name: '🇷🇺 Русский' },
  { code: 'en-US', name: '🇺🇸 Английский' },
  { code: 'es-ES', name: '🇪🇸 Испанский' },
  { code: 'fr-FR', name: '🇫🇷 Французский' },
  { code: 'de-DE', name: '🇩🇪 Немецкий' },
  { code: 'it-IT', name: '🇮🇹 Итальянский' },
  { code: 'pt-PT', name: '🇵🇹 Португальский' },
  { code: 'zh-CN', name: '🇨🇳 Китайский' },
  { code: 'ja-JP', name: '🇯🇵 Японский' },
  { code: 'ko-KR', name: '🇰🇷 Корейский' },
];

const LANGUAGES = [
  { code: 'en', name: 'Английский', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Испанский', flag: '🇪🇸' },
  { code: 'fr', name: 'Французский', flag: '🇫🇷' },
  { code: 'de', name: 'Немецкий', flag: '🇩🇪' },
  { code: 'it', name: 'Итальянский', flag: '🇮🇹' },
  { code: 'pt', name: 'Португальский', flag: '🇵🇹' },
  { code: 'zh', name: 'Китайский', flag: '🇨🇳' },
  { code: 'ja', name: 'Японский', flag: '🇯🇵' },
  { code: 'ko', name: 'Корейский', flag: '🇰🇷' },
  { code: 'ar', name: 'Арабский', flag: '🇸🇦' },
  { code: 'hi', name: 'Хинди', flag: '🇮🇳' },
  { code: 'tr', name: 'Турецкий', flag: '🇹🇷' },
  { code: 'pl', name: 'Польский', flag: '🇵🇱' },
  { code: 'uk', name: 'Украинский', flag: '🇺🇦' },
  { code: 'nl', name: 'Нидерландский', flag: '🇳🇱' },
  { code: 'sv', name: 'Шведский', flag: '🇸🇪' },
  { code: 'fi', name: 'Финский', flag: '🇫🇮' },
  { code: 'da', name: 'Датский', flag: '🇩🇰' },
  { code: 'no', name: 'Норвежский', flag: '🇳🇴' },
  { code: 'cs', name: 'Чешский', flag: '🇨🇿' },
  { code: 'el', name: 'Греческий', flag: '🇬🇷' },
  { code: 'he', name: 'Иврит', flag: '🇮🇱' },
  { code: 'th', name: 'Тайский', flag: '🇹🇭' },
  { code: 'vi', name: 'Вьетнамский', flag: '🇻🇳' },
  { code: 'id', name: 'Индонезийский', flag: '🇮🇩' },
  { code: 'ms', name: 'Малайский', flag: '🇲🇾' },
  { code: 'fa', name: 'Персидский', flag: '🇮🇷' },
  { code: 'bn', name: 'Бенгальский', flag: '🇧🇩' },
  { code: 'ro', name: 'Румынский', flag: '🇷🇴' },
  { code: 'hu', name: 'Венгерский', flag: '🇭🇺' },
  { code: 'sk', name: 'Словацкий', flag: '🇸🇰' },
  { code: 'bg', name: 'Болгарский', flag: '🇧🇬' },
  { code: 'hr', name: 'Хорватский', flag: '🇭🇷' },
  { code: 'sr', name: 'Сербский', flag: '🇷🇸' },
  { code: 'sl', name: 'Словенский', flag: '🇸🇮' },
  { code: 'lt', name: 'Литовский', flag: '🇱🇹' },
  { code: 'lv', name: 'Латышский', flag: '🇱🇻' },
  { code: 'et', name: 'Эстонский', flag: '🇪🇪' },
  { code: 'is', name: 'Исландский', flag: '🇮🇸' },
  { code: 'ga', name: 'Ирландский', flag: '🇮🇪' },
  { code: 'mt', name: 'Мальтийский', flag: '🇲🇹' },
  { code: 'sq', name: 'Албанский', flag: '🇦🇱' },
  { code: 'mk', name: 'Македонский', flag: '🇲🇰' },
  { code: 'be', name: 'Белорусский', flag: '🇧🇾' },
  { code: 'kk', name: 'Казахский', flag: '🇰🇿' },
  { code: 'uz', name: 'Узбекский', flag: '🇺🇿' },
  { code: 'hy', name: 'Армянский', flag: '🇦🇲' },
  { code: 'ka', name: 'Грузинский', flag: '🇬🇪' },
  { code: 'az', name: 'Азербайджанский', flag: '🇦🇿' },
  { code: 'ur', name: 'Урду', flag: '🇵🇰' },
  { code: 'ne', name: 'Непальский', flag: '🇳🇵' },
  { code: 'si', name: 'Сингальский', flag: '🇱🇰' },
  { code: 'km', name: 'Кхмерский', flag: '🇰🇭' },
  { code: 'lo', name: 'Лаосский', flag: '🇱🇦' },
  { code: 'my', name: 'Бирманский', flag: '🇲🇲' },
  { code: 'mn', name: 'Монгольский', flag: '🇲🇳' },
  { code: 'tl', name: 'Тагальский', flag: '🇵🇭' },
  { code: 'sw', name: 'Суахили', flag: '🇹🇿' },
  { code: 'am', name: 'Амхарский', flag: '🇪🇹' },
  { code: 'af', name: 'Африкаанс', flag: '🇿🇦' },
  { code: 'zu', name: 'Зулу', flag: '🇿🇦' },
  { code: 'xh', name: 'Коса', flag: '🇿🇦' },
  { code: 'ig', name: 'Игбо', flag: '🇳🇬' },
  { code: 'yo', name: 'Йоруба', flag: '🇳🇬' },
  { code: 'ha', name: 'Хауса', flag: '🇳🇬' },
];

export default function Translator() {
  const { toast } = useToast();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ru');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sourceVoiceLang, setSourceVoiceLang] = useState('en-US');
  const [targetVoiceLang, setTargetVoiceLang] = useState('ru-RU');

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите текст для перевода',
        variant: 'destructive',
      });
      return;
    }

    setIsTranslating(true);
    try {
      let translated = '';
      
      try {
        const googleResponse = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + sourceLang + '&tl=' + targetLang + '&dt=t&q=' + encodeURIComponent(sourceText));
        const googleData = await googleResponse.json();
        translated = googleData[0].map((item: any) => item[0]).join('');
      } catch (googleError) {
        const myMemoryResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`);
        const myMemoryData = await myMemoryResponse.json();
        
        if (myMemoryData.responseStatus === 200) {
          translated = myMemoryData.responseData.translatedText;
        } else {
          throw new Error('Все сервисы перевода недоступны');
        }
      }
      
      setTranslatedText(translated);
    } catch (error) {
      toast({
        title: 'Ошибка перевода',
        description: 'Попробуйте еще раз или проверьте соединение',
        variant: 'destructive',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeak = (text: string, lang: string) => {
    if (!text.trim()) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Icon name="Languages" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Переводчик</h1>
            <p className="text-slate-600">Перевод на 30+ языков с озвучкой</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={swapLanguages}
                className="mx-2"
              >
                <Icon name="ArrowLeftRight" size={20} />
              </Button>
            </div>

            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Введите текст..."
              className="min-h-[300px] text-base resize-none"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="flex-1 h-12 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isTranslating ? (
                  <>
                    <Icon name="Loader2" size={20} className="animate-spin" />
                    Перевод...
                  </>
                ) : (
                  <>
                    <Icon name="Languages" size={20} />
                    Перевести
                  </>
                )}
              </Button>
              <div className="flex gap-2 items-center">
                <Select value={sourceVoiceLang} onValueChange={setSourceVoiceLang}>
                  <SelectTrigger className="h-12 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSpeak(sourceText, sourceVoiceLang)}
                  disabled={!sourceText.trim() || isSpeaking}
                  className="h-12 w-12"
                >
                  <Icon name="Volume2" size={20} />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              value={translatedText}
              readOnly
              placeholder="Перевод появится здесь..."
              className="min-h-[300px] text-base resize-none bg-slate-50"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(translatedText);
                  toast({ title: 'Скопировано!' });
                }}
                disabled={!translatedText}
                className="flex-1 h-12 gap-2"
              >
                <Icon name="Copy" size={20} />
                Скопировать
              </Button>
              <div className="flex gap-2 items-center">
                <Select value={targetVoiceLang} onValueChange={setTargetVoiceLang}>
                  <SelectTrigger className="h-12 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSpeak(translatedText, targetVoiceLang)}
                  disabled={!translatedText.trim() || isSpeaking}
                  className="h-12 w-12"
                >
                  <Icon name="Volume2" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-blue-600" />
          Возможности переводчика
        </h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Поддержка 67 языков мира</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Озвучка текста на любом языке с нативным произношением</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Быстрая смена направления перевода одной кнопкой</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Копирование результата в один клик</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}