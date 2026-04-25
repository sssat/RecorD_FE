import { Link } from 'react-router-dom';
import KakaoButton from '../../components/KakaoButton/KakaoButton';

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.25)]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          캘린더로 돌아가기
        </Link>

        <div className="mt-8">
          <p className="inline-flex rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-700">
            Kakao Social Login
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
            카카오 로그인
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            기존 카카오 로그인 버튼은 그대로 두고, 레이아웃에서만 연결했습니다.
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-600">
            카카오 부분은 수정하지 않고 현재 기본 틀에서 진입만 가능하게 했습니다.
          </p>
          <KakaoButton />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
