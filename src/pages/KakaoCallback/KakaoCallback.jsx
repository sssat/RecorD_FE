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
    const code = new URL(window.location.href).searchParams.get('code');
    const redirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    if (code) {
      requestKakaoLoginOnce({ code, redirectUri })
        .then((data) => {
          const { accessToken } = storeAuthResponse(data);

          if (!accessToken) {
            throw new Error('Login response did not include an access token.');
          }

          fetchCurrentUserProfile().catch((profileError) => {
            console.error('Failed to fetch profile after login:', profileError);
          });

          navigate('/');
        })
        .catch((err) => {
          console.error('Backend login error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
          });

          if (getAccessToken()) {
            navigate('/');
            return;
          }

          clearAuthStorage();

          const backendDetail =
            err.response?.data?.detail ||
            err.response?.data?.error ||
            err.message;
          const debugMessage =
            process.env.NODE_ENV === 'development' && backendDetail
              ? `\n\n${backendDetail}`
              : '';

          alert(`로그인 처리에 실패했습니다. 다시 시도해주세요.${debugMessage}`);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#FEE500] rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-600 font-sans">
        카카오 로그인 처리 중입니다...
      </p>
    </div>
  );
};

export default KakaoCallback;
