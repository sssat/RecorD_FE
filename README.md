# Recor-D Frontend

프로젝트, 일정, 할 일, 회의록을 한 곳에서 관리하고 포트폴리오 작성까지 이어갈 수 있는 Recor-D 서비스의 프론트엔드입니다.

## 주요 기능

- 카카오 소셜 로그인
- 대시보드 요약 화면
- 프로젝트 관리
- 캘린더 및 할 일 관리
- 회의록 목록, 상세, 작성, 수정, 삭제
- 녹음 파일 업로드 기반 AI 회의록 초안 생성
- 카카오 계정 기반 프로필 설정 화면

## 기술 스택

- React
- React Router
- Axios
- Tailwind CSS
- Create React App

## 실행 방법

### 1. 의존성 설치

```powershell
npm install
```

### 2. 환경변수 설정

`.env.example`을 복사해 `.env` 파일을 만듭니다.

```powershell
Copy-Item .env.example .env
```

로컬 개발 기준 예시는 다음과 같습니다.

```env
REACT_APP_KAKAO_REST_API_KEY=your-kakao-rest-api-key
REACT_APP_KAKAO_REDIRECT_URI=http://localhost:3000/oauth/callback/kakao
REACT_APP_API_BASE_URL=http://localhost:8000
```

### 3. 개발 서버 실행

```powershell
npm start
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```

## 카카오 로그인 설정

Kakao Developers에서 다음 값을 설정합니다.

- 플랫폼: Web
- 사이트 도메인: `http://localhost:3000`
- Redirect URI: `http://localhost:3000/oauth/callback/kakao`
- 카카오 로그인: 활성화
- 클라이언트 시크릿: 백엔드에서 사용하지 않으면 비활성화
- 동의항목: 닉네임

## 백엔드 연동

프론트엔드는 `REACT_APP_API_BASE_URL`에 설정된 백엔드 API와 통신합니다.

로컬 개발에서는 백엔드를 먼저 실행한 뒤 아래 값을 사용합니다.

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

## 사용 가능한 명령어

```powershell
npm start
npm run build
npm test
```

## 주의사항

- 실제 키가 들어 있는 `.env` 파일은 커밋하지 않습니다.
- 공유용 환경변수 형식은 `.env.example`에만 작성합니다.
- `.env`를 수정한 뒤에는 프론트엔드 개발 서버를 재시작해야 합니다.
