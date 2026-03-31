/* 기존 코드 주석 처리 */

/*
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KakaoButton from './components/KakaoButton/KakaoButton';
import KakaoCallback from './pages/KakaoCallback/KakaoCallback';

function App() {
  return (
    <BrowserRouter>
      {/* 임시 메인 컨테이너 디자인 */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
          <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">로그인</h1>
          
          <Routes>
            {/* 메인 화면에 카카오 로그인 버튼 배치 */}
            <Route path="/" element={<KakaoButton />} />
            
            {/* 카카오 로그인 리다이렉트 처리용 라우트 */}
            <Route path="/login/oauth2/callback/kakao" element={<KakaoCallback />} />
          </Routes>
          
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;