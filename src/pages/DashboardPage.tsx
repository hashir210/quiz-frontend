import { useNavigate } from 'react-router-dom';
import { mockQuizzes, dashboardStats, currentTeacher, ROOM_CODE } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '../components/Logo';

function StatCard({ icon, color, label, value, change }: {
  icon: string; color: string; label: string; value: string | number; change: number;
}) {
  const isPositive = change >= 0;
  return (
    <Card className="p-6 hover:translate-y-[-4px] transition-all duration-300 border-[var(--theme-border)] shadow-sm hover:shadow-xl group">
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: color + '15', color }}
        >
          {icon}
        </div>
        <Badge variant={isPositive ? 'success' : 'danger'} className="font-semibold">
          {isPositive ? '↑' : '↓'}{Math.abs(change)}%
        </Badge>
      </div>
      <div className="mt-6">
        <p className="text-3xl font-bold text-[var(--theme-text-main)] tracking-tight">{value}</p>
        <p className="text-sm font-medium text-[var(--theme-text-muted)] mt-1">{label}</p>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-[var(--theme-bg-main)] min-h-screen transition-colors duration-300">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[var(--theme-text-main)] tracking-tight">
            {greeting}, {currentTeacher.name.split(' ')[0]} 👋
          </h1>
          <p className="text-[var(--theme-text-muted)] text-base font-medium">Ready to inspire your students today?</p>
        </div>
        <Button 
          size="xl" 
          onClick={() => navigate('/quiz/new')} 
          className="gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/40 rounded-2xl h-14 px-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create New Quiz
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon="📚" color="#0019ff" label="Total Quizzes" value={dashboardStats.totalQuizzes} change={dashboardStats.quizChange} />
        <StatCard icon="🎯" color="#10B981" label="Sessions Run" value={dashboardStats.sessionsRun} change={dashboardStats.sessionChange} />
        <StatCard icon="👥" color="#F59E0B" label="Students Reached" value={dashboardStats.studentsReached.toLocaleString()} change={dashboardStats.studentChange} />
        <StatCard icon="📊" color="#EF4444" label="Avg Score" value={`${dashboardStats.avgScore}%`} change={dashboardStats.scoreChange} />
      </div>

      {/* My Quizzes Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-4">
          <h2 className="font-heading text-xl font-semibold text-[var(--theme-text-main)]">My Library</h2>
          <Button variant="link" className="text-primary font-semibold hover:no-underline flex items-center gap-1">
            View All <span className="text-lg">→</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="group p-6 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer border-[var(--theme-border)] hover:shadow-2xl hover:border-primary/30 relative overflow-hidden"
            >
              {/* Card Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between mb-6">
                <div className="bg-[var(--theme-bg-alt)] p-3 rounded-2xl border border-[var(--theme-border)] group-hover:border-primary/20 transition-colors">
                  <Logo size={28} />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge variant="periwinkle" className="text-[10px] uppercase tracking-wider font-bold">
                    {quiz.questionCount} Questions
                  </Badge>
                  <Badge variant="primary" className="text-[10px] uppercase tracking-wider font-bold">
                    {quiz.timePerQuestion}s Limit
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h3 className="font-heading text-lg font-bold text-[var(--theme-text-main)] group-hover:text-primary transition-colors line-clamp-1">
                  {quiz.title}
                </h3>
                <p className="text-xs text-[var(--theme-text-dim)] font-medium">Last active {quiz.lastRun}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[var(--theme-border)] group-hover:border-primary/10 transition-colors">
                <Button
                  className="flex-1 rounded-xl h-11"
                  onClick={(e) => { e.stopPropagation(); navigate(`/session/${ROOM_CODE}/lobby`); }}
                >
                  Host Live
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl h-11 border-[var(--theme-border)] hover:bg-[var(--theme-bg-alt)]"
                  onClick={(e) => { e.stopPropagation(); navigate(`/quiz/${quiz.id}/edit`); }}
                >
                  Editor
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
