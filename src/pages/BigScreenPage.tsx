import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedBlobs from '../components/AnimatedBlobs';
import TimerRing from '../components/TimerRing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuizSocket } from '../hooks/useQuizSocket';
import api from '../api/client';

const OPTION_COLORS = ['#3347ff', '#10B981', '#F59E0B', '#EF4444'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

type Phase = 'question' | 'reveal' | 'leaderboard';

export default function BigScreenPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const code = roomCode || '';
  
  const [quiz, setQuiz] = useState<any>(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentQData, setCurrentQData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const teacherName = localStorage.getItem('name') || 'Teacher';

  const { sendJsonMessage, isConnected } = useQuizSocket(code, (data) => {
    if (data.event === 'room_state' || data.event === 'student_joined' || data.event === 'student_left') {
      setTotalStudents(data.students.length);
    } else if (data.event === 'question_show') {
      setCurrentQIndex(data.index);
      setCurrentQData({
        text: data.text,
        options: data.options,
        total: data.total,
        time_limit: data.time_limit || 30,
      });
      setPhase('question');
      setAnsweredCount(0);
    } else if (data.event === 'quiz_ended') {
      setLeaderboard(data.leaderboard);
      setPhase('leaderboard');
    } else if (data.event === 'student_answered') {
      setAnsweredCount(data.answered_count || 0);
    }
    // We don't have a specific event for student_answered, so we'll just track it via polling or another mechanism, 
    // but wait! The backend doesn't send "student_answered" broadcast! We need to add that in backend or just let the timer run out.
  });

  useEffect(() => {
    if (isConnected && !quiz) {
      sendJsonMessage({
        event: 'join',
        name: teacherName,
        role: 'teacher',
        token: localStorage.getItem('token') || '',
      });
      // Fetch quiz details
      api.get(`/api/sessions/${code}/validate`)
        .then(res => api.get(`/api/quizzes/${res.data.quiz_id}`))
        .then(res => setQuiz(res.data))
        .catch(console.error);
    }
  }, [isConnected, quiz, code, sendJsonMessage, teacherName]);

  // Auto-reveal after timer
  useEffect(() => {
    if (phase !== 'question') return;
    const seconds = currentQData?.time_limit || 30;
    const timer = setTimeout(() => setPhase('reveal'), seconds * 1000);
    return () => clearTimeout(timer);
  }, [phase, currentQIndex, currentQData?.time_limit]);

  const handleReveal = () => setPhase('reveal');
  const handleShowLeaderboard = () => {
    // We can't show actual leaderboard until end_quiz, but if we want per-question leaderboard we need backend support.
    // For now, if we are not at the end, just go to next question directly.
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (!quiz || !currentQData) return;
    if (currentQIndex + 1 >= currentQData.total) {
      sendJsonMessage({ event: 'teacher_end' });
    } else {
      sendJsonMessage({ event: 'teacher_next', next_index: currentQIndex + 1 });
    }
  };

  if (!quiz || !currentQData) {
    return <div className="w-screen h-screen flex items-center justify-center bg-[var(--bg-primary)]">Loading...</div>;
  }

  // Find correct option from full quiz data
  const actualQuestion = quiz.questions[currentQIndex];
  const correctOptionIndex = actualQuestion?.correct_option ?? 0;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[var(--bg-primary)] flex flex-col relative transition-colors duration-300">
      <AnimatedBlobs />

      {phase !== 'leaderboard' && (
        <>
          <div className="relative z-10 h-20 px-10 flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/30 backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">{quiz.title}</span>
              <span className="text-[var(--text-primary)] font-extrabold text-xl">
                Question {currentQIndex + 1} <span className="text-[var(--text-muted)] font-medium">/ {currentQData.total}</span>
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
                  {currentQIndex + 1 >= currentQData.total ? 'Show Final Standings' : 'Next Question →'}
                </Button>
              )}
              <div className="p-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-default)] shadow-xl">
                <TimerRing totalSeconds={currentQData?.time_limit || 30} size={60} strokeWidth={5} />
              </div>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-12">
            <h2 className="font-heading text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] text-center max-w-[1000px] leading-tight mb-16 animate-question-entrance">
              {currentQData.text}
            </h2>

            <div className="grid grid-cols-2 gap-6 w-full max-w-[1200px]">
              {currentQData.options.map((opt: string, i: number) => {
                const isCorrect = i === correctOptionIndex;
                const isRevealed = phase === 'reveal';

                return (
                  <Card
                    key={i}
                    className={`relative min-h-[120px] flex items-center px-10 gap-6 transition-all duration-700 overflow-hidden rounded-[24px] border-2 ${
                      isRevealed && !isCorrect ? 'opacity-30 blur-[1px] grayscale-[0.5]' : ''
                    } ${isRevealed && isCorrect ? 'bg-success/10 border-success shadow-[0_0_50px_rgba(16,185,129,0.3)] scale-105 z-20' : 'border-[var(--border-default)] bg-[var(--bg-card)]/50 backdrop-blur-sm shadow-xl'}`}
                  >
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
                      {opt}
                    </span>

                    {isRevealed && isCorrect && (
                      <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-white text-2xl animate-bounce">
                        ✓
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 h-20 px-12 flex items-center gap-8 bg-[var(--bg-secondary)]/20 backdrop-blur-sm border-t border-[var(--border-default)]">
            <span className="text-lg font-bold text-[var(--text-secondary)] whitespace-nowrap">
              <span className="text-[var(--text-primary)]">{answeredCount}</span> answered / <span className="text-[var(--text-primary)]">{totalStudents}</span> connected
            </span>
          </div>
        </>
      )}

      {phase === 'leaderboard' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-12 py-10">
          <div className="text-center mb-12">
             <Badge variant="periwinkle" className="mb-4 px-6 py-1.5 text-sm uppercase tracking-[0.4em] font-black rounded-full">Final Standings</Badge>
             <h2 className="font-heading text-6xl font-black text-[var(--text-primary)] tracking-tighter">Top Performers</h2>
          </div>

          <div className="w-full max-w-[900px] flex flex-col gap-5">
            {leaderboard.slice(0, 5).map((entry, i) => {
              const rankColor =
                entry.rank === 1 ? 'linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)' :
                entry.rank === 2 ? 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)' :
                entry.rank === 3 ? 'linear-gradient(135deg, #FDBA74 0%, #CD7F32 100%)' : 'var(--bg-secondary)';

              return (
                <Card
                  key={i}
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
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading text-xl font-black shadow-lg bg-primary"
                  >
                    {entry.name[0].toUpperCase()}
                  </div>

                  <span className="font-heading text-2xl font-bold text-[var(--text-primary)] flex-1">
                    {entry.name}
                  </span>

                  <div className="flex flex-col items-end gap-1">
                    <span className="font-heading text-3xl font-black text-primary tracking-tighter">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          <Button
            size="xl"
            onClick={() => navigate('/dashboard')}
            className="mt-16 h-20 px-20 rounded-[24px] text-2xl font-black shadow-2xl shadow-primary/40 group overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-3">
              Back to Dashboard
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
