export const PROJECT_COLOR_THEMES = {
  green: {
    name: '그린',
    accent: '#a8d45f',
    accentStrong: '#8dbc3e',
    accentSoft: '#f2f8e3',
    border: '#d5e8ab',
    heroGradient: 'linear-gradient(135deg, #b1db67 0%, #98c94c 100%)',
  },
  blue: {
    name: '블루',
    accent: '#7da5ee',
    accentStrong: '#5f84da',
    accentSoft: '#eef4ff',
    border: '#cadeff',
    heroGradient: 'linear-gradient(135deg, #87b2ff 0%, #6b91df 100%)',
  },
  teal: {
    name: '티얼',
    accent: '#7ccdbf',
    accentStrong: '#56b8a6',
    accentSoft: '#ebfbf7',
    border: '#c0eee4',
    heroGradient: 'linear-gradient(135deg, #89d8ca 0%, #5ebaa9 100%)',
  },
  yellow: {
    name: '옐로우',
    accent: '#f1dd50',
    accentStrong: '#d6b826',
    accentSoft: '#fff8d9',
    border: '#f6e8a2',
    heroGradient: 'linear-gradient(135deg, #f8e56c 0%, #e3c83b 100%)',
  },
  brightGreen: {
    name: '브라이트 그린',
    accent: '#94d978',
    accentStrong: '#71c151',
    accentSoft: '#eef9e9',
    border: '#cfecc0',
    heroGradient: 'linear-gradient(135deg, #9ce07f 0%, #79ca58 100%)',
  },
  red: {
    name: '레드',
    accent: '#e5635b',
    accentStrong: '#cb4b45',
    accentSoft: '#fff0ef',
    border: '#f5c8c5',
    heroGradient: 'linear-gradient(135deg, #eb726a 0%, #ce4d46 100%)',
  },
};

export const PROJECT_STATUS_META = {
  inProgress: {
    label: '진행중',
    toneClassName: 'bg-[#eef7dd] text-[#6a9b2c]',
  },
  completed: {
    label: '완료',
    toneClassName: 'bg-[#e8f7ee] text-[#27854a]',
  },
  planning: {
    label: '준비중',
    toneClassName: 'bg-[#fff5d6] text-[#b98a00]',
  },
};

function padValue(value) {
  return `${value}`.padStart(2, '0');
}

function addDays(baseDate, amount) {
  const shiftedDate = new Date(`${baseDate}T00:00:00`);
  shiftedDate.setDate(shiftedDate.getDate() + amount);

  const year = shiftedDate.getFullYear();
  const month = padValue(shiftedDate.getMonth() + 1);
  const day = padValue(shiftedDate.getDate());

  return `${year}-${month}-${day}`;
}

function buildMeetingNotes(projectConfig) {
  return Array.from({ length: projectConfig.meetingCount }, (_, index) => {
    const explicitTitle = projectConfig.meetingTitles[index];
    const title =
      explicitTitle ?? `${projectConfig.name} 회의록 ${index + 1}`;

    return {
      id: `${projectConfig.id}-meeting-${index + 1}`,
      title,
      date: addDays(projectConfig.startDate, index * 7 + 2),
      summary: `${title}에서 역할 분담, 우선순위, 산출물 검토 내용을 정리했습니다.`,
      source: 'Whisper AI',
      projectHint: projectConfig.name,
    };
  });
}

function buildTodos(projectConfig) {
  return Array.from({ length: projectConfig.todoCount }, (_, index) => {
    const explicitTitle = projectConfig.todoTitles[index];
    const title = explicitTitle ?? `${projectConfig.name} 작업 ${index + 1}`;
    const priorities = ['high', 'medium', 'low'];

    return {
      id: `${projectConfig.id}-todo-${index + 1}`,
      title,
      dueDate: addDays(projectConfig.startDate, index + 1),
      completed: index < projectConfig.completedTodoCount,
      priority: priorities[index % priorities.length],
      estimate: `${(index % 3) + 1}시간`,
    };
  });
}

function buildSchedules(projectConfig) {
  return projectConfig.scheduleTitles.map((title, index) => ({
    id: `${projectConfig.id}-schedule-${index + 1}`,
    title,
    date: addDays(projectConfig.startDate, index * 14 + 4),
    timeLabel: index % 2 === 0 ? '14:00 - 15:30' : '10:00 - 11:00',
  }));
}

const projectConfigs = [
  {
    id: 'project-portfolio',
    name: '포트폴리오 관리 시스템',
    description: '대학생을 위한 포트폴리오 작성 및 관리 웹 애플리케이션',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    tags: ['웹개발', 'React', '디자인'],
    status: 'inProgress',
    colorKey: 'green',
    meetingCount: 8,
    todoCount: 24,
    completedTodoCount: 16,
    meetingTitles: [
      '프로젝트 기획 회의',
      '요구사항 정의 회의',
      '화면 구조 점검',
      '디자인 리뷰 미팅',
      'STT 연동 회의',
      '캘린더 동기화 회의',
      'STAR 포트폴리오 기획',
      '스프린트 회고',
    ],
    todoTitles: [
      '로그인 플로우 연결',
      '메인 레이아웃 설계',
      '프로젝트 카드 UI 구현',
      '회의록 업로드 모달 디자인',
      '캘린더 일정 생성 연결',
      'STAR 폼 구조 정리',
      '프로젝트 수정 모달 구현',
      '색상 토큰 반영',
    ],
    scheduleTitles: [
      '디자인 리뷰 미팅',
      '개발 스프린트 종료',
      '포트폴리오 발표',
    ],
  },
  {
    id: 'project-chatbot',
    name: 'AI 챗봇 프로젝트',
    description: '자연어 처리를 활용한 고객 상담 챗봇 개발 프로젝트',
    startDate: '2026-03-15',
    endDate: '2026-06-15',
    tags: ['AI', 'Python', 'NLP'],
    status: 'inProgress',
    colorKey: 'blue',
    meetingCount: 5,
    todoCount: 18,
    completedTodoCount: 7,
    meetingTitles: [
      '챗봇 시나리오 회의',
      '데이터셋 점검',
      '모델 품질 검토',
      '프롬프트 튜닝 회의',
      '배포 준비 회고',
    ],
    todoTitles: [
      '상담 시나리오 정의',
      'FAQ 데이터 전처리',
      'intent 분류 기준 정리',
      'RAG 구조 검토',
      '평가 리포트 작성',
    ],
    scheduleTitles: ['데이터 라벨링 점검', '시연 준비 미팅', '배포 리허설'],
  },
  {
    id: 'project-mobile',
    name: '모바일 앱 개발',
    description: '크로스 플랫폼 생산성 향상 모바일 애플리케이션',
    startDate: '2026-01-10',
    endDate: '2026-03-20',
    tags: ['Mobile', 'Flutter', 'UI/UX'],
    status: 'completed',
    colorKey: 'brightGreen',
    meetingCount: 12,
    todoCount: 32,
    completedTodoCount: 32,
    meetingTitles: [
      '아이디어 킥오프',
      '와이어프레임 검토',
      '유저 테스트 회의',
      '스토어 배포 점검',
      '최종 회고',
    ],
    todoTitles: [
      '온보딩 화면 제작',
      '푸시 알림 연결',
      '동기화 에러 수정',
      '사용성 테스트 반영',
      '배포 체크리스트 정리',
    ],
    scheduleTitles: ['유저 인터뷰', '스토어 검수', '최종 데모데이'],
  },
  {
    id: 'project-career',
    name: '취업 추천 플랫폼',
    description: '학생 이력 기반 맞춤형 공고 추천 서비스를 설계한 팀 프로젝트',
    startDate: '2026-02-05',
    endDate: '2026-05-25',
    tags: ['추천시스템', '데이터', '기획'],
    status: 'planning',
    colorKey: 'teal',
    meetingCount: 4,
    todoCount: 10,
    completedTodoCount: 3,
    meetingTitles: [
      '문제 정의 회의',
      '데이터 소스 조사',
      '추천 기준 설정',
      '초기 MVP 리뷰',
    ],
    todoTitles: [
      '타깃 사용자 조사',
      '추천 기준 우선순위화',
      '데이터셋 후보 수집',
      '화면 흐름 스케치',
    ],
    scheduleTitles: ['시장 조사 발표', 'MVP 방향성 회의'],
  },
];

const meetingNotes = [];
const todos = [];
const schedules = [];

const projects = projectConfigs.map((projectConfig) => {
  const createdMeetingNotes = buildMeetingNotes(projectConfig);
  const createdTodos = buildTodos(projectConfig);
  const createdSchedules = buildSchedules(projectConfig);

  meetingNotes.push(...createdMeetingNotes);
  todos.push(...createdTodos);
  schedules.push(...createdSchedules);

  return {
    id: projectConfig.id,
    name: projectConfig.name,
    description: projectConfig.description,
    startDate: projectConfig.startDate,
    endDate: projectConfig.endDate,
    tags: projectConfig.tags,
    status: projectConfig.status,
    colorKey: projectConfig.colorKey,
    meetingIds: createdMeetingNotes.map((meetingNote) => meetingNote.id),
    todoIds: createdTodos.map((todo) => todo.id),
    scheduleIds: createdSchedules.map((schedule) => schedule.id),
  };
});

const portfolios = [
  {
    id: 'portfolio-frontend-competency',
    projectId: 'project-portfolio',
    title: '프론트엔드 개발 역량',
    createdAt: '2026-04-01',
    summary:
      '회의록, 일정, 할 일을 하나의 흐름으로 묶는 포트폴리오 관리 경험을 STAR 형식으로 정리한 문서입니다.',
    keywords: ['React', 'UI/UX', '협업', '문제 해결'],
    situation:
      '대학생들이 취업 준비 과정에서 자신의 프로젝트 경험을 체계적으로 정리하고 포트폴리오로 작성하는 데 어려움을 겪는 문제를 발견했습니다. 특히 회의록과 일정 관리가 분산되어 있어 프로젝트의 전체 흐름을 파악하기 어려웠습니다.',
    task:
      '프론트엔드 개발자로서 사용자가 회의록, 일정, 투두, 프로젝트를 하나의 화면 흐름 안에서 관리하고, 최종적으로 STAR 포트폴리오까지 연결할 수 있는 경험을 설계하는 역할을 맡았습니다.',
    action: [
      'Eva Design 톤을 참고해 카드, 배너, 모달 중심의 일관된 UI 시스템을 구축했습니다.',
      '회의록 업로드, 프로젝트 생성, STAR 포트폴리오 작성 흐름을 하나의 프로젝트 허브 안에서 이어지도록 화면 구조를 설계했습니다.',
      '색상 테마를 프로젝트에 연결해 회의록, 대시보드, 포트폴리오에서 동일한 시각 언어를 유지하도록 구현했습니다.',
      '모바일 반응형 레이아웃을 함께 고려해 데스크톱과 태블릿 환경에서 모두 자연스럽게 동작하도록 조정했습니다.',
    ],
    result:
      '프로젝트 정보를 한 번에 모아보는 통합 화면 덕분에 사용자는 8회의 회의와 24개의 할 일을 맥락 있게 관리할 수 있었고, STAR 포트폴리오 초안 작성 시간을 크게 줄일 수 있는 기반을 마련했습니다.',
  },
  {
    id: 'portfolio-team-collaboration',
    projectId: 'project-portfolio',
    title: '팀 협업 및 프로젝트 관리',
    createdAt: '2026-04-10',
    summary:
      '프로젝트 전체 기록을 누적 자산으로 전환하는 협업 구조와 관리 방식을 STAR 기반으로 서술했습니다.',
    keywords: ['협업', '기획', '커뮤니케이션'],
    situation:
      '5명의 팀원이 동시에 기능을 개발하면서 회의 결과와 할 일 배분이 누락되거나 중복되는 문제가 반복되었습니다.',
    task:
      '사용자 흐름을 해치지 않으면서도 회의록과 완료된 투두를 프로젝트에 수집해 포트폴리오 생성 근거 데이터로 전환할 수 있도록 설계해야 했습니다.',
    action: [
      '프로젝트 생성 시 회의록과 할 일을 체크 방식으로 연결하는 수집 UI를 설계했습니다.',
      '프로젝트 상세에서 회의록, 일정, 진행 현황을 분리된 카드로 노출해 빠르게 상태를 공유할 수 있게 했습니다.',
      'STAR 포트폴리오 탭에서 수집된 데이터를 기반으로 AI 생성과 수동 작성을 모두 지원하도록 설계했습니다.',
    ],
    result:
      '프로젝트 맥락을 한 화면에서 공유할 수 있게 되면서 팀 내 커뮤니케이션 비용이 줄었고, 누락된 근거 데이터를 빠르게 보완할 수 있는 작업 구조를 마련했습니다.',
  },
  {
    id: 'portfolio-chatbot-growth',
    projectId: 'project-chatbot',
    title: 'AI 서비스 기획 및 고도화',
    createdAt: '2026-05-01',
    summary:
      'AI 챗봇 기능을 서비스 관점에서 고도화한 경험을 STAR 구조로 정리했습니다.',
    keywords: ['NLP', '실험', '고객 경험'],
    situation:
      '고객 상담 과정에서 반복 질문 응답 품질이 낮아 빠른 개선이 필요한 상황이었습니다.',
    task:
      '자연어 처리 기반 챗봇의 응답 정확도와 대화 흐름을 함께 개선해야 했습니다.',
    action: [
      'FAQ 데이터를 재분류하고 인텐트 기준을 정리했습니다.',
      '회의록에서 자주 언급된 실패 사례를 기준으로 프롬프트를 조정했습니다.',
      '주간 시연 피드백을 반영해 답변 템플릿을 지속적으로 수정했습니다.',
    ],
    result:
      '반복 문의 대응 품질을 개선했고, 프로젝트 산출물을 포트폴리오 서술 가능한 형태로 정리할 수 있었습니다.',
  },
  {
    id: 'portfolio-mobile-release',
    projectId: 'project-mobile',
    title: '모바일 서비스 출시 경험',
    createdAt: '2026-03-18',
    summary:
      '앱 출시 전 과정을 구조화해 정리한 STAR 기반 포트폴리오입니다.',
    keywords: ['Flutter', '배포', '사용성 테스트'],
    situation:
      '짧은 기간 안에 실제 앱 출시까지 마쳐야 하는 상황에서 사용성, 안정성, 일정 관리가 모두 중요했습니다.',
    task:
      '모바일 앱 기능 구현뿐 아니라 테스트와 스토어 배포까지 이어지는 전 과정을 주도해야 했습니다.',
    action: [
      '온보딩, 푸시 알림, 동기화 기능을 우선순위에 맞춰 구현했습니다.',
      '사용성 테스트를 통해 개선 포인트를 수집하고 빠르게 반영했습니다.',
      '배포 전 체크리스트를 만들어 팀원들과 검수 항목을 공유했습니다.',
    ],
    result:
      '32개의 작업을 모두 마무리하며 앱 출시를 완료했고, 사용자 피드백을 반영한 개선 경험을 명확한 결과 중심으로 정리할 수 있었습니다.',
  },
];

function cloneData(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

export function getProjectWorkspace() {
  return cloneData({
    projects,
    meetingNotes,
    todos,
    schedules,
    portfolios,
  });
}
