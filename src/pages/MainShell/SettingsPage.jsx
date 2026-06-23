import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearAuthStorage,
  clearProfileNameOverride,
  fetchCurrentUserProfile,
  getStoredProfile,
  logoutFromServer,
  updateCurrentUserProfile,
  withdrawFromServer,
} from '../../utils/auth';

function SettingsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getStoredProfile());

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentProfile = await fetchCurrentUserProfile();
        setProfile(currentProfile);
      } catch (error) {
        console.error('프로필 정보를 불러오지 못했습니다:', error);
        setProfile(getStoredProfile());
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const updatedProfile = await updateCurrentUserProfile(profile);
      setProfile(updatedProfile);
      alert('프로필이 저장되었습니다.');
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert('프로필 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) {
      return;
    }

    try {
      await logoutFromServer();
    } catch (error) {
      console.error('서버 로그아웃 처리에 실패했습니다:', error);
    } finally {
      clearAuthStorage();
      navigate('/login');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
      return;
    }

    try {
      await withdrawFromServer();
      clearProfileNameOverride(profile.email);
      clearAuthStorage();
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="w-full space-y-8 font-sans pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">설정</h1>
        <p className="mt-2 text-[15px] font-medium text-slate-400">
          계정 정보와 애플리케이션 설정을 관리하세요
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#FEE500]">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#3c1e1e">
            <path d="M12 3c-4.97 0-9 3.134-9 7 0 2.483 1.66 4.654 4.143 5.922l-.843 3.106c-.05.184.17.324.31.226l3.65-2.503c.553.076 1.123.116 1.74.116 4.97 0 9-3.134 9-7s-4.03-7-9-7z" />
          </svg>
        </div>

        <div>
          <h3 className="text-[17px] font-bold text-slate-900">카카오 계정으로 로그인</h3>
          <p className="text-[13px] font-medium text-slate-400 mt-0.5">
            카카오 소셜 로그인을 사용 중입니다
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 mb-7">
          <svg className="h-6 w-6 text-[#3A3A3A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">프로필</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">닉네임</label>
            <input
              type="text"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="카카오 사용자"
              className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 text-[15px] font-medium text-slate-800 focus:border-[#3A3A3A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3A3A3A] transition-colors"
            />
            <p className="text-[13px] text-slate-400">
              카카오 닉네임을 기반으로 표시됩니다. 이 화면에서 별도로 수정할 수 있습니다.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">이메일</label>
            <div className="relative flex items-center w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3.5 opacity-80 cursor-not-allowed">
              <svg className="h-5 w-5 text-slate-400 mr-2 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>

              <input
                type="email"
                readOnly
                value={profile.email || '이메일 정보 없음'}
                className="w-full bg-transparent text-[15px] font-medium text-slate-500 focus:outline-none cursor-not-allowed"
              />
            </div>

            <p className="text-[13px] text-slate-400">
              이 앱은 현재 카카오 이메일 권한 없이 닉네임 기반으로 로그인합니다.
            </p>
          </div>

          <button
            onClick={handleUpdateProfile}
            className="mt-2 rounded-xl bg-[#3A3A3A] text-white px-6 py-3 font-bold text-[15px] hover:bg-[#000000] transition-colors"
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
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            <div>
              <h3 className="text-[15px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">로그아웃</h3>
              <p className="text-[13px] font-medium text-slate-400 mt-0.5">
                현재 브라우저의 로그인 정보를 삭제합니다
              </p>
            </div>
          </div>

          <div onClick={handleDeleteAccount} className="flex items-center gap-4 rounded-xl border border-[#ff8787] bg-white p-4 transition hover:bg-[#fff0f0] cursor-pointer group shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#ff6b6b]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#ff6b6b]">회원 탈퇴</h3>
              <p className="text-[13px] font-medium text-slate-400 mt-0.5">
                계정과 연결된 데이터를 삭제합니다
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
