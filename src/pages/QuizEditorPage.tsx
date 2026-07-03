import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const OPTION_COLORS = ['#6366F1', '#06B6D4', '#F59E0B', '#F43F5E'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

interface QuestionForm {
  id?: string;
  text: string;
  options: string[];
  correctIndex: number;
  image_url?: string;
}

export default function QuizEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timePerQuestion, setTimePerQuestion] = useState(() => localStorage.getItem('defaultTimer') || '30');
  const [pointsPerQuestion, setPointsPerQuestion] = useState(() => localStorage.getItem('defaultPoints') || '1000');
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { text: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);

  useEffect(() => {
    if (id) {
      api.get(`/api/quizzes/${id}`)
        .then(res => {
          const quiz = res.data;
          setTitle(quiz.title);
          setDescription(quiz.description || '');
          setTimePerQuestion(String(quiz.time_per_q));
          setPointsPerQuestion(String(quiz.max_points));
          if (quiz.questions && quiz.questions.length > 0) {
            setQuestions(quiz.questions.map((q: any) => ({
              id: q.id,
              text: q.text,
              options: q.options,
              correctIndex: q.correct_option,
              image_url: q.image_url
            })));
          }
        })
        .catch(err => {
          console.error(err);
          toast.error('Failed to load quiz');
        })
        .finally(() => setFetching(false));
    }
  }, [id]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        options: ['', '', '', ''],
        correctIndex: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = text;
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = oIndex;
    setQuestions(updated);
  };

  const handleImageUpload = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/api/quizzes/upload-image', formData);
      const updated = [...questions];
      updated[index].image_url = res.data.url;
      setQuestions(updated);
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed');
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) return toast.warning('Quiz title is required');
    for (const [i, q] of questions.entries()) {
      if (!q.text.trim()) return toast.warning(`Question ${i + 1} text is required`);
      if (q.options.some(o => !o.trim())) return toast.warning(`Question ${i + 1} is missing option text`);
    }

    setLoading(true);
    try {
      let quizId = id;
      if (id) {
        // Update existing quiz metadata
        await api.put(`/api/quizzes/${id}`, {
          title,
          description,
          time_per_q: parseInt(timePerQuestion),
          max_points: parseInt(pointsPerQuestion)
        });
        
        // Clear old questions before re-adding
        await api.delete(`/api/quizzes/${id}/questions`);
        quizId = id;
      } else {
        const { data: quiz } = await api.post('/api/quizzes', {
          title,
          description,
          time_per_q: parseInt(timePerQuestion),
          max_points: parseInt(pointsPerQuestion)
        });
        quizId = quiz.id;
      }

      // Add questions (Note: This currently duplicates if editing)
      // TODO: Implement proper question update/delete in backend
      await Promise.all(
        questions.map((q, index) => 
          api.post(`/api/quizzes/${quizId}/questions`, {
            text: q.text,
            options: q.options,
            correct_option: q.correctIndex,
            order_index: index,
            image_url: q.image_url
          })
        )
      );
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to publish quiz');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-white">Loading quiz...</div>;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <div className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-default)]">
        <div className="max-w-[800px] mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="hover:scale-105 transition-transform">
              <Logo size={32} />
            </button>
            <div className="h-6 w-px bg-[var(--border-default)]" />
            <nav className="flex items-center gap-2 text-sm font-bold">
              <span className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer" onClick={() => navigate('/dashboard')}>Library</span>
              <span className="text-[var(--text-muted)]">/</span>
              <span className="text-[var(--text-primary)]">{id ? 'Edit Quiz' : 'New Quiz'}</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handlePublish} disabled={loading} size="sm" className="bg-primary shadow-lg shadow-primary/20 px-6 font-bold">
              {loading ? "Saving..." : (id ? "Save Changes" : "Publish")}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 py-8">
        <Card className="p-8 mb-8 border-[var(--border-default)] shadow-2xl rounded-3xl bg-[var(--bg-card)]">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name your quiz..."
            className="border-none bg-transparent font-heading text-3xl font-black h-auto p-0 mb-8 focus-visible:ring-0 placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest ml-1">Time per question</Label>
              <Select value={timePerQuestion} onValueChange={setTimePerQuestion}>
                <SelectTrigger className="h-12 rounded-xl bg-[var(--bg-secondary)] border-[var(--border-default)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="45">45 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                  <SelectItem value="90">90 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest ml-1">Points multiplier</Label>
              <Select value={pointsPerQuestion} onValueChange={setPointsPerQuestion}>
                <SelectTrigger className="h-12 rounded-xl bg-[var(--bg-secondary)] border-[var(--border-default)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">Standard (500)</SelectItem>
                  <SelectItem value="1000">Competitive (1000)</SelectItem>
                  <SelectItem value="2000">Hardcore (2000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest ml-1">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this quiz about?"
              rows={3}
              className="rounded-xl bg-[var(--bg-secondary)] border-[var(--border-default)] resize-none"
            />
          </div>
        </Card>

        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-xl font-black text-[var(--text-primary)] tracking-tight">Questions</h2>
            <Badge variant="periwinkle" className="px-3 py-0.5 rounded-lg font-bold">
              {questions.length} Total
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
        {questions.map((q, qi) => (
          <Card key={qi} className="p-8 border-[var(--border-default)] shadow-xl rounded-3xl bg-[var(--bg-card)] group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                    {qi + 1}
                </div>
                <span className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest">Multiple Choice</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(qi)}
                className="text-[var(--text-muted)] hover:text-danger hover:bg-danger/10 rounded-xl"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </Button>
            </div>

            <div className="space-y-2 mb-8">
                <Label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest ml-1">Question Text</Label>
                <Input
                value={q.text}
                onChange={(e) => updateQuestion(qi, e.target.value)}
                placeholder="Start typing your question..."
                className="h-16 text-lg font-bold rounded-2xl bg-[var(--bg-secondary)] border-[var(--border-default)] px-6"
                />
            </div>
            {/* Image upload zone */}
            <div className="mb-8">
              {q.image_url ? (
                <div className="relative group/img rounded-2xl overflow-hidden border-2 border-[var(--border-default)]">
                  <img src={q.image_url} alt="Question" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button variant="secondary" size="sm" onClick={() => {
                      const updated = [...questions];
                      updated[qi].image_url = undefined;
                      setQuestions(updated);
                    }}>Remove</Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[var(--border-default)] rounded-2xl h-[120px] flex flex-col items-center justify-center hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer relative group/upload">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(qi, e.target.files[0])}
                  />
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-2 group-hover/upload:scale-110 transition-transform">
                    <svg className="text-[var(--text-muted)]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Add Media (Optional)</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
                <Label className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-widest ml-1">Answer Options</Label>
                <RadioGroup value={String(q.correctIndex)} onValueChange={(val) => setCorrectAnswer(qi, parseInt(val))}>
                <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt, oi) => {
                    const isCorrect = q.correctIndex === oi;
                    return (
                        <div
                        key={oi}
                        className={`flex items-center gap-4 p-4 rounded-[20px] transition-all border-2 ${
                            isCorrect
                            ? 'border-success bg-success/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'border-[var(--border-default)] bg-[var(--bg-secondary)] hover:border-[var(--text-muted)]'
                        }`}
                        >
                        <RadioGroupItem value={String(oi)} className="scale-125 border-2" />

                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm"
                            style={{
                            backgroundColor: OPTION_COLORS[oi],
                            color: 'white',
                            }}
                        >
                            {OPTION_LETTERS[oi]}
                        </div>

                        <Input
                            value={opt}
                            onChange={(e) => updateOption(qi, oi, e.target.value)}
                            placeholder={`Option ${OPTION_LETTERS[oi]}`}
                            className="flex-1 h-10 border-none bg-transparent font-bold p-0 focus-visible:ring-0"
                        />

                        {isCorrect && <span className="text-[10px] font-black text-success uppercase tracking-widest mr-2">Correct</span>}
                        </div>
                    );
                    })}
                </div>
                </RadioGroup>
            </div>
          </Card>
        ))}
        </div>

        <Button
          onClick={addQuestion}
          variant="outline"
          className="w-full h-20 border-2 border-dashed border-[var(--border-default)] rounded-[32px] flex items-center justify-center gap-3 text-lg font-black text-[var(--text-muted)] hover:text-primary hover:border-primary hover:bg-primary/5 transition-all mt-8"
        >
          <span className="text-2xl">+</span>
          Add New Question
        </Button>
      </div>
    </div>
  );
}
