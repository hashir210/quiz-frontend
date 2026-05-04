import { useNavigate, useParams } from 'react-router-dom';
import Confetti from '../components/Confetti';
import { mockLeaderboard, mockQuizzes } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const RANK_COLORS: Record<number, { color: string; glow: string }> = {
  1: { color: '#F59E0B', glow: '0 0 32px rgba(245,158,11,0.4)' },
  2: { color: '#94A3B8', glow: '0 0 24px rgba(148,163,184,0.3)' },
  3: { color: '#CD7F32', glow: '0 0 24px rgba(205,127,50,0.3)' },
};

export default function TeacherResultsPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const quiz = mockQuizzes[0];

  const podiumOrder = [
    mockLeaderboard[1], // 2nd place left
    mockLeaderboard[0], // 1st place center
    mockLeaderboard[2], // 3rd place right
  ];

  const podiumHeights = [160, 200, 130];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Header with confetti */}
        <div className="relative overflow-hidden py-12 mb-8 bg-[var(--bg-secondary)]/30 rounded-[40px] border border-[var(--border-default)] backdrop-blur-sm">
          <Confetti count={50} />
          <div className="relative z-10 flex flex-col items-center">
            <Badge variant="periwinkle" className="mb-6 px-6 py-1.5 text-sm uppercase tracking-[0.4em] font-black rounded-full">Session Review</Badge>
            <h1 className="font-heading text-5xl font-black text-[var(--text-primary)] text-center tracking-tighter">
              Quiz Mastermind 🎉
            </h1>
            <p className="text-base text-[var(--text-muted)] text-center mt-3 font-medium">
              {quiz.title} • Live Session Results
            </p>
          </div>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-8 h-[320px] mb-16 px-4">
          {podiumOrder.map((entry, i) => {
            const rank = entry.rank;
            const rc = RANK_COLORS[rank] || { color: '#475569', glow: 'none' };
            const isWinner = rank === 1;

            return (
              <div key={entry.student.id} className="flex flex-col items-center group">
                <div className={`mb-6 flex flex-col items-center transition-transform duration-500 ${isWinner ? 'scale-110' : 'scale-90 group-hover:scale-95'}`}>
                   {isWinner && <span className="text-4xl mb-2 animate-bounce">👑</span>}
                   <Avatar className="w-20 h-20 border-4 shadow-2xl" style={{ borderColor: rc.color }}>
                      <AvatarFallback className="text-2xl font-black text-white" style={{ backgroundColor: entry.student.avatarColor }}>
                        {entry.student.initial}
                      </AvatarFallback>
                   </Avatar>
                </div>
                <Card
                  className={`flex flex-col items-center justify-start pt-8 pb-4 rounded-t-[32px] rounded-b-xl border-2 transition-all duration-500`}
                  style={{
                    width: '180px',
                    height: `${podiumHeights[i]}px`,
                    borderColor: rc.color,
                    boxShadow: rc.glow,
                    background: `linear-gradient(to bottom, ${rc.color}15, var(--bg-card))`,
                  }}
                >
                  <span className="font-heading text-3xl font-black mb-1" style={{ color: rc.color }}>
                    #{rank}
                  </span>
                  <span className="text-base font-bold text-[var(--text-primary)] mt-1 px-4 text-center line-clamp-1">{entry.student.name}</span>
                  <div className="mt-4 flex flex-col items-center gap-1">
                    <span className="font-heading text-2xl font-black text-[var(--text-primary)] tracking-tighter">{entry.score.toLocaleString()}</span>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
            <h2 className="font-heading text-2xl font-black text-[var(--text-primary)] tracking-tight ml-2">Final Standings</h2>
            <Card className="overflow-hidden border-[var(--border-default)] shadow-2xl rounded-[32px] bg-[var(--bg-card)]">
              {/* Header */}
              <div className="grid grid-cols-[60px_1fr_120px_120px_120px] items-center bg-[var(--bg-secondary)] px-8 py-5">
                <span className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest">Rank</span>
                <span className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest">Participant</span>
                <span className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest text-right">Score</span>
                <span className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest text-right">Accuracy</span>
                <span className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest text-right">Speed</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-[var(--border-default)]">
              {mockLeaderboard.map((entry, i) => {
                const rankColor =
                  entry.rank <= 3 ? RANK_COLORS[entry.rank].color : 'var(--text-muted)';
                
                return (
                  <div
                    key={entry.student.id}
                    className="grid grid-cols-[60px_1fr_120px_120px_120px] items-center px-8 py-5 hover:bg-[var(--bg-secondary)]/50 transition-colors"
                  >
                    <span className="font-heading text-lg font-black" style={{ color: rankColor }}>
                        #{entry.rank}
                    </span>
                    
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 border-2 border-[var(--bg-secondary)]">
                        <AvatarFallback className="text-white font-bold" style={{ backgroundColor: entry.student.avatarColor }}>
                          {entry.student.initial}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-base font-bold text-[var(--text-primary)]">{entry.student.name}</span>
                    </div>

                    <span className="font-heading text-xl font-black text-primary text-right tracking-tighter">
                        {entry.score.toLocaleString()}
                    </span>

                    <div className="text-right">
                        <Badge variant="success" className="bg-success/10 text-success border-success/10 font-bold px-3 py-0.5 rounded-lg">
                        {Math.round((entry.correctAnswers / entry.totalQuestions) * 100)}%
                        </Badge>
                    </div>

                    <span className="text-sm font-bold text-[var(--text-secondary)] text-right">
                        {entry.avgSpeed}s <span className="text-[10px] font-medium text-[var(--text-muted)]">avg</span>
                    </span>
                  </div>
                );
              })}
              </div>
            </Card>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-16 pb-16">
          <Button
            variant="outline"
            size="xl"
            className="w-full sm:w-[260px] h-16 rounded-[20px] border-2 border-[var(--border-default)] font-bold text-lg hover:bg-[var(--bg-secondary)] transition-all"
            onClick={() => navigate(`/session/${roomCode}/lobby`)}
          >
            Restart Session
          </Button>
          <Button
            size="xl"
            className="w-full sm:w-[260px] h-16 rounded-[20px] font-bold text-lg shadow-xl shadow-primary/20"
            onClick={() => navigate('/dashboard')}
          >
            Finish & Exit
          </Button>
        </div>
      </div>
    </div>
  );
}
