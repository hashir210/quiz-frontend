import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Logo from '../components/Logo';
import { staggerContainer, fadeUpItem, scaleIn } from '../components/PageTransition';

function StatCard({ icon, color, label, value }: {
  icon: string; color: string; label: string; value: string | number;
}) {
  return (
    <Card className="p-6 hover:translate-y-[-4px] transition-all duration-300 border-[var(--theme-border)] shadow-sm hover:shadow-xl group">
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: color + '15', color }}
        >
          {icon}
        </div>
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

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_sessions: 0, total_students: 0, avg_score: 0, best_quiz: '--' });
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const teacherName = localStorage.getItem('name') || 'Teacher';

  useEffect(() => {
    api.get('/api/quizzes').then(res => setQuizzes(res.data)).catch(console.error);
    api.get('/api/sessions/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  const handleHost = async (e: React.MouseEvent, quizId: string) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/api/sessions/start`, { quiz_id: quizId });
      navigate(`/session/${data.room_code}/lobby`);
    } catch (err) {
      console.error('Failed to create session', err);
      toast.error('Could not start live session');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-10 space-y-10 bg-[var(--theme-bg-main)] min-h-screen transition-colors duration-300"
    >
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[var(--theme-text-main)] tracking-tight">
            {greeting}, {teacherName.split(' ')[0]} 👋
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
      </motion.div>

      {/* Stats Section — staggered fade-up */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {[
          { icon: '📚', color: '#7c3aed', label: 'Total Quizzes', value: quizzes.length },
          { icon: '🎯', color: '#10B981', label: 'Sessions Run', value: stats.total_sessions },
          { icon: '👥', color: '#F59E0B', label: 'Students Reached', value: stats.total_students.toLocaleString() },
          { icon: '📊', color: '#EF4444', label: 'Avg Score', value: stats.avg_score ? `${stats.avg_score}` : '--' },
        ].map((s, i) => (
          <motion.div key={i} variants={fadeUpItem}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </motion.div>

      {/* My Quizzes Section */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-between border-b border-[var(--theme-border)] pb-4"
        >
          <h2 className="font-heading text-xl font-semibold text-[var(--theme-text-main)]">My Library</h2>
          <Button variant="link" onClick={() => navigate('/quizzes')} className="text-primary font-semibold hover:no-underline flex items-center gap-1">
            View All <span className="text-lg">→</span>
          </Button>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {quizzes.slice(0, 3).map((quiz) => (
            <motion.div key={quiz.id} variants={scaleIn}>
              <Card
                onClick={() => navigate(`/quiz/${quiz.id}/edit`)}
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
                      {quiz.question_count || 0} Questions
                    </Badge>
                    <Badge variant="primary" className="text-[10px] uppercase tracking-wider font-bold">
                      {quiz.time_per_q || 30}s Limit
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <h3 className="font-heading text-lg font-bold text-[var(--theme-text-main)] group-hover:text-primary transition-colors line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-[var(--theme-text-dim)] font-medium">Created {new Date(quiz.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[var(--theme-border)] group-hover:border-primary/10 transition-colors">
                  <Button
                    className="flex-1 rounded-xl h-11"
                    onClick={(e) => handleHost(e, quiz.id)}
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
            </motion.div>
          ))}
          {quizzes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="col-span-full p-8 text-center border-2 border-dashed border-[var(--theme-border)] rounded-2xl"
            >
              <p className="text-[var(--theme-text-muted)] font-medium">You haven't created any quizzes yet!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
