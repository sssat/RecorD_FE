import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 브라우저 로컬 스토리지에 'token'이 있는지 확인
  const isAuthenticated = !!localStorage.getItem('token');
  // const isAuthenticated = true; // 테스트용 : 항상 인증된 상태로 설정(실제 구현에서는 위의 코드로 대체 / 해당 코드는 로그인 할 필요 없음)

  // 토큰이 없으면 로그인 페이지로 강제 이동
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 토큰이 있으면 자식 컴포넌트(메인 페이지 등) 렌더링
  return children;
};

export default ProtectedRoute;