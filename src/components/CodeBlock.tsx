import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  code: string;
  language: string;
  isDarkMode?: boolean;
}

export default function CodeBlock({ code, language, isDarkMode = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: 'Код скопирован',
      description: 'Код добавлен в буфер обмена',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="gap-1 bg-slate-800/80 hover:bg-slate-700 text-white"
        >
          <Icon name={copied ? 'Check' : 'Copy'} size={14} />
          {copied ? 'Скопировано' : 'Копировать'}
        </Button>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-t-lg border-b border-slate-700">
        <Icon name="Code" size={14} className="text-slate-400" />
        <span className="text-xs font-mono text-slate-400 uppercase">{language}</span>
      </div>
      
      <SyntaxHighlighter
        language={language}
        style={isDarkMode ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
