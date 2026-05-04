import Confetti from '../components/Confetti';
import { Card } from '@/components/ui/card';

export default function StudentEndPage() {
  const rank = 2;
  const studentName = 'Ryan Chen';
  const totalScore = 8650;

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
      <Confetti count={50} />

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
          {studentName}
        </h2>

        {/* Score */}
        <div className="mt-1 text-center">
          <span className="font-mono text-4xl font-bold text-[var(--text-primary)]">{totalScore.toLocaleString()}</span>
          <span className="text-sm text-[var(--text-secondary)] ml-2">points</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 w-full max-w-[340px]">
          {[
            { value: '8/10', label: 'Correct' },
            { value: '4.2s', label: 'Avg speed' },
            { value: '950', label: 'Best answer' },
          ].map((stat) => (
            <Card key={stat.label} className="flex flex-col items-center py-3 px-2 border-[var(--border-default)]">
              <span className="font-heading text-xl font-bold text-[var(--text-primary)]">{stat.value}</span>
              <span className="text-[11px] text-[var(--text-muted)] mt-0.5">{stat.label}</span>
            </Card>
          ))}
        </div>

        {/* Motivational message */}
        <p className="font-heading text-base font-semibold text-primary mt-4">
          {motivational}
        </p>

        {/* Waiting state */}
        <div className="mt-8 flex flex-col items-center">
          <span className="text-sm text-[var(--text-muted)] mb-2">Waiting for next quiz...</span>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-dot-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
