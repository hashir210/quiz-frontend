import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

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
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/sessions')
      .then(res => {
        setSessions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6 text-white">Loading history...</div>;

  const totalSessions = sessions.length;
  const totalStudents = sessions.reduce((s, h) => s + h.participants_count, 0);

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[var(--theme-bg-main)] min-h-screen transition-colors duration-300">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[var(--theme-text-main)] tracking-tight">
          Results & Analytics
        </h1>
        <p className="text-[var(--theme-text-muted)] text-base font-medium">
          Track performance across all your quiz sessions
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock emoji="🎯" value={totalSessions} label="Total Sessions" />
        <StatBlock emoji="📊" value="--" label="Avg Score" />
        <StatBlock emoji="👥" value={totalStudents} label="Total Students" />
        <StatBlock emoji="🏆" value="--" label="Best Quiz" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-4">
          <h2 className="font-heading text-xl font-semibold text-[var(--theme-text-main)]">Session History</h2>
        </div>

        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-[var(--theme-text-dim)]">
          <span>Quiz</span>
          <span>Date</span>
          <span>Participants</span>
          <span>Action</span>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => {
            return (
              <Card
                key={session.id}
                className="group p-4 md:p-5 border-[var(--theme-border)] hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center">
                  <h3 className="font-heading text-sm font-bold text-[var(--theme-text-main)] group-hover:text-primary transition-colors line-clamp-1">
                    {session.quiz_title}
                  </h3>
                  <span className="text-sm text-[var(--theme-text-muted)]">{session.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--theme-text-main)]">{session.participants_count}</span>
                    <span className="text-xs text-[var(--theme-text-dim)]">students</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl w-fit"
                    onClick={() => navigate(`/session/${session.room_code}/results`)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
          {sessions.length === 0 && (
            <p className="text-center py-10 text-[var(--theme-text-muted)]">No finished sessions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
