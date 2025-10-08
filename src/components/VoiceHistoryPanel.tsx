import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface VoiceMessage {
  id: string;
  audioUrl: string;
  duration: number;
  timestamp: Date;
  transcription?: string;
}

interface VoiceHistoryPanelProps {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    attachments?: Array<{ type: 'image' | 'file' | 'audio'; url: string; name: string; duration?: number }>;
  }>;
  onClose: () => void;
}

export default function VoiceHistoryPanel({ messages, onClose }: VoiceHistoryPanelProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const voiceMessages = messages
    .filter(m => m.attachments?.some(a => a.type === 'audio'))
    .map(m => {
      const audioAttachment = m.attachments?.find(a => a.type === 'audio');
      return {
        id: m.id,
        audioUrl: audioAttachment!.url,
        duration: audioAttachment!.duration || 0,
        timestamp: m.timestamp,
        transcription: m.content !== '🎤 Голосовое сообщение' ? m.content : undefined,
      };
    });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return `Сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleString('ru-RU', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handlePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <Card className="h-full bg-white border-slate-200 shadow-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Icon name="Mic" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">История голосовых</h3>
              <p className="text-xs text-slate-500">
                Всего записей: {voiceMessages.length}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl hover:bg-slate-100"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {voiceMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Icon name="Mic" size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Пока нет голосовых сообщений</p>
            <p className="text-sm text-slate-400 mt-2">
              Нажмите кнопку микрофона для записи
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {voiceMessages.map((voice) => (
              <Card
                key={voice.id}
                className={`p-4 border-2 transition-all hover:shadow-md ${
                  playingId === voice.id
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-slate-200 bg-white hover:border-purple-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePlay(voice.id)}
                    className={`rounded-xl flex-shrink-0 ${
                      playingId === voice.id
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                    }`}
                  >
                    <Icon name={playingId === voice.id ? 'Pause' : 'Play'} size={18} />
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {formatTime(voice.duration)}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDate(voice.timestamp)}
                      </span>
                    </div>
                    
                    {voice.transcription && (
                      <p className="text-sm text-slate-700 mb-2 line-clamp-2">
                        {voice.transcription}
                      </p>
                    )}
                    
                    <audio
                      src={voice.audioUrl}
                      onPlay={() => setPlayingId(voice.id)}
                      onPause={() => setPlayingId(null)}
                      onEnded={() => setPlayingId(null)}
                      className="w-full h-8"
                      controls
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {voiceMessages.length > 0 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={14} />
              <span>
                Общая длительность: {formatTime(voiceMessages.reduce((acc, v) => acc + v.duration, 0))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>В архиве</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
