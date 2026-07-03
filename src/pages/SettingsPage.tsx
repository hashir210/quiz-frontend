import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import api from '../api/client';

type Tab = 'profile' | 'appearance' | 'quiz' | 'security';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'quiz', label: 'Quiz Preferences', icon: 'sliders' },
  { id: 'security', label: 'Security', icon: 'shield' },
];

function TabIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  const s = { width: size, height: size };
  switch (icon) {
    case 'user':
      return (<svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
    case 'palette':
      return (<svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="12" r="1.5" fill="currentColor"/><circle cx="16" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/></svg>);
    case 'sliders':
      return (<svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>);
    case 'shield':
      return (<svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
    default: return null;
  }
}

export default function SettingsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loaded, setLoaded] = useState(false);

  // Profile state — name comes from localStorage first so it shows instantly
  const [name, setName] = useState(() => localStorage.getItem('name') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('email') || '');
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('avatar') || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Quiz prefs
  const [defaultTimer, setDefaultTimer] = useState(() => localStorage.getItem('defaultTimer') || '30');
  const [defaultPoints, setDefaultPoints] = useState(() => localStorage.getItem('defaultPoints') || '1000');
  const [shuffleQuestions, setShuffleQuestions] = useState(() => localStorage.getItem('shuffleQuestions') === 'true');
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(() => localStorage.getItem('showCorrectAnswers') !== 'false');

  // Appearance
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    (localStorage.getItem('theme') as 'dark' | 'light' | null) ||
    (document.documentElement.classList.contains('light') ? 'light' : 'dark')
  );

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => {
        setName(res.data.name);
        setEmail(res.data.email);
        setAvatarUrl(res.data.avatar_url || '');
        setLoaded(true);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem('defaultTimer', defaultTimer); }, [defaultTimer]);
  useEffect(() => { localStorage.setItem('defaultPoints', defaultPoints); }, [defaultPoints]);
  useEffect(() => { localStorage.setItem('shuffleQuestions', String(shuffleQuestions)); }, [shuffleQuestions]);
  useEffect(() => { localStorage.setItem('showCorrectAnswers', String(showCorrectAnswers)); }, [showCorrectAnswers]);

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/api/quizzes/upload-image?folder=avatars', formData);
      setAvatarUrl(res.data.url);
      toast.success('Avatar uploaded');
    } catch {
      toast.error('Avatar upload failed');
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return toast.warning('Name cannot be empty');
    try {
      // Only send name + avatar — email is read-only on the frontend
      await api.put('/api/auth/me', { name: name.trim(), avatar_url: avatarUrl });
      localStorage.setItem('name', name.trim());
      localStorage.setItem('avatar', avatarUrl);
      window.dispatchEvent(new Event('profile-updated'));
      setSaveSuccess(true);
      toast.success('Profile saved');
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) return toast.warning('Enter your current password');
    if (newPassword.length < 8) return toast.warning('New password must be at least 8 characters');
    if (newPassword !== confirmPassword) return toast.warning('Passwords do not match');
    try {
      await api.put('/api/auth/me', { current_password: currentPassword, password: newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to change password');
    }
  };

  const handleExportData = async () => {
    try {
      const [profile, quizzes, sessions] = await Promise.all([
        api.get('/api/auth/me'), api.get('/api/quizzes'), api.get('/api/sessions'),
      ]);
      const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), profile: profile.data, quizzes: quizzes.data, sessions: sessions.data }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'quizflow-export.json'; link.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported');
    } catch { toast.error('Failed to export data'); }
  };

  const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-[var(--theme-text-main)]">{label}</span>
      <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-[var(--theme-border)]'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 bg-[var(--theme-bg-main)] min-h-screen transition-colors duration-300">
      <div className="space-y-1 mb-8">
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[var(--theme-text-main)] tracking-tight">Settings</h1>
        <p className="text-[var(--theme-text-muted)] text-base font-medium">Manage your profile, preferences, and appearance</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <nav className="lg:w-[220px] flex-shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border-l-[3px] border-primary'
                    : 'text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-alt)] hover:text-[var(--theme-text-main)] border-l-[3px] border-transparent'
                }`}
              >
                <TabIcon icon={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 max-w-[720px]">

          {/* ── PROFILE TAB ─────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <Card className="p-8 border-[var(--theme-border)]">
                <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-6">Profile</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group/avatar">
                    <Avatar className="w-20 h-20 text-2xl border-2 border-[var(--theme-border)]">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <AvatarFallback className="bg-primary/20 text-primary uppercase">{(name || 'T')[0]}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-heading text-lg font-bold text-[var(--theme-text-main)]">{name || 'Teacher'}</p>
                    <p className="text-sm text-[var(--theme-text-muted)] mt-0.5">{email || 'Loading...'}</p>
                    <Badge variant="periwinkle" className="mt-1.5">Teacher</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-[var(--theme-text-dim)] tracking-widest">Full Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-[var(--theme-text-dim)] tracking-widest">Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" disabled />
                    <p className="text-[10px] text-[var(--theme-text-dim)]">Contact support to change your email</p>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className={`mt-6 rounded-xl transition-all ${saveSuccess ? 'bg-success hover:bg-success' : ''}`}>
                  {saveSuccess ? '✓ Saved!' : 'Save Changes'}
                </Button>
              </Card>

              {/* Account Actions */}
              <Card className="p-8 border-[var(--theme-border)]">
                <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-2">Account Actions</h2>
                <p className="text-sm text-[var(--theme-text-dim)] mb-6">Export your data or sign out of your account</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="rounded-xl" onClick={handleExportData}>
                    <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export Data
                  </Button>
                  <Button variant="destructive" className="rounded-xl" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                    <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Logout
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* ── APPEARANCE TAB ──────────────────────────── */}
          {activeTab === 'appearance' && (
            <Card className="p-8 border-[var(--theme-border)]">
              <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-2">Appearance</h2>
              <p className="text-sm text-[var(--theme-text-dim)] mb-6">Choose your preferred color theme</p>

              <div className="space-y-4">
                <button onClick={() => setTheme('dark')} className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${theme === 'dark' ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(124,58,237,0.15)]' : 'border-[var(--theme-border)] hover:border-[var(--text-muted)]'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#09090b] border border-[#27272a] flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fafafa" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    </div>
                    <div>
                      <p className="font-heading font-bold text-[var(--text-primary)]">Dark Mode</p>
                      <p className="text-xs text-[var(--text-muted)]">Obsidian aesthetic</p>
                    </div>
                    {theme === 'dark' && <Badge variant="primary" className="ml-auto">Active</Badge>}
                  </div>
                  <div className="flex gap-1.5 mt-4">
                    <div className="h-3 flex-1 rounded-full bg-[#09090b]"/><div className="h-3 flex-1 rounded-full bg-[#16161d]"/><div className="h-3 flex-1 rounded-full bg-[#1e1e28]"/><div className="h-3 flex-1 rounded-full bg-[#7c3aed]"/><div className="h-3 flex-1 rounded-full bg-[#a78bfa]"/>
                  </div>
                </button>

                <button onClick={() => setTheme('light')} className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${theme === 'light' ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(124,58,237,0.15)]' : 'border-[var(--border-default)] hover:border-[var(--text-muted)]'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#e4e4e7] flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    </div>
                    <div>
                      <p className="font-heading font-bold text-[var(--text-primary)]">Light Mode</p>
                      <p className="text-xs text-[var(--text-muted)]">Clean minimal aesthetic</p>
                    </div>
                    {theme === 'light' && <Badge variant="primary" className="ml-auto">Active</Badge>}
                  </div>
                  <div className="flex gap-1.5 mt-4">
                    <div className="h-3 flex-1 rounded-full bg-[#fafafa]"/><div className="h-3 flex-1 rounded-full bg-[#f4f4f5]"/><div className="h-3 flex-1 rounded-full bg-[#e4e4e7]"/><div className="h-3 flex-1 rounded-full bg-[#7c3aed]"/><div className="h-3 flex-1 rounded-full bg-[#a78bfa]"/>
                  </div>
                </button>
              </div>
            </Card>
          )}

          {/* ── QUIZ PREFERENCES TAB ────────────────────── */}
          {activeTab === 'quiz' && (
            <div className="space-y-8">
              <Card className="p-8 border-[var(--theme-border)]">
                <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-2">Default Settings</h2>
                <p className="text-sm text-[var(--theme-text-dim)] mb-6">Applied automatically when you create a new quiz</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-[var(--theme-text-dim)] tracking-widest">Timer per Question</Label>
                    <div className="flex gap-2">
                      {['15', '30', '45', '60'].map((t) => (
                        <Button key={t} variant={defaultTimer === t ? 'default' : 'outline'} size="sm" onClick={() => setDefaultTimer(t)} className="flex-1 rounded-xl">{t}s</Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-[var(--theme-text-dim)] tracking-widest">Points Multiplier</Label>
                    <div className="flex gap-2">
                      {['500', '1000', '2000'].map((p) => (
                        <Button key={p} variant={defaultPoints === p ? 'default' : 'outline'} size="sm" onClick={() => setDefaultPoints(p)} className="flex-1 rounded-xl">{p}</Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-[var(--theme-border)]">
                <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-2">Session Behavior</h2>
                <p className="text-sm text-[var(--theme-text-dim)] mb-4">Control how live sessions behave by default</p>

                <div className="divide-y divide-[var(--theme-border)]">
                  <ToggleSwitch checked={shuffleQuestions} onChange={setShuffleQuestions} label="Shuffle question order" />
                  <ToggleSwitch checked={showCorrectAnswers} onChange={setShowCorrectAnswers} label="Show correct answers after each question" />

                </div>
              </Card>
            </div>
          )}

          {/* ── SECURITY TAB ────────────────────────────── */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <Card className="p-8 border-[var(--theme-border)]">
                <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-2">Change Password</h2>
                <p className="text-sm text-[var(--theme-text-dim)] mb-6">Update your account password</p>

                <div className="space-y-4 max-w-[400px]">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-[var(--theme-text-dim)] tracking-widest">Current Password</Label>
                    <Input type={showPasswords ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-[var(--theme-text-dim)] tracking-widest">New Password</Label>
                    <Input type={showPasswords ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-[var(--theme-text-dim)] tracking-widest">Confirm New Password</Label>
                    <Input type={showPasswords ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" className="h-12 rounded-xl" />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={() => setShowPasswords(!showPasswords)} className="text-xs text-[var(--theme-text-muted)] hover:text-primary transition-colors flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {showPasswords ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                      </svg>
                      {showPasswords ? 'Hide' : 'Show'} passwords
                    </button>
                  </div>

                  <Button onClick={handleChangePassword} className="rounded-xl mt-2">Update Password</Button>
                </div>
              </Card>

              <Card className="p-8 border-[var(--theme-border)]">
                <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-2">Danger Zone</h2>
                <p className="text-sm text-[var(--theme-text-dim)] mb-6">Irreversible actions — proceed with caution</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="rounded-xl border-danger/30 text-danger hover:bg-danger/10" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                    <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out Everywhere
                  </Button>
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
