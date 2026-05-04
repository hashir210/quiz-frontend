import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import api from '../api/client';

export default function StudentJoinPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    setLoading(true);
    try {
      // 1. Validate room exists via API
      await api.get(`/api/sessions/${roomCode}/validate`);
      
      // We pass the name via state to the next page where the websocket will actually connect
      setError('');
      navigate(`/play/${roomCode}/game`, { state: { playerName: name } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid room code or quiz ended');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6 relative overflow-hidden transition-colors duration-300">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Logo size={48} />
          <span className="font-heading text-xl font-bold text-[var(--text-primary)]">QuizFlow</span>
        </div>

        {/* Room code badge */}
        <Badge variant="periwinkle" className="px-4 py-1.5 mb-6 font-mono text-sm">
          Room: {roomCode}
        </Badge>

        {/* Heading */}
        <h1 className="font-heading text-[28px] font-bold text-[var(--text-primary)] text-center leading-tight">
          Ready to play?
        </h1>
        <p className="text-sm text-[var(--text-secondary)] text-center mt-2 mb-8 uppercase font-black tracking-widest">
          Enter your name to join the quiz
        </p>

      {/* Form */}
      <form onSubmit={handleJoin} className="w-full">
        <div className="space-y-2 text-center">
          <Input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="Your name"
            className={`h-[52px] text-center font-heading text-base ${error ? 'border-danger focus:ring-danger/15 focus:border-danger' : ''
              }`}
            autoFocus
          />
          {error && (
            <p className="text-xs text-danger">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          size="xl"
          className="w-full mt-4 rounded-xl"
        >
          Join Quiz →
        </Button>
      </form>
      </div>
    </div>
  );
}
