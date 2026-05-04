/*
 * KakaoCallback.jsx
 * 카카오 로그인 콜백 처리 페이지
 * 로그인 성공 시 홈으로 리다이렉트, 실패 시 로그인 페이지로 리다이렉트
 * 백엔드 API 주소는 추후 팀 서버에 맞게 수정
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      // 백엔드 API 주소는 추후 팀 서버에 맞게 수정 필요
      axios.get(`http://localhost:8080/api/login/kakao?code=${code}`)
        .then((res) => {
          console.log('로그인 성공:', res.data);
          navigate('/');
        })
        .catch((err) => {
          console.error('로그인 실패:', err);
          navigate('/login');
        });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#FEE500] rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-600">카카오 로그인 처리 중입니다...</p>
    </div>
  );
};

export default KakaoCallback;
