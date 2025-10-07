import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function TeamPage() {
  const team = [
    {
      name: 'Алексей Смирнов',
      role: 'Lead AI Engineer',
      avatar: '👨‍💻',
      bio: 'Специалист по машинному обучению с опытом работы в Google и OpenAI',
      skills: ['Python', 'TensorFlow', 'LLM'],
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    },
    {
      name: 'Мария Иванова',
      role: 'Frontend Architect',
      avatar: '👩‍💼',
      bio: 'Эксперт по React и TypeScript, создатель интуитивных пользовательских интерфейсов',
      skills: ['React', 'TypeScript', 'UI/UX'],
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    },
    {
      name: 'Дмитрий Петров',
      role: 'Backend Developer',
      avatar: '👨‍🔧',
      bio: 'Специалист по масштабируемым серверным решениям и API интеграциям',
      skills: ['Python', 'FastAPI', 'PostgreSQL'],
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Наша команда
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Профессионалы, создающие будущее AI-коммуникаций
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-2xl transition-all border-0 hover:scale-105 duration-300"
          >
            <div className="text-center mb-4">
              <div className="w-24 h-24 mx-auto mb-4 text-6xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                {member.avatar}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
              <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500">
                {member.role}
              </Badge>
            </div>
            <p className="text-slate-600 text-sm text-center mb-4">{member.bio}</p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {member.skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" asChild>
                <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                  <Icon name="Github" size={16} />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <Icon name="Linkedin" size={16} />
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 border-0 shadow-2xl bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-800">Присоединяйтесь к нам</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Мы всегда ищем талантливых разработчиков, дизайнеров и AI-энтузиастов.
            Если вы хотите создавать будущее вместе с нами — свяжитесь!
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Icon name="Mail" size={18} />
              careers@bogdan.ai
            </Button>
            <Button variant="outline" className="gap-2">
              <Icon name="Send" size={18} />
              Telegram
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
          <p className="text-slate-600">Активных пользователей</p>
        </Card>
        <Card className="p-6 text-center border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-4xl font-bold text-purple-600 mb-2">1M+</div>
          <p className="text-slate-600">Запросов обработано</p>
        </Card>
        <Card className="p-6 text-center border-0 bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
          <p className="text-slate-600">Время работы</p>
        </Card>
      </div>
    </div>
  );
}
