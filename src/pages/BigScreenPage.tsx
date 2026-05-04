import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedBlobs from '../components/AnimatedBlobs';
import TimerRing from '../components/TimerRing';
import { mockQuizzes, mockLeaderboard, mockStudents } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const OPTION_COLORS = ['#3347ff', '#10B981', '#F59E0B', '#EF4444'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

type Phase = 'question' | 'reveal' | 'leaderboard';

export default function BigScreenPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const quiz = mockQuizzes[0];
  const questions = quiz.questions;
  const totalQuestions = questions.length || 10;

  const [currentQ, setCurrentQ] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [answeredCount, setAnsweredCount] = useState(0);
  const [answerPercentages] = useState([35, 45, 12, 8]);

  const question = questions[currentQ] || {
    id: 'demo',
    text: 'Which ancient civilization built the Pyramid of Giza?',
    options: [
      { id: 'a', text: 'Roman Empire' },
      { id: 'b', text: 'Ancient Egypt' },
      { id: 'c', text: 'Greek Empire' },
      { id: 'd', text: 'Persian Empire' },
    ],
    correctOptionIndex: 1,
  };

  // Simulate answers coming in
  useEffect(() => {
    if (phase !== 'question') return;
    const timer = setInterval(() => {
      setAnsweredCount((prev) => Math.min(prev + 1, mockStudents.length));
    }, 800);
    return () => clearInterval(timer);
  }, [phase]);

  // Auto-reveal after timer
  useEffect(() => {
    if (phase !== 'question') return;
    const timer = setTimeout(() => setPhase('reveal'), 15000);
    return () => clearTimeout(timer);
  }, [phase, currentQ]);

  const handleReveal = () => setPhase('reveal');
  const handleShowLeaderboard = () => setPhase('leaderboard');
  const handleNextQuestion = () => {
    if (currentQ + 1 >= totalQuestions) {
      navigate(`/session/${roomCode}/results`);
      return;
    }
    setCurrentQ((prev) => prev + 1);
    setPhase('question');
    setAnsweredCount(0);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[var(--bg-primary)] flex flex-col relative transition-colors duration-300">
      <AnimatedBlobs />

      {/* Question & Reveal Phase */}
      {phase !== 'leaderboard' && (
        <>
          {/* Top bar */}
          <div className="relative z-10 h-20 px-10 flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/30 backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">{quiz.title}</span>
              <span className="text-[var(--text-primary)] font-extrabold text-xl">
                Question {currentQ + 1} <span className="text-[var(--text-muted)] font-medium">/ {totalQuestions}</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              {phase === 'question' && (
                <Button variant="outline" size="xl" onClick={handleReveal} className="rounded-2xl px-8 border-[var(--border-default)]">
                  Reveal Answer
                </Button>
              )}
              {phase === 'reveal' && (
                <Button size="xl" onClick={handleShowLeaderboard} className="rounded-2xl px-8 bg-primary shadow-lg shadow-primary/20">
                  Next Step →
                </Button>
              )}
              <div className="p-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-default)] shadow-xl">
                <TimerRing totalSeconds={30} size={60} strokeWidth={5} />
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-12">
            <h2 className="font-heading text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] text-center max-w-[1000px] leading-tight mb-16 animate-question-entrance">
              {question.text}
            </h2>

            {/* Answer grid */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-[1200px]">
              {question.options.map((opt, i) => {
                const isCorrect = i === question.correctOptionIndex;
                const isRevealed = phase === 'reveal';

                return (
                  <Card
                    key={opt.id}
                    className={`relative min-h-[120px] flex items-center px-10 gap-6 transition-all duration-700 overflow-hidden rounded-[24px] border-2 ${
                      isRevealed && !isCorrect ? 'opacity-30 blur-[1px] grayscale-[0.5]' : ''
                    } ${isRevealed && isCorrect ? 'bg-success/10 border-success shadow-[0_0_50px_rgba(16,185,129,0.3)] scale-105 z-20' : 'border-[var(--border-default)] bg-[var(--bg-card)]/50 backdrop-blur-sm shadow-xl'}`}
                  >
                    {/* Background Progress effect (revealed) */}
                    {isRevealed && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-50" />
                    )}

                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center font-heading text-2xl font-black flex-shrink-0 shadow-lg"
                      style={{
                        backgroundColor: isRevealed && isCorrect ? '#10B981' : OPTION_COLORS[i],
                        color: 'white',
                      }}
                    >
                      {OPTION_LETTERS[i]}
                    </div>
                    <span className="font-heading text-2xl font-bold text-[var(--text-primary)] flex-1">
                      {opt.text}
                    </span>

                    {isRevealed && isCorrect && (
                      <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-white text-2xl animate-bounce">
                        ✓
                      </div>
                    )}

                    {/* Percentage bar */}
                    {isRevealed && (
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[var(--bg-secondary)]">
                        <div
                          className="h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                          style={{
                            width: `${answerPercentages[i]}%`,
                            backgroundColor: isCorrect ? '#10B981' : OPTION_COLORS[i],
                          }}
                        />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-10 h-20 px-12 flex items-center gap-8 bg-[var(--bg-secondary)]/20 backdrop-blur-sm border-t border-[var(--border-default)]">
            <span className="text-lg font-bold text-[var(--text-secondary)] whitespace-nowrap">
              <span className="text-[var(--text-primary)]">{answeredCount}</span> / {mockStudents.length} Students Answered
            </span>
            <div className="flex-1 h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-default)]">
               <div 
                 className="h-full bg-gradient-to-r from-primary to-periwinkle-400 transition-all duration-500 rounded-full shadow-[0_0_15px_rgba(51,71,255,0.4)]"
                 style={{ width: `${(answeredCount / mockStudents.length) * 100}%` }}
               />
            </div>
          </div>
        </>
      )}

      {/* Leaderboard Phase */}
      {phase === 'leaderboard' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-12 py-10">
          <div className="text-center mb-12">
             <Badge variant="periwinkle" className="mb-4 px-6 py-1.5 text-sm uppercase tracking-[0.4em] font-black rounded-full">Standings</Badge>
             <h2 className="font-heading text-6xl font-black text-[var(--text-primary)] tracking-tighter">Top Performers</h2>
          </div>

          <div className="w-full max-w-[900px] flex flex-col gap-5">
            {mockLeaderboard.slice(0, 5).map((entry, i) => {
              const rankColor =
                entry.rank === 1 ? 'linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)' :
                entry.rank === 2 ? 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)' :
                entry.rank === 3 ? 'linear-gradient(135deg, #FDBA74 0%, #CD7F32 100%)' : 'var(--bg-secondary)';

              return (
                <Card
                  key={entry.student.id}
                  className="h-24 flex items-center px-10 gap-8 animate-leaderboard-row p-0 border-[var(--border-default)] bg-[var(--bg-card)]/80 backdrop-blur-md rounded-[32px] shadow-2xl hover:scale-[1.02] transition-transform"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl border-2 border-white/10"
                    style={{ background: rankColor, color: entry.rank <= 3 ? 'white' : 'var(--text-primary)' }}
                  >
                    #{entry.rank}
                  </div>

                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading text-xl font-black shadow-lg"
                    style={{ backgroundColor: entry.student.avatarColor }}
                  >
                    {entry.student.initial}
                  </div>

                  <span className="font-heading text-2xl font-bold text-[var(--text-primary)] flex-1">
                    {entry.student.name}
                  </span>

                  <div className="flex flex-col items-end gap-1">
                    <span className="font-heading text-3xl font-black text-primary tracking-tighter">
                      {entry.score.toLocaleString()}
                    </span>
                    <Badge variant="success" className="bg-success/20 text-success border-success/20 font-bold">
                      +{entry.pointsGained} pts
                    </Badge>
                  </div>

                  {entry.rankChange !== 0 && (
                    <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl ${entry.rankChange > 0 ? 'bg-success/10' : 'bg-danger/10'}`}>
                      <span className={`text-xl font-black ${entry.rankChange > 0 ? 'text-success animate-bounce' : 'text-danger'}`}>
                        {entry.rankChange > 0 ? '↑' : '↓'}
                      </span>
                      <span className={`text-[10px] font-black ${entry.rankChange > 0 ? 'text-success' : 'text-danger'}`}>
                        {Math.abs(entry.rankChange)}
                      </span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <Button
            size="xl"
            onClick={handleNextQuestion}
            className="mt-16 h-20 px-20 rounded-[24px] text-2xl font-black shadow-2xl shadow-primary/40 group overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-3">
              {currentQ + 1 >= totalQuestions ? 'View Final Results' : 'Next Question'}
              <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-periwinkle-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      )}
    </div>
  );
}
