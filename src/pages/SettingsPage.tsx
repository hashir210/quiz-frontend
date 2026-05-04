import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import api from '../api/client';

export default function SettingsPage() {
  const [name, setName] = useState(() => localStorage.getItem('name') || 'Teacher');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [defaultTimer, setDefaultTimer] = useState(() => localStorage.getItem('defaultTimer') || '30');
  const [defaultPoints, setDefaultPoints] = useState(() => localStorage.getItem('defaultPoints') || '1000');
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    (localStorage.getItem('theme') as 'dark' | 'light' | null) ||
    (document.documentElement.classList.contains('light') ? 'light' : 'dark')
  );

  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => {
        setName(res.data.name);
        setEmail(res.data.email);
        setAvatarUrl(res.data.avatar_url || '');
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('defaultTimer', defaultTimer);
  }, [defaultTimer]);

  useEffect(() => {
    localStorage.setItem('defaultPoints', defaultPoints);
  }, [defaultPoints]);

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/api/quizzes/upload-image', formData);
      setAvatarUrl(res.data.url);
    } catch (err) {
      console.error(err);
      alert('Avatar upload failed');
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/api/auth/me', { name, email, avatar_url: avatarUrl });
      localStorage.setItem('name', name);
      localStorage.setItem('avatar', avatarUrl);
      alert('Profile updated successfully!');
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    const currentPassword = window.prompt('Enter your current password');
    if (!currentPassword) return;
    const newPassword = window.prompt('Enter your new password');
    if (!newPassword) return;
    try {
      await api.put('/api/auth/me', {
        current_password: currentPassword,
        password: newPassword,
      });
      alert('Password changed successfully');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Failed to change password');
    }
  };

  const handleExportData = async () => {
    try {
      const [profile, quizzes, sessions] = await Promise.all([
        api.get('/api/auth/me'),
        api.get('/api/quizzes'),
        api.get('/api/sessions'),
      ]);
      const blob = new Blob([
        JSON.stringify({
          exported_at: new Date().toISOString(),
          profile: profile.data,
          quizzes: quizzes.data,
          sessions: sessions.data,
        }, null, 2),
      ], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quizflow-export.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to export data');
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[var(--theme-bg-main)] min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[var(--theme-text-main)] tracking-tight">
          Settings
        </h1>
        <p className="text-[var(--theme-text-muted)] text-base font-medium">
          Manage your profile, preferences, and appearance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column — Profile & Account */}
        <div className="lg:col-span-2 space-y-8">

          {/* Profile Card */}
          <Card className="p-8 border-[var(--theme-border)]">
            <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-6">Profile</h2>

            <div className="flex items-center gap-6 mb-8">
              <div className="relative group/avatar">
                <Avatar className="w-20 h-20 text-2xl border-2 border-[var(--theme-border)]">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/20 text-primary uppercase">
                      {name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                  />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-heading text-lg font-bold text-[var(--theme-text-main)]">{name}</p>
                <Badge variant="periwinkle" className="mt-1">Teacher</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-[var(--theme-text-dim)] tracking-widest">Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" />
              </div>
            </div>

            <Button onClick={handleSave} className="mt-6 rounded-xl">Save Changes</Button>
          </Card>

          {/* Quiz Defaults */}
          <Card className="p-8 border-[var(--theme-border)]">
            <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-6">Quiz Defaults</h2>
            <p className="text-sm text-[var(--theme-text-dim)] mb-6">
              These settings will be applied to new quizzes by default.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-[var(--theme-text-dim)] tracking-widest">Default Timer (seconds)</Label>
                <div className="flex gap-2">
                  {['15', '30', '45', '60'].map((t) => (
                    <Button
                      key={t}
                      variant={defaultTimer === t ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDefaultTimer(t)}
                      className="flex-1 rounded-xl"
                    >
                      {t}s
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-[var(--theme-text-dim)] tracking-widest">Default Points</Label>
                <div className="flex gap-2">
                  {['500', '1000', '2000'].map((p) => (
                    <Button
                      key={p}
                      variant={defaultPoints === p ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDefaultPoints(p)}
                      className="flex-1 rounded-xl"
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="p-8 border-[var(--theme-border)]">
            <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-6">Account</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-xl" onClick={handleChangePassword}>
                <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Change Password
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={handleExportData}>
                <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Data
              </Button>
              <Button variant="destructive" className="rounded-xl" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
                <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column — Appearance */}
        <div className="space-y-8">
          <Card className="p-8 border-[var(--theme-border)]">
            <h2 className="font-heading text-lg font-bold text-[var(--theme-text-main)] mb-6">Appearance</h2>
            <p className="text-sm text-[var(--theme-text-dim)] mb-6">
              Choose your preferred color theme
            </p>

            <div className="space-y-4">
              {/* Dark Mode Option */}
              <button
                onClick={() => setTheme('dark')}
                className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(0,25,255,0.15)]'
                    : 'border-[var(--theme-border)] hover:border-[var(--text-muted)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#01030d] border border-[#1e2554] flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f8fafc" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-[var(--text-primary)]">Dark Mode</p>
                    <p className="text-xs text-[var(--text-muted)]">Deep Deity aesthetic</p>
                  </div>
                  {theme === 'dark' && (
                    <Badge variant="primary" className="ml-auto">Active</Badge>
                  )}
                </div>
                {/* Preview strip */}
                <div className="flex gap-1.5 mt-4">
                  <div className="h-3 flex-1 rounded-full bg-[#01030d]" />
                  <div className="h-3 flex-1 rounded-full bg-[#0a0f2b]" />
                  <div className="h-3 flex-1 rounded-full bg-[#1e2554]" />
                  <div className="h-3 flex-1 rounded-full bg-[#0019ff]" />
                  <div className="h-3 flex-1 rounded-full bg-[#3347ff]" />
                </div>
              </button>

              {/* Light Mode Option */}
              <button
                onClick={() => setTheme('light')}
                className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                  theme === 'light'
                    ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(0,25,255,0.15)]'
                    : 'border-[var(--border-default)] hover:border-[var(--text-muted)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#ccd1ff] flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0019ff" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-[var(--text-primary)]">Light Mode</p>
                    <p className="text-xs text-[var(--text-muted)]">Clean Periwinkle aesthetic</p>
                  </div>
                  {theme === 'light' && (
                    <Badge variant="primary" className="ml-auto">Active</Badge>
                  )}
                </div>
                {/* Preview strip */}
                <div className="flex gap-1.5 mt-4">
                  <div className="h-3 flex-1 rounded-full bg-[#fcfdff]" />
                  <div className="h-3 flex-1 rounded-full bg-[#e5e8ff]" />
                  <div className="h-3 flex-1 rounded-full bg-[#ccd1ff]" />
                  <div className="h-3 flex-1 rounded-full bg-[#0019ff]" />
                  <div className="h-3 flex-1 rounded-full bg-[#6675ff]" />
                </div>
              </button>
            </div>
          </Card>

          {/* App Info */}
          <Card className="p-8 border-[var(--border-default)]">
            <h2 className="font-heading text-lg font-bold text-[var(--text-primary)] mb-4">About</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Version</span>
                <span className="font-mono text-[var(--text-primary)]">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Theme</span>
                <Badge variant="periwinkle" className="capitalize">{theme}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Design System</span>
                <span className="font-mono text-primary text-xs">Periwinkle</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
