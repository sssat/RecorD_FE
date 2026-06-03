/*
 * KakaoCallback.jsx
 * 카카오 로그인 콜백 처리 페이지
 * 로그인 성공 시 홈으로 리다이렉트, 실패 시 로그인 페이지로 리다이렉트
 * 백엔드 API 명세(access, refresh)에 맞춰 토큰 저장 로직 수정 완료
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearAuthStorage,
  fetchCurrentUserProfile,
  getAccessToken,
  requestKakaoLogin,
  storeAuthResponse,
} from '../../utils/auth';

const kakaoLoginRequests = new Map();

const requestKakaoLoginOnce = ({ code, redirectUri }) => {
  if (!kakaoLoginRequests.has(code)) {
    kakaoLoginRequests.set(code, requestKakaoLogin({ code, redirectUri }));
  }

  return kakaoLoginRequests.get(code);
};

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. URL에서 인가 코드(code) 추출
    const code = new URL(window.location.href).searchParams.get('code');
    const redirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    if (code) {
      // 2. 백엔드 API 요청 (POST /api/auth/kakao/)
      requestKakaoLoginOnce({ code, redirectUri })
        .then((data) => {
          const { accessToken } = storeAuthResponse(data);

          if (!accessToken) {
            throw new Error('로그인 응답에 access token이 없습니다.');
          }

          fetchCurrentUserProfile().catch((profileError) => {
            console.error('로그인 후 프로필 조회 실패:', profileError);
          });
          
          // 로그인 성공 시 메인 페이지로 이동
          navigate('/');
        })
        .catch((err) => {
          console.error('백엔드 연동 에러:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
          });

          if (getAccessToken()) {
            navigate('/');
            return;
          }

          clearAuthStorage();
          alert('로그인 처리에 실패했습니다. 다시 시도해주세요.');
          navigate('/login');
        });
    } else {
      // 인가 코드가 없는 경우 로그인 페이지로 리다이렉트
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* 카카오 브랜드 컬러인 #FEE500을 활용한 스피너 */}
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#FEE500] rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-600 font-sans">카카오 로그인 처리 중입니다...</p>
    </div>
  );
};

export default KakaoCallback;
