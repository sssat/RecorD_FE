/*
 * KakaoCallback.jsx
 * 카카오 로그인 콜백 처리 페이지
 * 로그인 성공 시 홈으로 리다이렉트, 실패 시 로그인 페이지로 리다이렉트
 * 백엔드 API 명세(access, refresh)에 맞춰 토큰 저장 로직 수정 완료
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. URL에서 인가 코드(code) 추출
    const code = new URL(window.location.href).searchParams.get('code');
    const redirect_uri = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    if (code) {
      // 2. 백엔드 API 요청 (POST /api/auth/kakao/)
      axios.post('http://localhost:8080/api/auth/kakao/', {
        code: code,
        redirect_uri: redirect_uri
      })
        .then((res) => {
          console.log('로그인 성공 응답 데이터:', res.data);
          
          /* * [중요] 백엔드 Swagger 명세서 구조 반영
           * res.data.access -> 서비스 접근용 토큰 (token으로 저장)
           * res.data.refresh -> 토큰 갱신 및 로그아웃용 토큰 (refreshToken으로 저장)
           */
          localStorage.setItem('token', res.data.access);
          localStorage.setItem('refreshToken', res.data.refresh);
          
          // 로그인 성공 시 메인 페이지로 이동
          navigate('/');
        })
        .catch((err) => {
          console.error('백엔드 연동 에러:', err);
          
          // --- 프론트엔드 테스트용 강제 로그인 처리 로직 ---
          // 실제 백엔드가 구동되지 않을 때 흐름을 보기 위한 코드
          alert('백엔드 미배포 상태입니다. 테스트를 위해 임시 토큰을 생성하여 메인으로 이동합니다.');
          
          localStorage.setItem('token', 'test-access-token');
          localStorage.setItem('refreshToken', 'test-refresh-token');
          
          navigate('/');
          // ------------------------------------------------
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