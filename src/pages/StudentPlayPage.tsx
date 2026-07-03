import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useQuizSocket } from '../hooks/useQuizSocket';

const OPTION_COLORS = ['#6366F1', '#06B6D4', '#F59E0B', '#F43F5E'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

type StudentPhase = 'waiting' | 'answering' | 'locked' | 'reveal' | 'ended';

export default function StudentPlayPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const location = useLocation();
  const code = roomCode || '';
  const playerName =
    location.state?.playerName ||
    localStorage.getItem(`playerName:${code}`) ||
    'Anonymous';

  const [phase, setPhase] = useState<StudentPhase>('waiting');
  const [question, setQuestion] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [timeLimit, setTimeLimit] = useState(30);
  const [scoreData, setScoreData] = useState<any>(null);

  const { sendJsonMessage, isConnected } = useQuizSocket(code, (data) => {
    if (data.event === 'question_show') {
      setQuestion(data);
      setPhase('answering');
      setSelectedOption(null);
      setTimeLimit(data.time_limit || 30);
      setSecondsLeft(data.time_limit || 30);
      setScoreData(null);
    } else if (data.event === 'answer_result') {
      setScoreData(data);
      setPhase('reveal');
    } else if (data.event === 'quiz_ended') {
      setPhase('ended');
      navigate(`/play/${code}/end`, { state: { leaderboard: data.leaderboard, playerName } });
    }
  });

  useEffect(() => {
    if (isConnected && phase === 'waiting') {
      sendJsonMessage({ event: 'student_join', name: playerName, role: 'student' });
    }
  }, [isConnected, sendJsonMessage, playerName, phase]);

  // Timer
  useEffect(() => {
    if (secondsLeft <= 0 || phase !== 'answering') return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (phase === 'answering') setPhase('locked');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, phase]);

  const handleAnswer = (index: number) => {
    if (phase !== 'answering') return;
    setSelectedOption(index);
    setPhase('locked');
    sendJsonMessage({ event: 'student_answer', option: index });
  };

  if (phase === 'waiting') {
    return (
      <div className="h-screen w-screen bg-navy-900 flex items-center justify-center">
        <h2 className="text-white text-xl font-bold animate-pulse">Waiting for teacher to start...</h2>
      </div>
    );
  }

  const timerColor = secondsLeft > 10 ? '#6366F1' : secondsLeft > 5 ? '#F59E0B' : '#EF4444';
  const timerValue = (secondsLeft / timeLimit) * 100;
  const isCorrect = scoreData?.correct;

  return (
    <div className="h-screen w-screen overflow-hidden bg-navy-900 flex flex-col relative">
      <div className="h-[20vh] flex flex-col justify-center px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-slate-500">
            Q{question?.index + 1} / {question?.total}
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

      {/* Question area — adapts when image is present */}
      {question?.image_url ? (
        <>
          <div className="h-[20vh] flex items-center justify-center px-4 pt-2">
            <div className="w-full max-w-[280px] h-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg">
              <img
                src={question.image_url}
                alt="Question"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="h-[15vh] flex flex-col items-center justify-center px-4">
            <h2 className="font-heading text-base sm:text-lg font-semibold text-white text-center leading-snug px-2">
              {question?.text}
            </h2>
          </div>
        </>
      ) : (
        <div className="h-[35vh] flex flex-col items-center justify-center px-4">
          <h2 className="font-heading text-lg font-semibold text-white text-center leading-snug px-2">
            {question?.text}
          </h2>
        </div>
      )}

      <div className="h-[45vh] grid grid-cols-2 gap-3 px-4 pb-6 content-start">
        {question?.options.map((opt: string, i: number) => {
          const isSelected = selectedOption === i;
          const isCorrectOption = scoreData?.correct_option === i;
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
              key={i}
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
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {phase === 'locked' && (
        <Card className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl animate-chip-appear p-0 border-indigo/20 flex items-center justify-center">
          <span className="text-sm text-white px-6 py-3">Answer locked in! ⏳</span>
        </Card>
      )}

      {phase === 'reveal' && isCorrect && (
        <Card className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-xl border-warning animate-score-popup flex flex-col items-center justify-center p-0">
          <div className="px-8 py-4 flex flex-col items-center">
            <span className="font-mono text-3xl font-bold text-primary">+{scoreData.points_earned} pts</span>
            <span className="text-sm text-slate-300 mt-1">Great job! 🔥</span>
          </div>
        </Card>
      )}

      {phase === 'reveal' && !isCorrect && selectedOption !== null && (
        <Card className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-xl border-danger animate-chip-appear flex flex-col items-center justify-center p-0 bg-danger/20">
          <div className="px-8 py-4 flex flex-col items-center">
            <span className="font-mono text-xl font-bold text-white">Incorrect 😢</span>
          </div>
        </Card>
      )}
    </div>
  );
}
