import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const ButtonCalc = ({ children, onClick, className = '', variant = 'default' }: any) => (
    <Button
      onClick={onClick}
      className={`h-16 text-xl font-semibold ${className}`}
      variant={variant}
    >
      {children}
    </Button>
  );

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
            <Icon name="Calculator" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Калькулятор</h1>
            <p className="text-slate-600">Простые и быстрые вычисления</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <div className="text-right text-5xl font-mono text-white break-all">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <ButtonCalc onClick={clear} variant="outline" className="bg-red-50 hover:bg-red-100 text-red-600">
            C
          </ButtonCalc>
          <ButtonCalc onClick={() => performOperation('%')} variant="outline">
            %
          </ButtonCalc>
          <ButtonCalc onClick={() => setDisplay(String(-parseFloat(display)))} variant="outline">
            ±
          </ButtonCalc>
          <ButtonCalc onClick={() => performOperation('÷')} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            ÷
          </ButtonCalc>

          <ButtonCalc onClick={() => inputDigit('7')}>7</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit('8')}>8</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit('9')}>9</ButtonCalc>
          <ButtonCalc onClick={() => performOperation('×')} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            ×
          </ButtonCalc>

          <ButtonCalc onClick={() => inputDigit('4')}>4</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit('5')}>5</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit('6')}>6</ButtonCalc>
          <ButtonCalc onClick={() => performOperation('-')} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            -
          </ButtonCalc>

          <ButtonCalc onClick={() => inputDigit('1')}>1</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit('2')}>2</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit('3')}>3</ButtonCalc>
          <ButtonCalc onClick={() => performOperation('+')} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            +
          </ButtonCalc>

          <ButtonCalc onClick={() => inputDigit('0')} className="col-span-2">0</ButtonCalc>
          <ButtonCalc onClick={inputDecimal}>.</ButtonCalc>
          <ButtonCalc onClick={() => performOperation('=')} className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            =
          </ButtonCalc>
        </div>
      </Card>
    </div>
  );
}
