import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SettingsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: ''
  });

  // 1. [GET] 내 프로필 조회
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/auth/profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
      
        // 백엔드 응답 스키마(name, email) 매핑
        setProfile({
          name: response.data.name || '',
          email: response.data.email || ''
        });
      } catch (error) {
        console.error('프로필 정보를 불러오지 못했습니다.', error);
      }
    };

    fetchProfile();
  }, []);

  // 2. [PATCH] 내 프로필 수정
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      // 백엔드 요청 바디에 맞춰 { name: "수정할 이름" } 전송
      await axios.patch('http://localhost:8080/api/auth/profile/',
        { name: profile.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('프로필이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 3. [POST] 로그아웃
  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken'); // 로컬에서 리프레시 토큰 꺼내기
      
        // 백엔드 로그아웃 API에 리프레시 토큰 전달
        if (refreshToken) {
          await axios.post('http://localhost:8080/api/auth/logout/',
            { refresh: refreshToken },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (error) {
        console.error('서버 로그아웃 처리 실패 (무시하고 로컬 로그아웃 진행)', error);
      } finally {
        // 성공하든 실패하든 브라우저의 토큰을 모두 지우고 로그인 화면으로 이동
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      }
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
      alert('회원 탈퇴 기능은 현재 백엔드 API 준비 중입니다.');
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">설정</h1>
        <p className="mt-2 text-[15px] font-medium text-slate-400">계정 정보와 애플리케이션 설정을 관리하세요</p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#FEE500]">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#3c1e1e">
            <path d="M12 3c-4.97 0-9 3.134-9 7 0 2.483 1.66 4.654 4.143 5.922l-.843 3.106c-.05.184.17.324.31.226l3.65-2.503c.553.076 1.123.116 1.74.116 4.97 0 9-3.134 9-7s-4.03-7-9-7z" />
          </svg>
        </div>

        <div>
          <h3 className="text-[17px] font-bold text-slate-900">카카오 계정으로 로그인</h3>
          <p className="text-[13px] font-medium text-slate-400 mt-0.5">카카오 소셜 로그인 사용 중</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 mb-7">
           <svg className="h-6 w-6 text-[#8dc63f]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
           </svg>
           <h2 className="text-xl font-extrabold tracking-tight text-slate-900">프로필</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">닉네임</label>
            <input
              type="text"
              value={profile.name} // nickname -> name 변경
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 text-[15px] font-medium text-slate-800 focus:border-[#8dc63f] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8dc63f] transition-colors"
            />
            <p className="text-[13px] text-slate-400">카카오 계정의 닉네임이 변경됩니다</p>
          </div>

          {/* 이메일 (읽기 전용) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">이메일</label>
            <div className="relative flex items-center w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 opacity-80 cursor-not-allowed">
              <svg className="h-5 w-5 text-slate-400 mr-2 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>

              <input
                type="email"
                readOnly
                value={profile.email || "student@kakao.com"}
                className="w-full bg-transparent text-[15px] font-medium text-slate-500 focus:outline-none cursor-not-allowed"
              />
            </div>

            <p className="text-[13px] text-slate-400 flex items-center gap-1.5">
              이메일은 카카오 계정 설정에서만 변경 가능합니다
              <a href="https://accounts.kakao.com" target="_blank" rel="noreferrer" className="text-[#8dc63f] font-semibold hover:underline flex items-center">
                카카오 계정 설정
                <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </p>
          </div>

          <button
            onClick={handleUpdateProfile}
            className="mt-2 rounded-xl bg-[#8dc63f] text-white px-6 py-3 font-bold text-[15px] hover:bg-[#7bb034] transition-colors"
          >
            프로필 저장
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-red-100 bg-[#fff5f5] p-7">
        <h2 className="text-lg font-extrabold tracking-tight text-[#ff6b6b] mb-5">위험 구역</h2>
        <div className="space-y-3">
          <div onClick={handleLogout} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50 cursor-pointer group shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>

            <div>
              <h3 className="text-[15px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">로그아웃</h3>
              <p className="text-[13px] font-medium text-slate-400 mt-0.5">카카오 계정에서 로그아웃합니다</p>
            </div>
          </div>

          <div onClick={handleDeleteAccount} className="flex items-center gap-4 rounded-xl border border-[#ff8787] bg-white p-4 transition hover:bg-[#fff0f0] cursor-pointer group shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#ff6b6b]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#ff6b6b]">회원 탈퇴</h3>
              <p className="text-[13px] font-medium text-slate-400 mt-0.5">카카오 연결을 끊고 모든 데이터가 삭제됩니다</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;