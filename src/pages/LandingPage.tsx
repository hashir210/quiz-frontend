import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '../components/Logo';
import { 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Zap, 
  Smartphone, 
  BarChart3, 
  ShieldCheck, 
  Play, 
  FileText 
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--theme-bg-main)] text-[var(--theme-text-main)] overflow-hidden font-body selection:bg-primary selection:text-white transition-colors duration-300">

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--theme-border)] bg-[var(--theme-bg-main)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Logo size={24} />
              <span className="font-heading text-lg font-bold tracking-tight text-[var(--theme-text-main)]">QuizFlow</span>
            </div>
            <span className="text-[var(--theme-border)] hidden md:inline">/</span>
            <span className="text-xs text-[var(--theme-text-muted)] font-medium hidden md:inline">support@quizflow.ai</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[var(--theme-text-muted)] font-medium">
            <a href="#features" className="hover:text-[var(--theme-text-main)] transition-colors">Features</a>
            <span className="w-1 h-1 rounded-full bg-[var(--theme-border)]" />
            <a href="#how-it-works" className="hover:text-[var(--theme-text-main)] transition-colors">Study Guides</a>
            <span className="w-1 h-1 rounded-full bg-[var(--theme-border)]" />
            <a href="#stats" className="hover:text-[var(--theme-text-main)] transition-colors">Retention</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')} className="rounded-full text-sm font-semibold text-[var(--theme-text-muted)] hover:text-[var(--theme-text-main)]">
              Login
            </Button>
            <Button onClick={() => navigate('/login')} className="rounded-full bg-primary hover:bg-primary-hover text-white font-semibold px-5 shadow-lg text-xs h-9">
              Join Lobby ↗
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero Centered Section ──────────────────────── */}
      <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto text-center z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        
        <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl font-black text-[var(--theme-text-main)] tracking-tight leading-[1.05] mb-6">
          Exams <span className="gradient-text">Made Easier</span>
        </h1>
        
        <p className="text-[var(--theme-text-muted)] text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Convert lecture notes, PDFs, and guides into interactive mock quizzes. Master course material, track performance, and ace your preparation.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => navigate('/login')} className="rounded-full bg-primary hover:bg-primary-hover text-white font-bold px-8 h-14 text-base flex items-center gap-2 shadow-lg shadow-primary/20 transition-all">
            Start Preparing Free
            <ArrowRight className="size-5" />
          </Button>
          <Button variant="outline" onClick={() => navigate('/login')} className="rounded-full border-[var(--theme-border)] bg-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-main)] hover:bg-[var(--theme-surface)] px-8 h-14 text-base">
            Join a Lobby
          </Button>
        </div>
      </section>

      {/* ── Mockups Showcase ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        {/* Dashboard Showcase */}
        <Card className="col-span-1 lg:col-span-2 overflow-hidden border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-2xl relative min-h-[300px] lg:min-h-[400px] group">
          <img 
            src="/dashboard_mockup.png" 
            alt="QuizFlow Study Dashboard" 
            className="w-full h-full object-cover absolute inset-0 opacity-90 group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-main)]/60 to-transparent pointer-events-none" />
          {/* Logo overlay */}
          <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-lg">
            <Logo size={20} />
            <span className="text-xs font-semibold text-white">AI Study Guide Dashboard</span>
          </div>
        </Card>

        {/* Mobile Showcase */}
        <Card className="col-span-1 overflow-hidden border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-2xl relative min-h-[300px] lg:min-h-[400px] group">
          <img 
            src="/mobile_mockup.png" 
            alt="QuizFlow Mobile Play" 
            className="w-full h-full object-cover absolute inset-0 opacity-90 group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-main)]/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-lg">
            <Smartphone className="size-4 text-primary animate-pulse" />
            <span className="text-xs font-semibold text-white">Live Classroom Play</span>
          </div>
        </Card>
      </section>

      {/* ── How It Works Section ───────────────────────── */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-6 border-t border-[var(--theme-border)] mt-20">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Simple Process</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 border-[var(--theme-border)] bg-[var(--theme-surface)]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <FileText className="size-6" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-2">1. Upload Material</h3>
            <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed">
              Import study guides, slides, or notes. Our AI parser extracts key topics instantly.
            </p>
          </Card>
          <Card className="p-8 border-[var(--theme-border)] bg-[var(--theme-surface)]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Sparkles className="size-6" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-2">2. Generate Quizzes</h3>
            <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed">
              Create mock exams and custom flashcards custom-tailored to your syllabus in seconds.
            </p>
          </Card>
          <Card className="p-8 border-[var(--theme-border)] bg-[var(--theme-surface)]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Play className="size-6" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-2">3. Play & Excel</h3>
            <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed">
              Review live with peers or play solo to test your active recall and ace your finals.
            </p>
          </Card>
        </div>
      </section>

      {/* ── Trust Partners / Universities ──────────────── */}
      <section className="py-12 border-b border-[var(--theme-border)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-8 opacity-30 grayscale select-none">
          <span className="font-heading text-base font-black tracking-[0.25em] uppercase text-[var(--theme-text-muted)]">Stanford</span>
          <span className="font-heading text-base font-black tracking-[0.25em] uppercase text-[var(--theme-text-muted)]">MIT</span>
          <span className="font-heading text-base font-black tracking-[0.25em] uppercase text-[var(--theme-text-muted)]">Harvard</span>
          <span className="font-heading text-base font-black tracking-[0.25em] uppercase text-[var(--theme-text-muted)]">Berkeley</span>
          <span className="font-heading text-base font-black tracking-[0.25em] uppercase text-[var(--theme-text-muted)]">NYU</span>
        </div>
      </section>

      {/* ── Core Features Grid ─────────────────────────── */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 border-t border-[var(--theme-border)]">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Core Features</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Real-time Sync", desc: "Questions sync instantly across student devices. Zero lag." },
            { icon: Smartphone, title: "No App Installs", desc: "Join via QR code or web link. Works instantly on any mobile browser." },
            { icon: Trophy, title: "Interactive Leaderboards", desc: "Gamified scores keep learning competitive, engaging, and fun." },
            { icon: Sparkles, title: "AI-Powered Generation", desc: "Instantly build full mock exams from your textbooks." },
            { icon: BarChart3, title: "Detailed Analytics", desc: "Identify knowledge gaps with itemized individual performance reports." },
            { icon: ShieldCheck, title: "Secure & Encrypted", desc: "Enterprise-grade safety keeping class rosters private." }
          ].map((feat, i) => (
            <Card key={i} className="p-6 border-[var(--theme-border)] bg-[var(--theme-surface)] hover:border-primary/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <feat.icon className="size-5" />
              </div>
              <h3 className="font-heading text-base font-bold mb-2">{feat.title}</h3>
              <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Stats & Details Section ─────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-t border-[var(--theme-border)] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-7xl lg:text-9xl font-black text-[var(--theme-text-main)] tracking-tight leading-none">98.4%</h2>
          <p className="text-[var(--theme-text-dim)] text-xs font-bold uppercase tracking-widest">Average exam scores retention rate</p>
        </div>
        <div className="space-y-6 lg:pl-12 lg:border-l border-[var(--theme-border)]">
          <h3 className="font-heading text-3xl lg:text-5xl font-extrabold text-[var(--theme-text-main)] tracking-tight leading-tight">
            Master Your Courses Efficiently
          </h3>
          <p className="text-[var(--theme-text-muted)] text-base leading-relaxed">
            Active recall and gamified review are scientifically proven to double memory retention compared to passive reading. Automatically generate revision aids custom to your class materials.
          </p>
          <Button onClick={() => navigate('/login')} className="rounded-full bg-primary hover:bg-primary-hover text-white font-bold px-8 h-12 flex items-center gap-2 shadow-lg shadow-primary/20 text-sm">
            Start Studying Now
          </Button>
        </div>
      </section>

      {/* ── Testimonial Strip ───────────────────────────── */}
      <section className="py-20 border-t border-[var(--theme-border)] bg-[var(--theme-bg-alt)]/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-12 h-12 rounded-full border-2 border-[var(--theme-bg-main)] bg-primary/20 overflow-hidden shadow-md">
                <img 
                  src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80&index=${i}`} 
                  alt="Student Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
          <div className="col-span-2">
            <p className="text-[var(--theme-text-muted)] text-lg italic leading-relaxed">
              "QuizFlow completely streamlined my final exam preparation. Toggling mock tests directly from my lecture slides saved me days of study, and my scores rose exponentially."
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-[#10B981] mt-3">Sarah J. — Biology & Medical Student</p>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-[var(--theme-border)] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span className="font-heading text-sm font-bold tracking-tight text-[var(--theme-text-muted)]">QuizFlow</span>
          </div>
          <p className="text-xs text-[var(--theme-text-dim)]">© {new Date().getFullYear()} QuizFlow. Study preparation made simple.</p>
        </div>
      </footer>
    </div>
  );
}
