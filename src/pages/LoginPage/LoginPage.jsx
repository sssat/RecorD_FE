import React, { useState } from 'react';
import KakaoButton from '../../components/KakaoButton/KakaoButton';

function LoginPage() {
  // 모달(팝업창)의 상태를 관리하는 State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    content: ''
  });

  // 모달 열기 함수
  const openModal = (title, content) => {
    setModalConfig({ isOpen: true, title, content });
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  return (
    // 데스크톱 전용이므로 브라우저가 너무 작아졌을 때 레이아웃이 깨지지 않도록 최소 너비(min-w-[1024px])를 부여했습니다.
    <div className="flex min-h-screen min-w-[1024px] font-sans bg-slate-50 relative">
      
      {/* ========================================== */}
      {/* 왼쪽: 브랜드 메시지 및 기능 소개 (항상 절반 차지) */}
      {/* ========================================== */}
      <div className="relative flex w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12 text-white xl:p-20 shadow-2xl z-10">
        
        {/* 배경 꾸밈 요소 */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 -right-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-6 inline-flex rounded-full bg-white/5 px-4 py-1.5 text-sm font-semibold text-indigo-200 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
            대학생 맞춤형 커리어 자동화 플랫폼
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            흩어진 대학 생활, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-200">
              하나의 스펙이 되다.
            </span>
          </h1>
          <p className="mb-12 text-lg font-light leading-relaxed text-slate-300">
            학업부터 대외활동, AI 기반 회의록 요약까지. <br />
            누적된 데이터를 바탕으로 나만의 포트폴리오를 구축하세요.
          </p>

          <div className="space-y-4">
            <FeatureItem 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              }
              title="AI 회의록 요약" 
              desc="음성을 텍스트로 변환하고 AI가 핵심만 요약합니다." 
            />
            <FeatureItem 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="스마트 투두리스트" 
              desc="우선순위에 따라 체계적으로 할 일을 관리하세요." 
            />
            <FeatureItem 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              }
              title="통합 캘린더" 
              desc="모든 일정과 프로젝트 진행 상태를 한눈에 파악합니다." 
            />
            <FeatureItem 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              }
              title="포트폴리오 구축" 
              desc="기록된 활동을 바탕으로 이력서 초안을 완성해 시간을 단축합니다." 
            />
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 오른쪽: 로그인 폼 영역 (항상 절반 차지) */}
      {/* ========================================== */}
      <div className="flex w-1/2 items-center justify-center p-12 relative overflow-hidden">
        
        {/* 오른쪽 배경 꾸밈 요소 */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-slate-200/50 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none"></div>

        {/* 로그인 카드 박스 */}
        <div className="relative w-full max-w-md bg-white rounded-[2rem] p-12 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-100 z-10">
          
          <div className="mb-10 text-left">
            <div className="flex items-center justify-start space-x-2 mb-3">
              <h2 className="text-2xl font-bold text-slate-900">반갑습니다!</h2>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-indigo-500 animate-pulse">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed text-left">
              소셜 계정으로 3초만에 가입하고 <br />
              나만의 포트폴리오 관리를 시작해 보세요.
            </p>
          </div>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              간편 로그인
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="mt-8">
            <KakaoButton />
          </div>

          <p className="mt-10 text-center text-[11px] leading-relaxed text-slate-400">
            버튼을 클릭하여 로그인하면 당사의 <br />
            {/* a 태그 대신 button을 사용하여 페이지 새로고침 방지 및 모달 열기 실행 */}
            <button 
              type="button"
              onClick={() => openModal('이용약관', '현빈 원빈 김우빈 신유빈')}
              className="font-medium text-slate-600 hover:text-indigo-600 hover:underline transition-colors"
            >
              이용약관
            </button> 
            <span> 및 </span> 
            <button 
              type="button"
              onClick={() => openModal('개인정보 처리방침', '현빈 원빈 김우빈 신유빈')}
              className="font-medium text-slate-600 hover:text-indigo-600 hover:underline transition-colors"
            >
              개인정보 처리방침
            </button>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>

      {/* ========================================== */}
      {/* 모달 (팝업창) 영역 */}
      {/* ========================================== */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* 모달 헤더 */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">{modalConfig.title}</h3>
              <button 
                onClick={closeModal} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 모달 내용 (사용자가 채울 공간) */}
            <div className="p-6 text-slate-600 text-sm leading-relaxed min-h-[200px] max-h-[60vh] overflow-y-auto whitespace-pre-wrap">
              {modalConfig.content}
            </div>
            
            {/* 모달 푸터 (버튼) */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={closeModal} 
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                확인했습니다
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// 기능 소개 리스트 컴포넌트
function FeatureItem({ icon, title, desc }) {
  return (
    <div className="group flex cursor-default items-center space-x-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-indigo-300 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-slate-100 transition-colors duration-300 group-hover:text-white">{title}</h3>
        <p className="mt-0.5 text-sm text-slate-400 transition-colors duration-300 group-hover:text-slate-200">{desc}</p>
      </div>
    </div>
  );
}

export default LoginPage;