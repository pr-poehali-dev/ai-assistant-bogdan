import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function PasswordGenerator() {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const generatePassword = () => {
    let charset = '';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      toast({
        title: 'Ошибка',
        description: 'Выберите хотя бы один тип символов',
        variant: 'destructive',
      });
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({ title: 'Скопировано!', description: 'Пароль скопирован в буфер обмена' });
  };

  const getStrength = () => {
    if (!password) return { label: '', color: '', width: 0 };
    
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (password.length >= 16) strength += 10;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

    if (strength < 40) return { label: 'Слабый', color: 'bg-red-500', width: strength };
    if (strength < 70) return { label: 'Средний', color: 'bg-yellow-500', width: strength };
    return { label: 'Сильный', color: 'bg-green-500', width: strength };
  };

  const strength = getStrength();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
            <Icon name="Lock" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Генератор паролей</h1>
            <p className="text-slate-600">Создавайте надёжные пароли для защиты аккаунтов</p>
          </div>
        </div>

        {password && (
          <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <code className="flex-1 text-2xl font-mono font-bold text-slate-800 break-all">
                {password}
              </code>
              <Button onClick={copyToClipboard} size="sm" variant="outline" className="gap-2">
                <Icon name="Copy" size={16} />
                Копировать
              </Button>
            </div>
            {password && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Надёжность пароля:</span>
                  <span className={`font-semibold ${
                    strength.label === 'Слабый' ? 'text-red-600' :
                    strength.label === 'Средний' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>{strength.label}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`${strength.color} h-2 rounded-full transition-all`} style={{ width: `${strength.width}%` }} />
                </div>
              </div>
            )}
          </Card>
        )}

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700">Длина пароля: {length}</label>
            </div>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={4}
              max={64}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 block">Тип символов:</label>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="uppercase" checked={useUppercase} onCheckedChange={(checked) => setUseUppercase(checked as boolean)} />
              <label htmlFor="uppercase" className="text-sm text-slate-700 cursor-pointer">
                Заглавные буквы (A-Z)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="lowercase" checked={useLowercase} onCheckedChange={(checked) => setUseLowercase(checked as boolean)} />
              <label htmlFor="lowercase" className="text-sm text-slate-700 cursor-pointer">
                Строчные буквы (a-z)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="numbers" checked={useNumbers} onCheckedChange={(checked) => setUseNumbers(checked as boolean)} />
              <label htmlFor="numbers" className="text-sm text-slate-700 cursor-pointer">
                Цифры (0-9)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="symbols" checked={useSymbols} onCheckedChange={(checked) => setUseSymbols(checked as boolean)} />
              <label htmlFor="symbols" className="text-sm text-slate-700 cursor-pointer">
                Специальные символы (!@#$%^&*)
              </label>
            </div>
          </div>

          <Button
            onClick={generatePassword}
            className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
          >
            <Icon name="RefreshCw" size={24} />
            Сгенерировать пароль
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-blue-600" />
          Советы по безопасности
        </h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Используйте уникальные пароли для каждого сайта</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Минимальная длина пароля должна быть 12 символов</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Включайте все типы символов для максимальной защиты</span>
          </li>
          <li className="flex items-start gap-2">
            <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
            <span>Храните пароли в менеджере паролей</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
