import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Logo from '../components/Logo';
import { useQuizSocket } from '../hooks/useQuizSocket';
import api from '../api/client';

export default function LobbyPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const code = roomCode || '';
  const [joinedStudents, setJoinedStudents] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [roomError, setRoomError] = useState('');
  const teacherName = localStorage.getItem('name') || 'Teacher';
  const joinUrl = `${window.location.origin}/play/${code}`;
  const qrUrl = `${import.meta.env.VITE_API_URL}/api/sessions/${code}/qr?join_url=${encodeURIComponent(joinUrl)}`;

  const { sendJsonMessage, isConnected } = useQuizSocket(code, (data) => {
    if (data.event === 'room_state' || data.event === 'student_joined') {
      setJoinedStudents(data.students);
    } else if (data.event === 'student_left') {
      setJoinedStudents(data.students);
    }
  });

  useEffect(() => {
    if (isConnected) {
      sendJsonMessage({
        event: 'join',
        name: teacherName,
        role: 'teacher',
        token: localStorage.getItem('token') || '',
      });
    }
  }, [isConnected, sendJsonMessage, teacherName]);

  useEffect(() => {
    api.get(`/api/sessions/${code}/validate`)
      .then(() => setRoomError(''))
      .catch((err) => setRoomError(err.response?.data?.detail || 'Room not found or quiz has ended'));
  }, [code]);

  const handleLaunch = () => {
    sendJsonMessage({ event: 'teacher_start' });
    navigate(`/session/${code}/screen`);
  };

  const handleEndSession = () => {
    sendJsonMessage({ event: 'teacher_end' });
    navigate('/dashboard');
  };

  const handleCopyJoinLink = async () => {
    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col transition-colors duration-300">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Logo size={20} />
          </div>
          <span className="text-[var(--text-primary)] font-bold text-lg tracking-tight">
            Lobby: {code}
          </span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleEndSession}
          className="rounded-xl px-5"
        >
          End Session
        </Button>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated Background decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {roomError ? (
          <div className="relative z-10 flex flex-col items-center text-center gap-5">
            <h1 className="font-heading text-3xl font-black text-[var(--text-primary)]">This room is not active</h1>
            <p className="text-[var(--text-secondary)] max-w-[420px]">{roomError}</p>
            <Button onClick={() => navigate('/dashboard')} className="rounded-xl px-8">
              Back to Dashboard
            </Button>
          </div>
        ) : (
        <>

        {/* Room code and QR */}
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-10 items-center mb-12 w-full max-w-[980px]">
          <div className="flex flex-col items-center">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] mb-6">
              Join with Room Code
            </p>
            <div className="flex gap-4">
              {code.split('').map((char, i) => (
                <Card
                  key={i}
                  className="w-16 h-20 sm:w-20 sm:h-24 lg:w-24 lg:h-28 flex items-center justify-center p-0 border-[var(--border-default)] shadow-2xl bg-[var(--bg-card)] rounded-2xl transform hover:scale-105 transition-transform"
                  style={{
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  }}
                >
                  <span className="font-heading text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[var(--text-primary)]">
                    {char}
                  </span>
                </Card>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
              <p className="text-sm text-[var(--text-secondary)] font-medium">
                Students join at <span className="text-[var(--text-primary)] font-bold underline decoration-primary decoration-2 underline-offset-4">{joinUrl}</span>
              </p>
              <Button variant="outline" size="sm" onClick={handleCopyJoinLink} className="rounded-xl">
                {copied ? 'Copied' : 'Copy Link'}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center justify-self-center gap-3">
            <div className="w-[190px] h-[190px] rounded-2xl bg-white p-3 shadow-2xl border border-[var(--border-default)]">
              <img src={qrUrl} alt={`QR code for room ${code}`} className="w-full h-full object-contain" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-[0.24em] text-[var(--text-muted)]">Scan to join</span>
          </div>
        </div>

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
                key={i}
                className="animate-chip-appear flex items-center gap-2.5 h-10 px-4 rounded-2xl p-0 border-[var(--border-default)] bg-[var(--bg-card)]/50 backdrop-blur-sm hover:border-primary/40 transition-colors cursor-default"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shadow-lg bg-primary"
                >
                  {student[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-[var(--text-secondary)]">{student}</span>
              </Card>
            ))}
          </div>

          {/* Start button */}
          <Button
            size="xl"
            onClick={handleLaunch}
            disabled={joinedStudents.length === 0}
            className={`w-full max-w-[400px] h-16 rounded-2xl font-heading text-lg font-bold shadow-2xl shadow-primary/20 ${
              joinedStudents.length > 0 ? 'animate-pulse-glow bg-primary hover:bg-primary-hover text-white' : ''
            }`}
          >
            Launch Quiz <span className="ml-2 text-xl">🚀</span>
          </Button>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
