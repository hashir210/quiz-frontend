import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Logo from '../components/Logo';

export default function MyQuizzesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'recent' | 'popular'>('all');
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await api.get('/api/quizzes');
        setQuizzes(data);
      } catch (err) {
        console.error('Failed to fetch quizzes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleHost = async (e: React.MouseEvent, quizId: string) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/api/sessions/start`, { quiz_id: quizId });
      navigate(`/session/${data.room_code}/lobby`);
    } catch (err) {
      console.error('Failed to create session', err);
      alert('Could not start live session.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, quizId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await api.delete(`/api/quizzes/${quizId}`);
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (err) {
      console.error('Failed to delete quiz', err);
    }
  };

  const filtered = quizzes
    .filter((q) => q.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (filter === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (filter === 'popular') {
        return (b.question_count || 0) - (a.question_count || 0);
      }
      return 0;
    });

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[var(--theme-bg-main)] min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[var(--theme-text-main)] tracking-tight">
            My Quizzes
          </h1>
          <p className="text-[var(--theme-text-muted)] text-base font-medium">
            Manage and organize your quiz library
          </p>
        </div>
        <Button
          size="xl"
          onClick={() => navigate('/quiz/new')}
          className="gap-3 shadow-lg shadow-primary/20 rounded-2xl h-14 px-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Quiz
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-text-dim)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quizzes..."
            className="pl-12 h-12 rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'recent', 'popular'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="rounded-xl capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[var(--theme-text-main)]">{quizzes.length}</span>
          <span className="text-sm text-[var(--theme-text-dim)]">Total Quizzes</span>
        </div>
        <div className="w-px h-8 bg-[var(--border-default)]" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[var(--theme-text-main)]">0</span>
          <span className="text-sm text-[var(--theme-text-dim)]">Sessions Run</span>
        </div>
        <div className="w-px h-8 bg-[var(--border-default)]" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">0</span>
          <span className="text-sm text-[var(--theme-text-dim)]">Students Reached</span>
        </div>
      </div>

      {/* Quiz Grid */}
      {loading ? (
        <Card className="p-12 text-center border-[var(--theme-border)]">
          <p className="font-heading text-lg font-bold text-[var(--theme-text-main)]">Loading your quizzes...</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center border-[var(--theme-border)]">
          <div className="text-4xl mb-4">🔍</div>
          <p className="font-heading text-lg font-bold text-[var(--theme-text-main)]">No quizzes found</p>
          <p className="text-sm text-[var(--theme-text-dim)] mt-1">Try adjusting your search term</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((quiz) => (
            <Card
              key={quiz.id}
              onClick={() => navigate(`/quiz/${quiz.id}/edit`)}
              className="group p-6 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer border-[var(--theme-border)] hover:shadow-2xl hover:border-primary/30 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between mb-4">
                <div className="bg-[var(--theme-bg-alt)] p-3 rounded-2xl border border-[var(--theme-border)]">
                  <Logo size={28} />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge variant="periwinkle" className="text-[10px] uppercase tracking-wider font-bold">
                    {quiz.question_count || 0} Qs
                  </Badge>
                  <Badge variant="primary" className="text-[10px] uppercase tracking-wider font-bold">
                    {quiz.time_per_q || 30}s
                  </Badge>
                </div>
              </div>

              <h3 className="font-heading text-lg font-bold text-[var(--theme-text-main)] group-hover:text-primary transition-colors line-clamp-1 mb-1">
                {quiz.title}
              </h3>
              <p className="text-xs text-[var(--theme-text-dim)] mb-1">{quiz.description}</p>
              <p className="text-[10px] text-[var(--theme-text-dim)] uppercase tracking-widest font-bold mb-4">
                Created {new Date(quiz.created_at).toLocaleDateString()}
              </p>

              <div className="flex gap-2 pt-4 border-t border-[var(--theme-border)]">
                <Button
                  size="sm"
                  className="flex-1 rounded-xl"
                  onClick={(e) => handleHost(e, quiz.id)}
                >
                  Host
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl"
                  onClick={(e) => { e.stopPropagation(); navigate(`/quiz/${quiz.id}/edit`); }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-[var(--text-muted)] hover:text-danger"
                  onClick={(e) => handleDelete(e, quiz.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
