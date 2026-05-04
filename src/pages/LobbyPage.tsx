import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockStudents, mockQuizzes, ROOM_CODE } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Logo from '../components/Logo';

export default function LobbyPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const code = roomCode || ROOM_CODE;
  const [joinedStudents, setJoinedStudents] = useState(mockStudents.slice(0, 3));

  // Simulate students joining
  useEffect(() => {
    if (joinedStudents.length >= mockStudents.length) return;
    const timer = setTimeout(() => {
      setJoinedStudents((prev) => {
        if (prev.length < mockStudents.length) {
          return [...prev, mockStudents[prev.length]];
        }
        return prev;
      });
    }, 1500 + Math.random() * 2000);
    return () => clearInterval(timer);
  }, [joinedStudents]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col transition-colors duration-300">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Logo size={20} />
          </div>
          <span className="text-[var(--text-primary)] font-bold text-lg tracking-tight">
            {mockQuizzes[0].title}
          </span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="rounded-xl px-5"
        >
          End Session
        </Button>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated Background decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Room code */}
        <div className="relative z-10 flex flex-col items-center mb-12">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] mb-6">
            Join with Room Code
          </p>
          <div className="flex gap-4">
            {code.split('').map((char, i) => (
              <Card
                key={i}
                className="w-20 h-24 lg:w-24 lg:h-28 flex items-center justify-center p-0 border-[var(--border-default)] shadow-2xl bg-[var(--bg-card)] rounded-2xl transform hover:scale-105 transition-transform"
                style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                }}
              >
                <span className="font-heading text-5xl lg:text-7xl font-extrabold text-[var(--text-primary)]">
                  {char}
                </span>
              </Card>
            ))}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-8 font-medium">
            Students join at <span className="text-[var(--text-primary)] font-bold underline decoration-primary decoration-2 underline-offset-4">quizflow.app</span>
          </p>
        </div>

        {/* QR Code card */}
        <Card className="w-[260px] p-6 flex flex-col items-center mb-12 border-[var(--border-default)] shadow-2xl rounded-3xl relative z-10">
          <div className="w-full aspect-square bg-white rounded-2xl p-4 flex items-center justify-center shadow-inner">
            {/* Fake QR code pattern */}
            <svg width="100%" height="100%" viewBox="0 0 170 170">
              <rect width="170" height="170" fill="white" />
              <rect x="5" y="5" width="45" height="45" fill="#000424" rx="4" />
              <rect x="12" y="12" width="31" height="31" fill="white" rx="2" />
              <rect x="18" y="18" width="19" height="19" fill="#000424" rx="1" />
              <rect x="120" y="5" width="45" height="45" fill="#000424" rx="4" />
              <rect x="127" y="12" width="31" height="31" fill="white" rx="2" />
              <rect x="133" y="18" width="19" height="19" fill="#000424" rx="1" />
              <rect x="5" y="120" width="45" height="45" fill="#000424" rx="4" />
              <rect x="12" y="127" width="31" height="31" fill="white" rx="2" />
              <rect x="18" y="133" width="19" height="19" fill="#000424" rx="1" />
              {Array.from({ length: 80 }, (_, i) => {
                const x = 60 + (i % 10) * 8;
                const y = 60 + Math.floor(i / 10) * 8;
                return (i * 7 + 3) % 3 !== 0 ? (
                  <rect key={i} x={x} y={y} width="5" height="5" fill="#000424" rx="1" />
                ) : null;
              })}
            </svg>
          </div>
          <p className="text-xs font-bold text-[var(--text-muted)] mt-4 uppercase tracking-widest">Scan to Instant Join</p>
        </Card>

        {/* Student count */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-[800px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[var(--border-default)]" />
            <p className="text-sm font-semibold text-[var(--text-secondary)]">
              <span className="text-[var(--text-primary)] font-bold text-lg">{joinedStudents.length}</span> students ready
            </p>
            <div className="h-px w-12 bg-[var(--border-default)]" />
          </div>

          {/* Student chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {joinedStudents.map((student, i) => (
              <Card
                key={student.id}
                className="animate-chip-appear flex items-center gap-2.5 h-10 px-4 rounded-2xl p-0 border-[var(--border-default)] bg-[var(--bg-card)]/50 backdrop-blur-sm hover:border-primary/40 transition-colors cursor-default"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shadow-lg"
                  style={{ backgroundColor: student.avatarColor }}
                >
                  {student.initial}
                </div>
                <span className="text-sm font-medium text-[var(--text-secondary)]">{student.name}</span>
              </Card>
            ))}
          </div>

          {/* Start button */}
          <Button
            size="xl"
            onClick={() => navigate(`/session/${code}/screen`)}
            disabled={joinedStudents.length === 0}
            className={`w-full max-w-[400px] h-16 rounded-2xl font-heading text-lg font-bold shadow-2xl shadow-primary/20 ${
              joinedStudents.length > 0 ? 'animate-pulse-glow bg-primary hover:bg-primary-hover text-white' : ''
            }`}
          >
            Launch Quiz <span className="ml-2 text-xl">🚀</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
