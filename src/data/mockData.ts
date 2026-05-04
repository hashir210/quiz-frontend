export interface Quiz {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  timePerQuestion: number;
  pointsPerQuestion: number;
  lastRun: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  imageUrl?: string;
  options: AnswerOption[];
  correctOptionIndex: number;
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Student {
  id: string;
  name: string;
  avatarColor: string;
  initial: string;
}

export interface LeaderboardEntry {
  rank: number;
  student: Student;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  avgSpeed: number;
  pointsGained: number;
  rankChange: number;
}

const AVATAR_COLORS = [
  '#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EF4444',
  '#F43F5E', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];

export const mockStudents: Student[] = [
  { id: '1', name: 'Aisha Khan', avatarColor: AVATAR_COLORS[0], initial: 'A' },
  { id: '2', name: 'Ryan Chen', avatarColor: AVATAR_COLORS[1], initial: 'R' },
  { id: '3', name: 'Emma Watson', avatarColor: AVATAR_COLORS[2], initial: 'E' },
  { id: '4', name: 'Marcus Johnson', avatarColor: AVATAR_COLORS[3], initial: 'M' },
  { id: '5', name: 'Sofia Garcia', avatarColor: AVATAR_COLORS[4], initial: 'S' },
  { id: '6', name: 'David Kim', avatarColor: AVATAR_COLORS[5], initial: 'D' },
  { id: '7', name: 'Olivia Brown', avatarColor: AVATAR_COLORS[6], initial: 'O' },
  { id: '8', name: 'James Wilson', avatarColor: AVATAR_COLORS[7], initial: 'J' },
  { id: '9', name: 'Lily Park', avatarColor: AVATAR_COLORS[8], initial: 'L' },
  { id: '10', name: 'Noah Davis', avatarColor: AVATAR_COLORS[9], initial: 'N' },
  { id: '11', name: 'Zara Ahmed', avatarColor: AVATAR_COLORS[0], initial: 'Z' },
  { id: '12', name: 'Ethan Lee', avatarColor: AVATAR_COLORS[1], initial: 'E' },
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'World History: Ancient Civilizations',
    description: 'Test your knowledge of ancient empires and cultures.',
    questionCount: 10,
    timePerQuestion: 30,
    pointsPerQuestion: 1000,
    lastRun: '2 days ago',
    questions: [
      {
        id: 'q1',
        text: 'Which ancient civilization built the Pyramid of Giza?',
        options: [
          { id: 'a', text: 'Roman Empire' },
          { id: 'b', text: 'Ancient Egypt' },
          { id: 'c', text: 'Greek Empire' },
          { id: 'd', text: 'Persian Empire' },
        ],
        correctOptionIndex: 1,
      },
      {
        id: 'q2',
        text: 'The Colosseum is located in which modern-day city?',
        options: [
          { id: 'a', text: 'Athens' },
          { id: 'b', text: 'Istanbul' },
          { id: 'c', text: 'Rome' },
          { id: 'd', text: 'Cairo' },
        ],
        correctOptionIndex: 2,
      },
      {
        id: 'q3',
        text: 'What writing system did the ancient Sumerians develop?',
        options: [
          { id: 'a', text: 'Hieroglyphics' },
          { id: 'b', text: 'Cuneiform' },
          { id: 'c', text: 'Latin Script' },
          { id: 'd', text: 'Sanskrit' },
        ],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: '2',
    title: 'Biology: Cell Structure',
    description: 'Explore the building blocks of life.',
    questionCount: 8,
    timePerQuestion: 45,
    pointsPerQuestion: 1000,
    lastRun: '5 days ago',
    questions: [],
  },
  {
    id: '3',
    title: 'Mathematics: Algebra Basics',
    description: 'Fundamental algebraic expressions and equations.',
    questionCount: 12,
    timePerQuestion: 60,
    pointsPerQuestion: 500,
    lastRun: '1 week ago',
    questions: [],
  },
  {
    id: '4',
    title: 'English Literature: Shakespeare',
    description: 'How well do you know the Bard?',
    questionCount: 15,
    timePerQuestion: 30,
    pointsPerQuestion: 1000,
    lastRun: '3 days ago',
    questions: [],
  },
  {
    id: '5',
    title: 'Geography: Capitals of the World',
    description: 'Can you name the capitals of every country?',
    questionCount: 20,
    timePerQuestion: 15,
    pointsPerQuestion: 500,
    lastRun: '1 day ago',
    questions: [],
  },
  {
    id: '6',
    title: 'Science: The Solar System',
    description: 'Journey through our cosmic neighborhood.',
    questionCount: 10,
    timePerQuestion: 30,
    pointsPerQuestion: 1000,
    lastRun: '4 days ago',
    questions: [],
  },
];

export const mockLeaderboard: LeaderboardEntry[] = mockStudents.map((student, i) => ({
  rank: i + 1,
  student,
  score: Math.max(9500 - i * 850, 1200),
  correctAnswers: Math.max(10 - Math.floor(i * 0.8), 4),
  totalQuestions: 10,
  avgSpeed: +(2.1 + i * 0.4).toFixed(1),
  pointsGained: Math.max(950 - i * 80, 120),
  rankChange: i < 3 ? (3 - i) : i < 6 ? 0 : -(i - 5),
}));

export const currentTeacher = {
  name: 'Dr. Sarah Mitchell',
  email: 'sarah.mitchell@school.edu',
  role: 'Teacher',
  initial: 'S',
  avatarColor: '#0019ff',
};

export const dashboardStats = {
  totalQuizzes: 24,
  sessionsRun: 87,
  studentsReached: 1240,
  avgScore: 76,
  quizChange: 12,
  sessionChange: 8,
  studentChange: 15,
  scoreChange: -3,
};

export const ROOM_CODE = 'X7K2';
