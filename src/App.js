import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import KakaoCallback from './pages/KakaoCallback/KakaoCallback';
import LoginPage from './pages/LoginPage/LoginPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import DashboardPage from './pages/MainShell/DashboardPage';
import MainShell from './pages/MainShell/MainShell';
import PlaceholderPage from './pages/MainShell/PlaceholderPage';
import ProjectPage from './pages/Project/ProjectPage';
import SettingsPage from './pages/MainShell/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainShell />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="records"
            element={
              <PlaceholderPage
                title="회의록"
                description="회의 내용을 정리하고 공유하는 공간을 준비 중입니다."
              />
            }
          />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="projects" element={<ProjectPage />} />
          <Route path="settings" element={<SettingsPage />} />
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
