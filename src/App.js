import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import KakaoCallback from './pages/KakaoCallback/KakaoCallback';
import LoginPage from './pages/LoginPage/LoginPage';
import MainShell from './pages/MainShell/MainShell';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainShell />} />
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
