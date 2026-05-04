import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const sessionHistory = [
  { id: '1', quiz: 'World History: Ancient Civilizations', date: 'Apr 25, 2026', participants: 28, avgScore: 82, topStudent: 'Aisha Khan' },
  { id: '2', quiz: 'Biology: Cell Structure', date: 'Apr 22, 2026', participants: 32, avgScore: 74, topStudent: 'Ryan Chen' },
  { id: '3', quiz: 'Mathematics: Algebra Basics', date: 'Apr 20, 2026', participants: 24, avgScore: 68, topStudent: 'Emma Watson' },
  { id: '4', quiz: 'English Literature: Shakespeare', date: 'Apr 18, 2026', participants: 30, avgScore: 79, topStudent: 'Marcus Johnson' },
  { id: '5', quiz: 'Geography: Capitals of the World', date: 'Apr 15, 2026', participants: 35, avgScore: 91, topStudent: 'Sofia Garcia' },
  { id: '6', quiz: 'Science: The Solar System', date: 'Apr 12, 2026', participants: 22, avgScore: 85, topStudent: 'David Kim' },
];

function StatBlock({ emoji, value, label }: { emoji: string; value: string | number; label: string }) {
  return (
    <Card className="p-6 border-[var(--theme-border)] text-center">
      <div className="text-3xl mb-2">{emoji}</div>
      <p className="text-2xl font-bold text-[var(--theme-text-main)]">{value}</p>
      <p className="text-xs text-[var(--theme-text-dim)] mt-1 uppercase tracking-widest font-bold">{label}</p>
    </Card>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();

  const totalSessions = sessionHistory.length;
  const avgOverall = Math.round(sessionHistory.reduce((s, h) => s + h.avgScore, 0) / totalSessions);
  const totalStudents = sessionHistory.reduce((s, h) => s + h.participants, 0);
  const bestQuiz = sessionHistory.reduce((best, h) => h.avgScore > best.avgScore ? h : best);

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[var(--theme-bg-main)] min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[var(--theme-text-main)] tracking-tight">
          Results & Analytics
        </h1>
        <p className="text-[var(--theme-text-muted)] text-base font-medium">
          Track performance across all your quiz sessions
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock emoji="🎯" value={totalSessions} label="Total Sessions" />
        <StatBlock emoji="📊" value={`${avgOverall}%`} label="Avg Score" />
        <StatBlock emoji="👥" value={totalStudents} label="Total Students" />
        <StatBlock emoji="🏆" value={bestQuiz.quiz.split(':')[0]} label="Best Quiz" />
      </div>

      {/* Session History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-4">
          <h2 className="font-heading text-xl font-semibold text-[var(--theme-text-main)]">Session History</h2>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-[var(--theme-text-dim)]">
          <span>Quiz</span>
          <span>Date</span>
          <span>Participants</span>
          <span>Avg Score</span>
          <span>Top Student</span>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {sessionHistory.map((session) => {
            const scoreColor = session.avgScore >= 80 ? 'success' : session.avgScore >= 60 ? 'warning' : 'danger';
            return (
              <Card
                key={session.id}
                className="group p-4 md:p-5 border-[var(--theme-border)] hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/session/X7K2/results`)}
              >
                {/* Mobile layout */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-sm font-bold text-[var(--theme-text-main)] line-clamp-1 flex-1 mr-3">
                      {session.quiz}
                    </h3>
                    <Badge variant={scoreColor as 'success' | 'warning' | 'danger'} className="font-bold">
                      {session.avgScore}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--theme-text-dim)]">
                    <span>{session.date}</span>
                    <span>•</span>
                    <span>{session.participants} students</span>
                    <span>•</span>
                    <span>🏆 {session.topStudent}</span>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center">
                  <h3 className="font-heading text-sm font-bold text-[var(--theme-text-main)] group-hover:text-primary transition-colors line-clamp-1">
                    {session.quiz}
                  </h3>
                  <span className="text-sm text-[var(--theme-text-muted)]">{session.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--theme-text-main)]">{session.participants}</span>
                    <span className="text-xs text-[var(--theme-text-dim)]">students</span>
                  </div>
                  <Badge variant={scoreColor as 'success' | 'warning' | 'danger'} className="w-fit font-bold">
                    {session.avgScore}%
                  </Badge>
                  <span className="text-sm text-[var(--theme-text-muted)]">🏆 {session.topStudent}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
