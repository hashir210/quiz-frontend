import { useLocation } from 'react-router-dom';
import Confetti from '../components/Confetti';
import { Card } from '@/components/ui/card';

export default function StudentEndPage() {
  const location = useLocation();
  const { leaderboard, playerName } = location.state || { leaderboard: [], playerName: 'Anonymous' };

  const myEntry = (leaderboard as any[]).find((e: any) => e.name === playerName);
  const rank = myEntry ? myEntry.rank : (leaderboard.length + 1);
  const totalScore = myEntry ? myEntry.score : 0;

  const rankColor =
    (rank as number) === 1 ? '#F59E0B' :
    (rank as number) === 2 ? '#94A3B8' :
    (rank as number) === 3 ? '#CD7F32' : '#F1F5F9';

  const rankGlow =
    (rank as number) === 1 ? '0 0 40px rgba(245,158,11,0.5)' :
    (rank as number) === 2 ? '0 0 32px rgba(148,163,184,0.3)' :
    (rank as number) === 3 ? '0 0 32px rgba(205,127,50,0.3)' : 'none';

  const motivational =
    rank <= 3 ? 'Podium finish! 🏆' :
    rank <= 6 ? 'Top half! 💪' : 'Great game! 🎮';

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--bg-primary)] flex flex-col items-center justify-center px-6 relative transition-colors duration-300">
      {rank <= 3 && <Confetti count={50} />}

      <div className="relative z-10 flex flex-col items-center">
        {/* Rank display */}
        <span
          className="font-mono text-[88px] font-bold animate-rank-entrance"
          style={{ color: rankColor, textShadow: rankGlow }}
        >
          #{rank}
        </span>

        {/* Student name */}
        <h2 className="font-heading text-xl font-semibold text-[var(--text-primary)] mt-2">
          {playerName}
        </h2>

        {/* Score */}
        <div className="mt-1 text-center">
          <span className="font-mono text-4xl font-bold text-[var(--text-primary)]">{totalScore.toLocaleString()}</span>
          <span className="text-sm text-[var(--text-secondary)] ml-2">points</span>
        </div>

        {/* Motivational message */}
        <p className="font-heading text-base font-semibold text-primary mt-4">
          {motivational}
        </p>

        {/* Final message */}
        <div className="mt-8 flex flex-col items-center">
          <span className="text-sm text-[var(--text-muted)] mb-2">Quiz Finished!</span>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
