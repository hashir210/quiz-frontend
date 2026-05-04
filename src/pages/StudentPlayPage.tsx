import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockQuizzes } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

const OPTION_COLORS = ['#6366F1', '#06B6D4', '#F59E0B', '#F43F5E'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

type StudentPhase = 'answering' | 'locked' | 'reveal';

export default function StudentPlayPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const quiz = mockQuizzes[0];
  const question = quiz.questions[0] || {
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

  const [phase, setPhase] = useState<StudentPhase>('answering');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const totalQuestions = 10;
  const currentQ = 3;

  // Timer
  useEffect(() => {
    if (secondsLeft <= 0 || phase !== 'answering') return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, phase]);

  // Auto-reveal simulation
  useEffect(() => {
    if (phase === 'locked') {
      const timer = setTimeout(() => setPhase('reveal'), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleAnswer = (index: number) => {
    if (phase !== 'answering') return;
    setSelectedOption(index);
    setPhase('locked');
  };

  const timerColor = secondsLeft > 10 ? '#6366F1' : secondsLeft > 5 ? '#F59E0B' : '#EF4444';
  const timerValue = (secondsLeft / 30) * 100;
  const isCorrect = selectedOption === question.correctOptionIndex;

  return (
    <div className="h-screen w-screen overflow-hidden bg-navy-900 flex flex-col relative">
      {/* Top Zone — 20vh */}
      <div className="h-[20vh] flex flex-col justify-center px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-slate-500">
            Q{currentQ} / {totalQuestions}
          </span>
          <span className="font-mono text-xs font-bold" style={{ color: timerColor }}>
            {secondsLeft}s
          </span>
        </div>
        <Progress
          value={timerValue}
          className="h-2 rounded-full"
          style={{ '--progress-foreground': timerColor } as any}
        />
      </div>

      {/* Middle Zone — 35vh */}
      <div className="h-[35vh] flex flex-col items-center justify-center px-4">
        <h2 className="font-heading text-lg font-semibold text-white text-center leading-snug px-2">
          {question.text}
        </h2>
      </div>

      {/* Bottom Zone — 45vh */}
      <div className="h-[45vh] grid grid-cols-2 gap-3 px-4 pb-6 content-start">
        {question.options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const isCorrectOption = i === question.correctOptionIndex;
          const isLocked = phase === 'locked' || phase === 'reveal';

          let bg = `${OPTION_COLORS[i]}40`;
          let border = OPTION_COLORS[i];
          let opacity = 1;
          let icon = '';

          if (phase === 'reveal') {
            if (isSelected && isCorrectOption) {
              bg = 'rgba(16,185,129,0.3)';
              border = '#10B981';
              icon = '✓';
            } else if (isSelected && !isCorrectOption) {
              bg = 'rgba(239,68,68,0.2)';
              border = '#EF4444';
              icon = '✗';
            } else if (isCorrectOption) {
              bg = 'rgba(16,185,129,0.2)';
              border = '#10B981';
              icon = '✓';
            } else {
              opacity = 0.4;
            }
          } else if (isLocked) {
            if (!isSelected) opacity = 0.4;
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleAnswer(i)}
              disabled={isLocked}
              className="min-h-[80px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-[0.97] relative border-2"
              style={{
                backgroundColor: bg,
                borderColor: border,
                opacity,
                ...(isSelected && phase === 'locked' ? {
                  animation: 'pulse-glow 1.5s ease-in-out infinite',
                  boxShadow: `0 0 16px ${OPTION_COLORS[i]}66`,
                } : {}),
              }}
            >
              <span className="font-heading text-xl font-bold" style={{ color: border }}>
                {icon || OPTION_LETTERS[i]}
              </span>
              <span className="text-xs font-medium text-white text-center px-2 leading-snug">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Locked toast */}
      {phase === 'locked' && (
        <Card className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl animate-chip-appear p-0 border-indigo/20 flex items-center justify-center">
          <span className="text-sm text-white px-6 py-3">Answer locked in! ⏳</span>
        </Card>
      )}

      {/* Score popup */}
      {phase === 'reveal' && isCorrect && (
        <Card className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-xl border-warning animate-score-popup flex flex-col items-center justify-center p-0">
          <div className="px-8 py-4 flex flex-col items-center">
            <span className="font-mono text-3xl font-bold gradient-text">+850 pts</span>
            <span className="text-sm text-slate-300 mt-1">Great speed! 🔥</span>
          </div>
        </Card>
      )}

      {/* Navigation Buttons for Manual Testing */}
      <div className="absolute top-4 right-4 flex gap-2">
        {phase === 'reveal' && (
          <Button variant="outline" size="sm" onClick={() => navigate(`/play/${roomCode}/end`)}>
            Results →
          </Button>
        )}
      </div>
    </div>
  );
}
