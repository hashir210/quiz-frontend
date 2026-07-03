import React from 'react';

const CONFETTI_COLORS = ['#7c3aed', '#a78bfa', '#10B981', '#F59E0B', '#EF4444', '#c4b5fd', '#8b5cf6', '#ec4899'];

interface ConfettiProps {
  count?: number;
}

export default function Confetti({ count = 30 }: ConfettiProps) {
  const pieces = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 2,
      size: 4 + Math.random() * 4,
      rotation: Math.random() * 360,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: '2px',
            transform: `rotate(${p.rotation}deg)`,
            '--confetti-duration': `${p.duration}s`,
            '--confetti-delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
