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
      className="flex items-center justify-center w-full py-3 mt-4 text-[#000000] bg-[#FEE500] rounded-md font-semibold hover:bg-[#e6cf00] transition-colors duration-200"
    >
      카카오로 시작하기
    </button>
  );
};

export default KakaoButton;
