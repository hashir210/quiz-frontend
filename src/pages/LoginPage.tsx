import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AnimatedBlobs from '../components/AnimatedBlobs';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const validateInput = (type: 'signin' | 'signup') => {
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    if (type === 'signup') {
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return false;
      }
      if (!/[A-Z]/.test(password)) {
        setError('Password must contain an uppercase letter.');
        return false;
      }
      if (!/[a-z]/.test(password)) {
        setError('Password must contain a lowercase letter.');
        return false;
      }
      if (!/[0-9]/.test(password)) {
        setError('Password must contain a number.');
        return false;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setError('Password must contain a special character.');
        return false;
      }
      if (!name.trim()) {
        setError('Name is required.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent, type: 'signin' | 'signup') => {
    e.preventDefault();
    if (!validateInput(type)) return;

    try {
      if (type === 'signin') {
        const res = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('name', res.data.name);
        navigate('/dashboard');
      } else {
        await api.post('/api/auth/register', { email, password, name });
        // After successful signup, log them in automatically
        const res = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('name', res.data.name);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Network Error') {
        setError('Network error: Ensure your backend CORS (FRONTEND_URL) allows this Vercel URL.');
      } else {
        setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
      }
    }
  };

  const handleForgotPassword = () => {
    setError('Password reset is not configured yet. Ask an admin to reset your password from the backend.');
  };

  const handleGoogleSignIn = () => {
    setError('Google sign-in is not configured for this project yet. Use email and password for now.');
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg-main)] flex flex-col lg:flex-row transition-colors duration-300 overflow-hidden relative">
      <AnimatedBlobs />

      {/* Left Column — Hero */}
      <div className="flex-1 lg:w-[60%] relative flex items-center justify-center p-8 lg:p-12 overflow-hidden z-10">
        {/* Grid dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--border-default) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-xl text-center lg:text-left">
          <h1 className="font-heading text-4xl lg:text-[52px] font-extrabold text-[var(--theme-text-main)] leading-tight">
            Run quizzes your students will actually{' '}
            <span className="gradient-text">remember</span>
          </h1>
          <p className="mt-5 text-base lg:text-lg text-[var(--theme-text-muted)] leading-relaxed max-w-lg mx-auto lg:mx-0">
            Create, host, and run live quizzes in minutes. Students join instantly — no app download needed.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-8">
            <Badge variant="primary" className="px-4 py-2 text-sm font-bold">
              ⚡ Real-time sync
            </Badge>
            <Badge variant="periwinkle" className="px-4 py-2 text-sm font-bold">
              📱 QR join — no app needed
            </Badge>
            <Badge variant="warning" className="px-4 py-2 text-sm font-bold">
              🏆 Live leaderboard
            </Badge>
          </div>
        </div>
      </div>

      {/* Right Column — Auth Card */}
      <div className="lg:w-[40%] flex items-center justify-center p-6 lg:p-12 bg-[var(--theme-bg-alt)] border-l border-[var(--theme-border)] relative z-20">
        <Card className="w-full max-w-[480px] p-8 lg:p-10 border-[var(--theme-border)] shadow-2xl relative z-10 bg-[var(--theme-surface)] rounded-3xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Logo size={24} />
            </div>
            <span className="font-heading text-2xl font-bold text-[var(--theme-text-main)] tracking-tight">QuizFlow</span>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="mb-6 w-full h-12 bg-[var(--theme-bg-alt)] border border-[var(--theme-border)] p-1 rounded-xl">
              <TabsTrigger value="signin" className="flex-1 rounded-lg font-bold data-[state=active]:bg-[var(--theme-surface)] data-[state=active]:shadow-sm">Sign in</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 rounded-lg font-bold data-[state=active]:bg-[var(--theme-surface)] data-[state=active]:shadow-sm">Sign up</TabsTrigger>
            </TabsList>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <TabsContent value="signin">
              <form onSubmit={(e) => handleSubmit(e, 'signin')} className="space-y-4">
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-text-dim)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 rounded-xl text-base"
                  />
                </div>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-text-dim)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 pr-12 rounded-xl text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--theme-text-dim)] hover:text-[var(--theme-text-main)] transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>

                <div className="text-right">
                  <Button type="button" variant="link" onClick={handleForgotPassword} className="text-sm p-0 h-auto text-primary font-semibold">Forgot password?</Button>
                </div>

                <Button type="submit" size="xl" className="w-full h-14 rounded-xl shadow-lg shadow-primary/20">Sign In</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 px-4 rounded-xl text-base"
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 px-4 rounded-xl text-base"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 px-4 rounded-xl text-base"
                />
                <Button type="submit" size="xl" className="w-full h-14 rounded-xl shadow-lg shadow-primary/20">Create Account</Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <Separator className="flex-1" />
            <span className="text-[10px] font-bold text-[var(--theme-text-dim)] uppercase tracking-widest bg-[var(--theme-surface)] px-1 relative z-10">OR CONTINUE WITH</span>
            <Separator className="flex-1" />
          </div>

          {/* Google */}
          <Button type="button" variant="outline" size="xl" onClick={handleGoogleSignIn} className="w-full h-14 rounded-xl border-[var(--theme-border)] hover:bg-[var(--theme-bg-alt)] transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" className="mr-3">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google Account
          </Button>

          {/* Trust signal */}
          <div className="flex flex-col items-center gap-3 mt-10 p-5 bg-[var(--theme-bg-alt)]/30 rounded-2xl border border-[var(--theme-border)]/50">
            <div className="flex -space-x-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--bg-card)] overflow-hidden shadow-sm">
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: `hsl(${i * 60 + 220}, 70%, 60%)` }}>
                    {['S', 'M', 'A', 'K'][i]}
                  </div>
                </div>
              ))}
            </div>
            <span className="text-[11px] font-bold text-[var(--theme-text-dim)] uppercase tracking-widest">Trusted by 50,000+ top educators</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
