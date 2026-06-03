/*
 * KakaoButton.jsx
 * 카카오 로그인 버튼 컴포넌트
 * REST API 키와 리다이렉트 URI는 .env 파일에서 관리
 */

import React from 'react';

const KakaoButton = () => {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <button 
      onClick={handleLogin}
      className="relative flex w-full items-center justify-center rounded-xl bg-[#FEE500] px-4 py-4 text-[15px] font-semibold text-[#000000] shadow-sm transition-colors duration-200 hover:bg-[#FADA0A] focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:ring-offset-2"
    >
      {/* 카카오 공식 심볼 아이콘 (SVG) */}
      <svg 
        className="absolute left-6 h-5 w-5" 
        viewBox="0 0 32 32" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="#000000" d="M16 4.64c-6.96 0-12.64 4.48-12.64 10.08 0 3.52 2.32 6.64 5.76 8.48l-1.44 5.44c-.16.56.48.96.96.64l6.24-4.24c.4.08.8.08 1.12.08 6.96 0 12.64-4.48 12.64-10.08S22.96 4.64 16 4.64z"/>
      </svg>
      카카오 로그인
    </button>
  );
};

export default KakaoButton;