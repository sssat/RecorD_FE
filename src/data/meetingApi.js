import { getProjectWorkspace } from './projectApi';

const MEETING_NOTES_STORAGE_KEY = 'record-meeting-notes';
const MEETING_NOTES_STORAGE_VERSION_KEY = 'record-meeting-notes-version';
const DEFAULT_MEETING_NOTES_VERSION = 2;
const MAX_AUDIO_FILE_SIZE = 50 * 1024 * 1024;
const SUPPORTED_AUDIO_EXTENSIONS = ['mp3', 'wav', 'm4a'];

const BASE_PROJECT_OPTIONS = [
  '포트폴리오 관리 시스템',
  '캡스톤 디자인',
  '취업 준비 스터디',
  'AI 서비스 실험실',
];

const DEFAULT_MEETING_NOTES = [
  {
    id: 'meeting-1',
    project: '포트폴리오 관리 시스템',
    title: '프로젝트 기획 회의',
    date: '2026-04-14',
    durationMinutes: 45,
    participants: ['김철수', '이영희', '박민수', '정수진', '최동욱'],
    summary:
      '새로운 포트폴리오 관리 시스템의 기능 요구사항을 정의하고 우선순위를 결정했습니다.',
    tags: ['기획', '요구사항'],
    transcript:
      '안녕하세요. 오늘 회의에서는 포트폴리오 관리 시스템의 핵심 기능에 대해 논의했습니다.\n회의록 자동 생성, 일정 관리, STAR 기법 기반 포트폴리오 작성 지원을 우선 구현 대상으로 정리했습니다.\n사용자 친화적인 인터페이스와 빠른 입력 흐름이 중요하다는 점도 함께 확인했습니다.',
    keyPoints: [
      'AI 자동 요약으로 사용자 편의성 향상',
      'STAR 기법 템플릿 제공',
      'Eva Design 색상 시스템 적용',
      '프로젝트 단위 통합 관리 기능',
    ],
    actionItems: [
      'UI/UX 와이어프레임 작성 (담당: 이영희, 기한: 04/18)',
      '데이터베이스 스키마 설계 (담당: 박민수, 기한: 04/20)',
      'AI 요약 API 조사 (담당: 김철수, 기한: 04/19)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-14T10:30:00.000Z',
    updatedAt: '2026-04-14T10:30:00.000Z',
  },
  {
    id: 'meeting-2',
    project: '포트폴리오 관리 시스템',
    title: '디자인 리뷰 미팅',
    date: '2026-04-13',
    durationMinutes: 60,
    participants: ['이영희', '정수진', '최동욱', '박민수'],
    summary:
      'UI/UX 디자인 시안을 검토하고 사용자 친화적인 인터페이스 개선안을 논의했습니다.',
    tags: ['디자인', '리뷰'],
    transcript:
      '메인 대시보드와 회의록 페이지 시안을 중심으로 리뷰를 진행했습니다.\n검색 바 영역의 여백과 카드 타이포그래피를 정리하고, 초록 계열 CTA 버튼의 대비를 맞추는 방향으로 의견을 모았습니다.',
    keyPoints: [
      '회의록 카드 간 여백 확대',
      '검색과 필터 영역을 하나의 패널로 묶기',
      '모바일에서 액션 버튼 세로 정렬 처리',
    ],
    actionItems: [
      '회의록 상세 페이지 시안 보완 (담당: 이영희)',
      '공통 배지 스타일 정의 (담당: 최동욱)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-13T06:00:00.000Z',
    updatedAt: '2026-04-13T06:00:00.000Z',
  },
  {
    id: 'meeting-3',
    project: '포트폴리오 관리 시스템',
    title: '스프린트 회고',
    date: '2026-04-10',
    durationMinutes: 90,
    participants: ['김철수', '이영희', '박민수', '정수진', '최동욱', '홍길동'],
    summary:
      '지난 스프린트의 성과를 돌아보고 다음 스프린트의 개선 사항을 도출했습니다.',
    tags: ['회고', '스프린트'],
    transcript:
      '이번 회고에서는 캘린더 구현 속도는 좋았지만, 공통 컴포넌트 정리가 늦어졌다는 점을 공유했습니다.\n다음 스프린트에서는 기능 구현과 동시에 재사용 가능한 UI를 정리하기로 했습니다.',
    keyPoints: [
      '캘린더 기능 구현 속도는 양호',
      '공통 컴포넌트 정리 시점이 늦었음',
      '다음 스프린트부터 QA 체크리스트 병행',
    ],
    actionItems: [
      '공통 버튼/모달 규칙 문서화 (담당: 정수진)',
      'QA 항목 템플릿 추가 (담당: 홍길동)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-10T08:00:00.000Z',
    updatedAt: '2026-04-10T08:00:00.000Z',
  },
  {
    id: 'meeting-4',
    project: 'AI 서비스 실험실',
    title: 'STT 엔진 연동 점검',
    date: '2026-04-09',
    durationMinutes: 35,
    participants: ['김철수', '최동욱', '홍길동'],
    summary:
      'Whisper 기반 전사 API 연동 구조와 파일 업로드 예외 처리 방식을 정리했습니다.',
    tags: ['AI', 'STT'],
    transcript:
      '지원 파일 포맷과 최대 용량 제한을 프론트에서 먼저 검증하고, 실패 시 사용자에게 명확한 메시지를 보여주자는 결론을 냈습니다.\n서버 응답 대기 중에는 진행 상태를 표시하기로 했습니다.',
    keyPoints: [
      '업로드 전 확장자/용량 선검증',
      '진행 상태 표시 필요',
      '실패 시 재시도 동선 제공',
    ],
    actionItems: [
      '업로드 예외 메시지 문구 정리 (담당: 홍길동)',
      'STT 응답 구조 샘플 수집 (담당: 김철수)',
    ],
    sourceType: 'upload',
    audioFileName: 'stt-sync.mp3',
    createdAt: '2026-04-09T03:20:00.000Z',
    updatedAt: '2026-04-09T03:20:00.000Z',
  },
  {
    id: 'meeting-5',
    project: '캡스톤 디자인',
    title: '포트폴리오 문구 정리 회의',
    date: '2026-04-07',
    durationMinutes: 50,
    participants: ['박민수', '정수진', '이영희'],
    summary:
      '프로젝트 결과를 STAR 형식으로 표현하는 문장 구조와 핵심 키워드를 정리했습니다.',
    tags: ['STAR', '문구'],
    transcript:
      '사용자가 그대로 복사해서 활용할 수 있을 정도로 완성도 있는 초안을 제공하자는 의견이 많았습니다.\n성과 수치는 가능한 정량적으로 정리하는 방향으로 합의했습니다.',
    keyPoints: [
      '행동과 결과를 분리해 작성',
      '정량 수치 강조',
      '사용자 편집 여지를 남긴 초안 제공',
    ],
    actionItems: [
      'STAR 템플릿 톤앤매너 작성 (담당: 정수진)',
      '예시 포트폴리오 3종 제작 (담당: 이영희)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-07T11:10:00.000Z',
    updatedAt: '2026-04-07T11:10:00.000Z',
  },
  {
    id: 'meeting-6',
    project: '포트폴리오 관리 시스템',
    title: 'API 명세 점검',
    date: '2026-04-05',
    durationMinutes: 40,
    participants: ['김철수', '박민수', '홍길동'],
    summary:
      '회의록 저장, 수정, 삭제와 프로젝트 연결 API의 요청/응답 필드를 정의했습니다.',
    tags: ['API', '백엔드'],
    transcript:
      '회의록 목록에서는 요약 정보만 내려주고, 상세 화면 진입 시 전사문과 액션 아이템을 추가 조회하는 구조를 우선 고려했습니다.\n프로젝트 필터링을 위해 projectId와 projectName을 함께 내려주는 방향을 검토했습니다.',
    keyPoints: [
      '목록/상세 응답 필드 분리',
      '프로젝트 연결 정보 포함',
      '수정 이력용 updatedAt 필드 유지',
    ],
    actionItems: [
      'API 명세 초안 공유 (담당: 박민수)',
      '프론트 타입 정리 (담당: 홍길동)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-05T02:30:00.000Z',
    updatedAt: '2026-04-05T02:30:00.000Z',
  },
  {
    id: 'meeting-7',
    project: '취업 준비 스터디',
    title: '모의 면접 회고',
    date: '2026-04-03',
    durationMinutes: 55,
    participants: ['이서연', '김하늘', '최유진', '손민재'],
    summary:
      '모의 면접에서 나온 피드백을 정리하고 다음 준비 항목을 액션 아이템으로 분배했습니다.',
    tags: ['면접', '회고'],
    transcript:
      '답변 구조는 안정적이었지만 사례의 임팩트가 부족하다는 피드백이 있었습니다.\n다음 주까지 프로젝트 기반 답변 예시를 각자 정리해 오기로 했습니다.',
    keyPoints: [
      '답변 구조는 안정적',
      '사례 전달력 보완 필요',
      '프로젝트 경험 정리 숙제 부여',
    ],
    actionItems: [
      '질문별 STAR 답변 초안 작성 (담당: 전원)',
      '포트폴리오 첨삭 회의 예약 (담당: 손민재)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-03T13:00:00.000Z',
    updatedAt: '2026-04-03T13:00:00.000Z',
  },
  {
    id: 'meeting-8',
    project: '포트폴리오 관리 시스템',
    title: '캘린더 동기화 회의',
    date: '2026-04-01',
    durationMinutes: 30,
    participants: ['김철수', '박민수', '정수진'],
    summary:
      'Google Calendar 연동 범위와 캘린더/투두 연계 표시 방식을 정리했습니다.',
    tags: ['캘린더', '연동'],
    transcript:
      '외부 캘린더 동기화는 읽기 중심으로 먼저 구현하고, 쓰기 연동은 이후 단계로 분리하기로 했습니다.\nUI에서는 외부 일정과 내부 일정을 색상으로 구분합니다.',
    keyPoints: [
      '읽기 연동 우선',
      '외부/내부 일정 색상 구분',
      'D-Day 배지 유지',
    ],
    actionItems: [
      'OAuth 범위 재확인 (담당: 김철수)',
      '색상 토큰 정리 (담당: 정수진)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-01T04:40:00.000Z',
    updatedAt: '2026-04-01T04:40:00.000Z',
  },
  {
    id: 'meeting-9',
    project: '캡스톤 디자인',
    title: '데이터 모델 설계 회의',
    date: '2026-03-29',
    durationMinutes: 65,
    participants: ['박민수', '최동욱', '홍길동', '정수진'],
    summary:
      '회의록, 투두, 프로젝트 간 관계형 데이터 모델과 조회 전략을 정의했습니다.',
    tags: ['DB', '설계'],
    transcript:
      '회의록은 프로젝트에 선택적으로 연결하고, 투두와 액션 아이템을 별도 테이블로 분리할지 논의했습니다.\n초기 버전은 단일 문서 저장 방식으로 구현한 뒤 이후 정규화를 진행하기로 했습니다.',
    keyPoints: [
      '초기 버전은 문서형 구조 사용',
      '프로젝트 연결은 선택 사항',
      '향후 액션 아이템 분리 가능성 확보',
    ],
    actionItems: [
      'ERD v1 작성 (담당: 박민수)',
      '조회 쿼리 시나리오 작성 (담당: 최동욱)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-03-29T07:15:00.000Z',
    updatedAt: '2026-03-29T07:15:00.000Z',
  },
  {
    id: 'meeting-10',
    project: '포트폴리오 관리 시스템',
    title: 'QA 체크 미팅',
    date: '2026-03-27',
    durationMinutes: 25,
    participants: ['홍길동', '정수진', '최동욱'],
    summary:
      '배포 전 점검 항목과 회의록 작성/수정 플로우의 QA 체크리스트를 정리했습니다.',
    tags: ['QA', '체크리스트'],
    transcript:
      '필수 입력값 누락, 용량 초과 업로드, 삭제 확인 흐름을 우선 검증 대상으로 삼았습니다.\n모바일에서 모달 높이와 스크롤도 반드시 확인하기로 했습니다.',
    keyPoints: [
      '필수 입력값 누락 검증',
      '업로드 예외 확인',
      '모바일 모달 스크롤 검증',
    ],
    actionItems: [
      'QA 시트 업데이트 (담당: 정수진)',
      '모바일 점검 화면 녹화 (담당: 홍길동)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-03-27T01:45:00.000Z',
    updatedAt: '2026-03-27T01:45:00.000Z',
  },
  {
    id: 'meeting-11',
    project: 'AI 서비스 실험실',
    title: 'LLM 요약 품질 점검',
    date: '2026-03-24',
    durationMinutes: 42,
    participants: ['김철수', '홍길동', '손민재'],
    summary:
      '회의 요약에서 액션 아이템 추출 정확도를 높이기 위한 프롬프트 개선 포인트를 확인했습니다.',
    tags: ['LLM', '프롬프트'],
    transcript:
      '액션 아이템은 담당자와 기한이 포함되도록 프롬프트를 고정하고, 요약 길이는 3문장 이내로 제한하는 방안을 검토했습니다.',
    keyPoints: [
      '담당자/기한 추출 규칙 보강',
      '요약 길이 제한 필요',
      '개인 할 일 강조',
    ],
    actionItems: [
      '프롬프트 초안 수정 (담당: 김철수)',
      '샘플 데이터셋 구축 (담당: 손민재)',
    ],
    sourceType: 'upload',
    audioFileName: 'llm-quality-check.m4a',
    createdAt: '2026-03-24T05:10:00.000Z',
    updatedAt: '2026-03-24T05:10:00.000Z',
  },
  {
    id: 'meeting-12',
    project: '취업 준비 스터디',
    title: '자소서 사례 정리',
    date: '2026-03-21',
    durationMinutes: 48,
    participants: ['이서연', '김하늘', '최유진'],
    summary:
      '자기소개서에 반영할 프로젝트 사례를 분류하고 보완이 필요한 경험을 정리했습니다.',
    tags: ['자소서', '사례'],
    transcript:
      '프로젝트 경험은 역할, 문제, 해결 과정, 결과를 분리해 정리해야 한다는 점을 다시 확인했습니다.\n회의록과 투두 기록을 근거 자료로 활용하기로 했습니다.',
    keyPoints: [
      '역할/문제/행동/결과 구조 유지',
      '근거 자료로 회의록 활용',
      '부족한 사례는 추가 기록 필요',
    ],
    actionItems: [
      '프로젝트별 사례 2건씩 정리 (담당: 전원)',
      '기록 보강 필요한 프로젝트 체크 (담당: 이서연)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-03-21T09:20:00.000Z',
    updatedAt: '2026-03-21T09:20:00.000Z',
  },
];

const PAGINATION_SHOWCASE_MEETING_NOTES = [
  {
    id: 'meeting-13',
    project: 'AI 챗봇 프로젝트',
    title: 'AI 챗봇 요구사항 분석',
    date: '2026-04-12',
    durationMinutes: 60,
    participants: ['김도윤', '박서연'],
    summary:
      'AI 챗봇 프로젝트의 기능 요구사항을 분석하고 기술 스택을 결정했습니다.',
    tags: ['AI', '기획'],
    transcript:
      '이번 회의에서는 AI 챗봇 프로젝트의 핵심 기능 범위를 먼저 정리했습니다.\n' +
      '사용자 질문 분류, 답변 생성 흐름, 관리자 대시보드 필요 여부를 중심으로 우선순위를 정했고 React와 Python 기반 구조를 사용하기로 결정했습니다.\n' +
      '다음 단계에서는 데이터 수집 범위와 MVP 화면 구성을 구체화하기로 했습니다.',
    keyPoints: [
      '챗봇 MVP 기능 범위 정의',
      '프론트엔드와 백엔드 기술 스택 합의',
      '관리자 화면은 2차 범위로 분리',
    ],
    actionItems: [
      '기능 요구사항 문서 초안 정리 (담당: 김도윤)',
      '챗봇 흐름도 와이어프레임 작성 (담당: 박서연)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-12T04:00:00.000Z',
    updatedAt: '2026-04-12T04:00:00.000Z',
  },
  {
    id: 'meeting-14',
    project: '모바일 앱 개발',
    title: '모바일 앱 디자인 킥오프',
    date: '2026-04-11',
    durationMinutes: 90,
    participants: ['이서연', '최하늘', '정민지'],
    summary:
      '모바일 앱의 디자인 방향성과 주요 화면을 논의했습니다.',
    tags: ['디자인', '모바일'],
    transcript:
      '킥오프 회의에서 온보딩, 홈, 일정, 회의록 화면을 중심으로 초기 경험을 정리했습니다.\n' +
      '모바일 앱은 밝은 톤과 빠른 입력 흐름을 유지하고, 프로젝트별 색상을 주요 배지와 카드에 반영하기로 합의했습니다.\n' +
      '다음 스프린트에서는 핵심 화면 시안을 먼저 검토하기로 했습니다.',
    keyPoints: [
      '핵심 모바일 화면 우선순위 정리',
      '프로젝트 색상 연동 방향 합의',
      '입력 플로우 단순화 필요 확인',
    ],
    actionItems: [
      '핵심 화면 시안 3종 제작 (담당: 이서연)',
      '모바일 컴포넌트 구조 정리 (담당: 정민지)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-11T02:30:00.000Z',
    updatedAt: '2026-04-11T02:30:00.000Z',
  },
  {
    id: 'meeting-15',
    project: 'AI 챗봇 프로젝트',
    title: 'NLP 모델 선정 회의',
    date: '2026-04-04',
    durationMinutes: 90,
    participants: ['김도윤', '최하늘', '박서연'],
    summary:
      'AI 챗봇에 사용할 NLP 모델을 비교 분석하고 최종 선정했습니다.',
    tags: ['AI', 'NLP'],
    transcript:
      '회의에서는 응답 정확도, 추론 속도, 운영 비용을 기준으로 후보 모델을 비교했습니다.\n' +
      '초기 버전은 경량 모델과 검색 기반 보강 구조를 함께 사용하고, 이후 실제 문의 데이터를 바탕으로 고도화하기로 했습니다.\n' +
      '평가 항목과 테스트 질문 세트도 함께 정리했습니다.',
    keyPoints: [
      '후보 NLP 모델 비교 기준 수립',
      '초기 버전은 경량 모델 중심으로 진행',
      '평가용 질문 세트 작성 필요',
    ],
    actionItems: [
      '모델 비교표 정리 및 공유 (담당: 최하늘)',
      '테스트 질문 세트 20개 작성 (담당: 박서연)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-04T06:10:00.000Z',
    updatedAt: '2026-04-04T06:10:00.000Z',
  },
  {
    id: 'meeting-16',
    project: '모바일 앱 개발',
    title: 'Flutter 위젯 설계',
    date: '2026-04-03',
    durationMinutes: 70,
    participants: ['이서연', '정민지'],
    summary:
      '모바일 앱의 주요 위젯과 컴포넌트 구조를 설계했습니다.',
    tags: ['Flutter', '위젯'],
    transcript:
      '이번 회의에서는 카드, 배지, 입력 폼, 하단 네비게이션 위젯 구조를 나눠 설계했습니다.\n' +
      '공통 위젯으로 묶을 요소와 화면 전용 컴포넌트를 구분하고, 상태 변화에 따라 색상이 자연스럽게 이어지도록 구현 방향을 정리했습니다.\n' +
      '다음 작업으로는 실제 화면에 시범 적용해보는 것으로 합의했습니다.',
    keyPoints: [
      '공통 위젯과 화면 전용 컴포넌트 분리',
      '프로젝트 색상 상태 변화 구조 검토',
      '시범 화면 적용 우선 진행',
    ],
    actionItems: [
      '공통 위젯 목록 문서화 (담당: 정민지)',
      '시범 화면에 위젯 적용 (담당: 이서연)',
    ],
    sourceType: 'manual',
    audioFileName: '',
    createdAt: '2026-04-03T01:20:00.000Z',
    updatedAt: '2026-04-03T01:20:00.000Z',
  },
];

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function hasWindow() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function sortMeetingNotes(notes) {
  return [...notes].sort((firstNote, secondNote) => {
    const firstDate = new Date(firstNote.date).getTime();
    const secondDate = new Date(secondNote.date).getTime();

    if (firstDate !== secondDate) {
      return secondDate - firstDate;
    }

    return new Date(secondNote.updatedAt).getTime() - new Date(firstNote.updatedAt).getTime();
  });
}

function normalizeList(values) {
  return values
    .map((value) => value.trim())
    .filter(Boolean);
}

function alignActionItemChecks(actionItems, actionItemChecks = []) {
  return actionItems.map((_, index) => Boolean(actionItemChecks[index]));
}

function normalizeStoredMeetingNote(note) {
  const actionItems = normalizeList(note.actionItems ?? []);

  return {
    ...note,
    actionItems,
    actionItemChecks: alignActionItemChecks(actionItems, note.actionItemChecks),
  };
}

function buildStorageFallback() {
  return sortMeetingNotes(
    cloneData([
      ...DEFAULT_MEETING_NOTES,
      ...PAGINATION_SHOWCASE_MEETING_NOTES,
    ]).map(normalizeStoredMeetingNote),
  );
}

function buildPaginationShowcaseMeetingNotes() {
  return cloneData(PAGINATION_SHOWCASE_MEETING_NOTES).map(
    normalizeStoredMeetingNote,
  );
}

function migrateMeetingNotes(notes) {
  if (!hasWindow()) {
    return sortMeetingNotes(notes);
  }

  const storedVersion = Number(
    window.localStorage.getItem(MEETING_NOTES_STORAGE_VERSION_KEY) ?? 1,
  );

  if (storedVersion >= DEFAULT_MEETING_NOTES_VERSION) {
    return sortMeetingNotes(notes);
  }

  const existingIds = new Set(notes.map((note) => note.id));
  const missingShowcaseNotes = buildPaginationShowcaseMeetingNotes().filter(
    (note) => !existingIds.has(note.id),
  );
  const migratedNotes = sortMeetingNotes([...missingShowcaseNotes, ...notes]);

  window.localStorage.setItem(
    MEETING_NOTES_STORAGE_VERSION_KEY,
    String(DEFAULT_MEETING_NOTES_VERSION),
  );
  window.localStorage.setItem(
    MEETING_NOTES_STORAGE_KEY,
    JSON.stringify(migratedNotes),
  );

  return migratedNotes;
}

function readMeetingNotes() {
  if (!hasWindow()) {
    return buildStorageFallback();
  }

  const storedValue = window.localStorage.getItem(MEETING_NOTES_STORAGE_KEY);

  if (!storedValue) {
    const seeded = buildStorageFallback();
    window.localStorage.setItem(MEETING_NOTES_STORAGE_KEY, JSON.stringify(seeded));
    window.localStorage.setItem(
      MEETING_NOTES_STORAGE_VERSION_KEY,
      String(DEFAULT_MEETING_NOTES_VERSION),
    );
    return seeded;
  }

  try {
    return migrateMeetingNotes(
      sortMeetingNotes(JSON.parse(storedValue).map(normalizeStoredMeetingNote)),
    );
  } catch (error) {
    const seeded = buildStorageFallback();
    window.localStorage.setItem(MEETING_NOTES_STORAGE_KEY, JSON.stringify(seeded));
    window.localStorage.setItem(
      MEETING_NOTES_STORAGE_VERSION_KEY,
      String(DEFAULT_MEETING_NOTES_VERSION),
    );
    return seeded;
  }
}

function writeMeetingNotes(notes) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(
    MEETING_NOTES_STORAGE_KEY,
    JSON.stringify(sortMeetingNotes(notes)),
  );
}

function getKnownProjectNames() {
  return getProjectWorkspace()
    .projects.map((project) => project.name?.trim())
    .filter(Boolean);
}

function buildProjectOptions(notes) {
  const uniqueProjects = new Set([
    ...BASE_PROJECT_OPTIONS,
    ...getKnownProjectNames(),
  ]);

  notes.forEach((note) => {
    if (note.project) {
      uniqueProjects.add(note.project);
    }
  });

  return Array.from(uniqueProjects);
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `meeting-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function validateAudioFile(file) {
  if (!file) {
    return '업로드할 음성 파일을 선택해주세요.';
  }

  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (!SUPPORTED_AUDIO_EXTENSIONS.includes(extension)) {
    return '지원하지 않는 파일 형식입니다. MP3, WAV, M4A 파일만 업로드할 수 있습니다.';
  }

  if (file.size > MAX_AUDIO_FILE_SIZE) {
    return '파일 용량이 50MB를 초과했습니다. 용량을 줄이거나 다른 파일을 선택해주세요.';
  }

  return '';
}

function buildDraftTitleFromFileName(fileName) {
  const cleanedName = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleanedName ? `${cleanedName} 회의` : '새 회의록';
}

function buildTranscriptFromDraft({ title, project }) {
  return [
    `안녕하세요. 이번 회의는 ${project} 프로젝트의 ${title} 내용을 정리하기 위해 진행했습니다.`,
    '먼저 현재 진행 중인 기능 범위를 공유하고, 우선 구현이 필요한 화면과 사용자 흐름을 확인했습니다.',
    '이후 회의록 업로드, AI 요약, 직접 수정, 저장까지 이어지는 사용자 경험을 구체화했습니다.',
    '마지막으로 담당자별 후속 작업과 일정, 검증 포인트를 정리한 뒤 회의를 마무리했습니다.',
  ].join('\n');
}

function normalizeMeetingPayload(payload) {
  const now = new Date().toISOString();
  const actionItems = normalizeList(payload.actionItems ?? []);

  return {
    project: payload.project?.trim() || BASE_PROJECT_OPTIONS[0],
    title: payload.title?.trim() || '새 회의록',
    date: payload.date,
    durationMinutes: Number(payload.durationMinutes) || 0,
    participants: normalizeList(payload.participants ?? []),
    summary: payload.summary?.trim() || '',
    tags: normalizeList(payload.tags ?? []),
    transcript: payload.transcript?.trim() || '',
    keyPoints: normalizeList(payload.keyPoints ?? []),
    actionItems,
    actionItemChecks: alignActionItemChecks(
      actionItems,
      payload.actionItemChecks ?? [],
    ),
    sourceType: payload.sourceType === 'upload' ? 'upload' : 'manual',
    audioFileName: payload.audioFileName?.trim() || '',
    updatedAt: now,
  };
}

export async function getMeetingNotes() {
  await wait(180);
  return readMeetingNotes();
}

export async function getMeetingProjects() {
  await wait(120);
  return buildProjectOptions(readMeetingNotes());
}

export async function createMeetingNote(payload) {
  await wait(240);

  const notes = readMeetingNotes();
  const normalizedPayload = normalizeMeetingPayload(payload);
  const createdAt = new Date().toISOString();

  const nextNote = {
    id: createId(),
    ...normalizedPayload,
    createdAt,
    updatedAt: createdAt,
  };

  const nextNotes = sortMeetingNotes([nextNote, ...notes]);
  writeMeetingNotes(nextNotes);

  return nextNote;
}

export async function updateMeetingNote(meetingNoteId, payload) {
  await wait(220);

  const notes = readMeetingNotes();
  const normalizedPayload = normalizeMeetingPayload(payload);

  const nextNotes = notes.map((note) =>
    note.id === meetingNoteId
      ? {
          ...note,
          ...normalizedPayload,
        }
      : note,
  );

  writeMeetingNotes(nextNotes);
  return nextNotes.find((note) => note.id === meetingNoteId) ?? null;
}

export async function deleteMeetingNote(meetingNoteId) {
  await wait(200);

  const nextNotes = readMeetingNotes().filter((note) => note.id !== meetingNoteId);
  writeMeetingNotes(nextNotes);
  return true;
}

export async function generateMeetingDraftFromAudio(file, project) {
  const validationMessage = validateAudioFile(file);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  await wait(1100);

  const normalizedFileName = file.name.toLowerCase();

  if (
    normalizedFileName.includes('error') ||
    normalizedFileName.includes('fail') ||
    normalizedFileName.includes('실패')
  ) {
    throw new Error(
      '텍스트 변환과 AI 요약 처리에 실패했습니다. 네트워크 상태를 확인한 뒤 다시 시도해주세요.',
    );
  }

  const selectedProject = project?.trim() || '포트폴리오 관리 시스템';
  const draftTitle = buildDraftTitleFromFileName(file.name);
  const today = new Date().toISOString().slice(0, 10);

  return {
    project: selectedProject,
    title: draftTitle,
    date: today,
    durationMinutes: 40,
    participants: ['김철수', '이영희', '박민수'],
    summary:
      `${selectedProject} 관련 ${draftTitle}에서 주요 의사결정과 다음 작업 항목을 중심으로 내용을 정리했습니다. ` +
      '업로드된 녹음 파일을 기반으로 전사와 요약을 생성했으며, 저장 전 직접 수정할 수 있습니다.',
    tags: ['AI요약', '업로드'],
    transcript: buildTranscriptFromDraft({
      title: draftTitle,
      project: selectedProject,
    }),
    keyPoints: [
      '업로드된 음성 파일을 텍스트로 전사',
      '핵심 결정 사항과 액션 아이템 자동 추출',
      '저장 전 사용자가 직접 내용을 보정 가능',
    ],
    actionItems: [
      '요약본 검토 후 프로젝트 맥락에 맞게 표현 다듬기',
      '담당자와 기한이 필요한 액션 아이템 보강',
      '저장 후 프로젝트와 연계해 후속 작업 추적',
    ],
    sourceType: 'upload',
    audioFileName: file.name,
  };
}

export { MAX_AUDIO_FILE_SIZE, SUPPORTED_AUDIO_EXTENSIONS };
