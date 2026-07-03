import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import Logo from '../components/Logo';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<'choose' | 'signin' | 'signup'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      if (type === 'signin') {
        const res = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('email', email);
        navigate('/dashboard');
      } else {
        await api.post('/api/auth/register', { email, password, name });
        const res = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('email', email);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Network Error') {
        setError('Network error: Backend server is unreachable.');
      } else {
        setError(err.response?.data?.detail || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast.info('Google sign-in is not configured yet. Use email instead.');
  };

  return (
    <div className="min-h-screen bg-[#01030d] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[400px] relative z-10">

        <AnimatePresence mode="wait">

        {/* ── CHOOSE MODE ────────────────────────────── */}
        {mode === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Card className="shadow-xl">
              <CardContent className="p-6 md:p-8">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#0a0f2b] border border-slate-800 flex items-center justify-center shadow-lg">
                    <Logo size={32} />
                  </div>
                </div>

                <h1 className="font-heading text-2xl font-bold text-white text-center mb-10 tracking-tight">
                  Log in to QuizFlow
                </h1>

                <div className="space-y-3">
                  {/* Continue with Google */}
                  <Button
                    onClick={handleGoogleSignIn}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-[15px] flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="white" fillOpacity="0.9" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" fillOpacity="0.7" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" fillOpacity="0.5" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" fillOpacity="0.6" />
                    </svg>
                    Continue with Google
                  </Button>

                  {/* Continue with email */}
                  <Button
                    onClick={() => setMode('signin')}
                    variant="outline"
                    className="w-full h-12 rounded-xl bg-white border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50 text-white font-semibold text-[15px] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    Continue with email
                  </Button>
                </div>

                {/* Bottom link */}
                <p className="text-center mt-10 text-sm text-[#71717a]">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-primary hover:text-[#a78bfa] font-semibold transition-colors">Sign up</button>
                  {' '}or{' '}
                  <button onClick={() => navigate('/')} className="text-primary hover:text-[#a78bfa] font-semibold transition-colors">learn more</button>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── SIGN IN FORM ───────────────────────────── */}
        {mode === 'signin' && (
          <motion.div
            key="signin"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Card className="shadow-xl">
              <CardContent className="p-6 md:p-8">
                {/* Back + Logo */}
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#0a0f2b] border border-slate-800 flex items-center justify-center shadow-lg">
                    <Logo size={32} />
                  </div>
                </div>

                <h1 className="font-heading text-2xl font-bold text-white text-center mb-2 tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-[#71717a] text-center mb-8">Sign in with your email and password</p>

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={(e) => handleSubmit(e, 'signin')} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    className="h-12 rounded-xl bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 pr-12 focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors"
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

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-[15px] transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Signing in...
                      </span>
                    ) : 'Sign In'}
                  </Button>
                </form>

                <p className="text-center mt-8 text-sm text-[#71717a]">
                  <button onClick={() => { setMode('choose'); setError(''); }} className="text-[#a1a1aa] hover:text-white font-medium transition-colors">
                    ← Back
                  </button>
                  <span className="mx-3 text-[#27272a]">·</span>
                  <button onClick={() => { setMode('signup'); setError(''); }} className="text-primary hover:text-[#a78bfa] font-semibold transition-colors">
                    Create account
                  </button>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── SIGN UP FORM ───────────────────────────── */}
        {mode === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Card className="shadow-xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#0a0f2b] border border-slate-800 flex items-center justify-center shadow-lg">
                    <Logo size={32} />
                  </div>
                </div>

                <h1 className="font-heading text-2xl font-bold text-white text-center mb-2 tracking-tight">
                  Create your account
                </h1>
                <p className="text-sm text-[#71717a] text-center mb-8">Start creating quizzes in minutes</p>

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className="h-12 rounded-xl bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                  <Input
                    type="password"
                    placeholder="Password (min 8 chars, upper, lower, number, symbol)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-[15px] transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Creating account...
                      </span>
                    ) : 'Create Account'}
                  </Button>
                </form>

                <p className="text-center mt-8 text-sm text-[#71717a]">
                  <button onClick={() => { setMode('choose'); setError(''); }} className="text-[#a1a1aa] hover:text-white font-medium transition-colors">
                    ← Back
                  </button>
                  <span className="mx-3 text-[#27272a]">·</span>
                  Already have an account?{' '}
                  <button onClick={() => { setMode('signin'); setError(''); }} className="text-primary hover:text-[#a78bfa] font-semibold transition-colors">Sign in</button>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        </AnimatePresence>

      </div>
    </div>
  );
}
