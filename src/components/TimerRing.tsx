import { useEffect, useState } from 'react';

interface TimerRingProps {
  totalSeconds: number;
  size?: number;
  strokeWidth?: number;
}

export default function TimerRing({ totalSeconds, size = 64, strokeWidth = 4 }: TimerRingProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = (secondsLeft / totalSeconds) * circumference;

  const color =
    secondsLeft > 10 ? 'var(--accent-primary)' : secondsLeft > 5 ? '#F59E0B' : '#EF4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 1s ease' }}
        />
      </svg>
      <span
        className="absolute font-mono font-bold"
        style={{ color, fontSize: size * 0.375 }}
      >
        {secondsLeft}
      </span>
    </div>
  );
}
