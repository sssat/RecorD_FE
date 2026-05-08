import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import KakaoCallback from './pages/KakaoCallback/KakaoCallback';
import CalendarPage from './pages/Calendar/CalendarPage';
import LoginPage from './pages/LoginPage/LoginPage';
import MainShell from './pages/MainShell/MainShell';
import DashboardPage from './pages/MainShell/DashboardPage';
import PlaceholderPage from './pages/MainShell/PlaceholderPage';
import MeetingNotesPage from './pages/MeetingNotes/MeetingNotesPage';
import ProjectPage from './pages/Project/ProjectPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="records" element={<MeetingNotesPage />} />
          <Route path="records/:meetingNoteId" element={<MeetingNotesPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route
            path="projects"
            element={
              <PlaceholderPage
                title="프로젝트"
                description="프로젝트별 회의록과 할 일, 진행 상태를 한 번에 관리할 수 있도록 준비 중입니다."
              />
            }
          />
          <Route path="projects" element={<ProjectPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/login/oauth2/callback/kakao"
          element={<KakaoCallback />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
