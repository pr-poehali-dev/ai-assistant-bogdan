import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function NotesApp() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotes(parsed.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleCreateNote = () => {
    if (!title.trim() && !content.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите заголовок или текст заметки',
        variant: 'destructive',
      });
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: title || 'Без названия',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
    toast({ title: 'Заметка создана!' });
  };

  const handleUpdateNote = () => {
    if (!selectedNote) return;

    setNotes(notes.map(note =>
      note.id === selectedNote.id
        ? { ...note, title, content, updatedAt: new Date() }
        : note
    ));
    setSelectedNote(null);
    setTitle('');
    setContent('');
    toast({ title: 'Заметка обновлена!' });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setTitle('');
      setContent('');
    }
    toast({ title: 'Заметка удалена!' });
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Заметки</h2>
            <Button onClick={handleNewNote} size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600">
              <Icon name="Plus" size={16} />
            </Button>
          </div>

          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="mb-4"
          />

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Нет заметок</p>
            ) : (
              filteredNotes.map(note => (
                <Card
                  key={note.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedNote?.id === note.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => handleSelectNote(note)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">{note.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{note.content}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {note.updatedAt.toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Icon name="Trash2" size={16} className="text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>

        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl md:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
              <Icon name="StickyNote" size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {selectedNote ? 'Редактировать' : 'Новая заметка'}
              </h1>
              <p className="text-slate-600">Быстрые заметки с автосохранением</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок заметки..."
              className="text-xl font-semibold"
            />

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Начните писать..."
              className="min-h-96 text-base resize-none"
            />

            <div className="flex gap-3">
              <Button
                onClick={selectedNote ? handleUpdateNote : handleCreateNote}
                className="flex-1 h-12 bg-gradient-to-r from-yellow-500 to-orange-600"
              >
                <Icon name={selectedNote ? 'Save' : 'Plus'} size={20} className="mr-2" />
                {selectedNote ? 'Сохранить' : 'Создать заметку'}
              </Button>
              {selectedNote && (
                <Button
                  onClick={handleNewNote}
                  variant="outline"
                  className="h-12"
                >
                  Отмена
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Icon name="FileText" size={16} />
              <span>Всего заметок: {notes.length}</span>
              <span className="text-slate-400">•</span>
              <span>Символов: {content.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
