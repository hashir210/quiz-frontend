import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TeacherLayout from './layouts/TeacherLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MyQuizzesPage from './pages/MyQuizzesPage';
import ResultsPage from './pages/ResultsPage';
import SettingsPage from './pages/SettingsPage';
import QuizEditorPage from './pages/QuizEditorPage';
import LobbyPage from './pages/LobbyPage';
import BigScreenPage from './pages/BigScreenPage';
import StudentJoinPage from './pages/StudentJoinPage';
import StudentPlayPage from './pages/StudentPlayPage';
import TeacherResultsPage from './pages/TeacherResultsPage';
import StudentEndPage from './pages/StudentEndPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Teacher — sidebar layout */}
        <Route path="/dashboard" element={<TeacherLayout><DashboardPage /></TeacherLayout>} />
        <Route path="/quizzes" element={<TeacherLayout><MyQuizzesPage /></TeacherLayout>} />
        <Route path="/results" element={<TeacherLayout><ResultsPage /></TeacherLayout>} />
        <Route path="/settings" element={<TeacherLayout><SettingsPage /></TeacherLayout>} />

        {/* Quiz Editor — standalone */}
        <Route path="/quiz/new" element={<QuizEditorPage />} />
        <Route path="/quiz/:id/edit" element={<QuizEditorPage />} />

        {/* Session — teacher host views */}
        <Route path="/session/:roomCode/lobby" element={<LobbyPage />} />
        <Route path="/session/:roomCode/screen" element={<BigScreenPage />} />
        <Route path="/session/:roomCode/results" element={<TeacherResultsPage />} />

        {/* Student views */}
        <Route path="/play/:roomCode" element={<StudentJoinPage />} />
        <Route path="/play/:roomCode/game" element={<StudentPlayPage />} />
        <Route path="/play/:roomCode/end" element={<StudentEndPage />} />
      </Routes>
    </BrowserRouter>
  );
}
