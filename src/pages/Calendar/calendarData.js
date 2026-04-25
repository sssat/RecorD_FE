export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export const TODO_PRIORITY_OPTIONS = [
  { value: 'high', label: '높음' },
  { value: 'medium', label: '중간' },
  { value: 'low', label: '낮음' },
];

export const EVENT_TYPE_OPTIONS = [
  { value: 'meeting', label: '회의' },
  { value: 'deadline', label: '마감' },
  { value: 'presentation', label: '발표' },
  { value: 'review', label: '검토' },
  { value: 'content', label: '콘텐츠' },
];

export const PROJECT_OPTIONS = [
  '선택하지 않음',
  'Recor-D',
  '포트폴리오',
  '디자인 시스템',
  '캡스톤',
];

export const EVENT_THEMES = {
  lime: {
    dot: 'bg-lime-400',
    chip: 'border-lime-200 bg-lime-100 text-lime-700',
    card: 'bg-lime-50',
  },
  amber: {
    dot: 'bg-amber-400',
    chip: 'border-amber-200 bg-amber-100 text-amber-700',
    card: 'bg-amber-50',
  },
  teal: {
    dot: 'bg-teal-400',
    chip: 'border-teal-200 bg-teal-100 text-teal-700',
    card: 'bg-teal-50',
  },
  sky: {
    dot: 'bg-sky-400',
    chip: 'border-sky-200 bg-sky-100 text-sky-700',
    card: 'bg-sky-50',
  },
  violet: {
    dot: 'bg-violet-400',
    chip: 'border-violet-200 bg-violet-100 text-violet-700',
    card: 'bg-violet-50',
  },
};

const EVENT_COLOR_BY_TYPE = {
  meeting: 'lime',
  deadline: 'amber',
  presentation: 'teal',
  review: 'violet',
  content: 'sky',
};

function padNumber(value) {
  return String(value).padStart(2, '0');
}

function withTime(date, hour, minute = 0) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
}

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return startOfDay(result);
}

export function isSameDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export function isSameMonth(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth()
  );
}

export function toDateKey(date) {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());

  return `${year}-${month}-${day}`;
}

export function toInputDateValue(date) {
  return toDateKey(date);
}

export function toTimeInputValue(date) {
  return `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
}

export function combineDateAndTime(dateValue, timeValue) {
  const [year, month, day] = dateValue.split('-').map(Number);
  const [hours, minutes] = timeValue.split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}

export function buildMonthGrid(monthDate) {
  const monthStart = startOfMonth(monthDate);
  const calendarStart = addDays(monthStart, -monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => addDays(calendarStart, index));
}

export function isWithinRange(date, startDate, endDate) {
  const currentTime = startOfDay(date).getTime();
  const startTime = startOfDay(startDate).getTime();
  const endTime = startOfDay(endDate).getTime();

  return currentTime >= startTime && currentTime <= endTime;
}

export function getEventColorByType(type) {
  return EVENT_COLOR_BY_TYPE[type] ?? 'lime';
}

export function getEventTypeLabel(type) {
  return EVENT_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? '일정';
}

export function getTodoPriorityLabel(priority) {
  return TODO_PRIORITY_OPTIONS.find((option) => option.value === priority)?.label ?? '중간';
}

export function formatMonthTitle(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function formatReadableDate(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

export function formatCompactDate(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  }).format(date);
}

export function formatTodoDate(date) {
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

export function formatTime(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatEventTimeRange(startDate, endDate) {
  return `${formatTime(startDate)} - ${formatTime(endDate)}`;
}

export function formatEventDateRange(event) {
  if (isSameDay(event.start, event.end)) {
    return `${formatCompactDate(event.start)} · ${formatEventTimeRange(
      event.start,
      event.end
    )}`;
  }

  return `${formatCompactDate(event.start)} - ${formatCompactDate(
    event.end
  )} · ${formatEventTimeRange(event.start, event.end)}`;
}

export function formatEventFullDateLabel(event) {
  if (isSameDay(event.start, event.end)) {
    return formatReadableDate(event.start);
  }

  return `${formatReadableDate(event.start)} - ${formatReadableDate(event.end)}`;
}

export function getTodoBadgeLabel(todoDate, anchorDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(
    (startOfDay(todoDate).getTime() - startOfDay(anchorDate).getTime()) /
      millisecondsPerDay
  );

  if (diffDays === 0) {
    return 'D-Day';
  }

  if (diffDays > 0) {
    return `D-${diffDays}`;
  }

  return `D+${Math.abs(diffDays)}`;
}

export function buildMockCalendarData(baseDate) {
  const today = startOfDay(baseDate);

  return {
    events: [
      {
        id: 'event-design-review',
        title: '디자인 리뷰 미팅',
        start: withTime(addDays(today, 1), 14, 0),
        end: withTime(addDays(today, 1), 15, 30),
        location: '회의실 A',
        type: 'meeting',
        project: '디자인 시스템',
        description: '디자인 시스템 최종 검토 및 승인',
        color: getEventColorByType('meeting'),
      },
      {
        id: 'event-dev-sprint',
        title: '개발 스프린트 종료',
        start: withTime(addDays(today, 4), 17, 0),
        end: withTime(addDays(today, 4), 18, 0),
        location: '프로젝트룸',
        type: 'deadline',
        project: 'Recor-D',
        description: '캘린더 기능과 메인 대시보드 연동 작업 마감',
        color: getEventColorByType('deadline'),
      },
      {
        id: 'event-portfolio-demo',
        title: '포트폴리오 발표',
        start: withTime(addDays(today, 6), 10, 0),
        end: withTime(addDays(today, 6), 12, 0),
        location: '대강당',
        type: 'presentation',
        project: '포트폴리오',
        description: '포트폴리오 주요 작업 결과를 발표하고 피드백을 받습니다.',
        color: getEventColorByType('presentation'),
      },
      {
        id: 'event-content-production',
        title: '콘텐츠 촬영 주간',
        start: withTime(addDays(today, 9), 13, 0),
        end: withTime(addDays(today, 11), 16, 0),
        location: '스튜디오 B',
        type: 'content',
        project: 'Recor-D',
        description: '서비스 소개 영상과 케이스 스터디 시각 자료를 촬영합니다.',
        color: getEventColorByType('content'),
      },
      {
        id: 'event-usability-review',
        title: '사용성 검토 세션',
        start: withTime(addDays(today, -1), 10, 0),
        end: withTime(today, 11, 30),
        location: '온라인 미팅룸',
        type: 'review',
        project: '캡스톤',
        description: '사용자 테스트 결과를 바탕으로 개선 포인트를 정리합니다.',
        color: getEventColorByType('review'),
      },
    ],
    todos: [
      {
        id: 'todo-doc-update',
        title: '프로젝트 문서 업데이트',
        date: today,
        priority: 'high',
        project: 'Recor-D',
        description: '이번 주 변경된 기능을 위키와 발표 자료에 반영합니다.',
        completed: false,
        completedAt: null,
      },
      {
        id: 'todo-design-draft',
        title: '디자인 시안 검토',
        date: addDays(today, 1),
        priority: 'medium',
        project: '디자인 시스템',
        description: '피그마 피드백을 정리하고 수정 우선순위를 정합니다.',
        completed: false,
        completedAt: null,
      },
      {
        id: 'todo-test-cases',
        title: '테스트 케이스 작성',
        date: addDays(today, 2),
        priority: 'medium',
        project: 'Recor-D',
        description: '캘린더 동작 시나리오를 문서화합니다.',
        completed: false,
        completedAt: null,
      },
      {
        id: 'todo-code-review',
        title: '코드 리뷰',
        date: addDays(today, 3),
        priority: 'low',
        project: 'Recor-D',
        description: '브랜치 병합 전 UI 변경사항을 리뷰합니다.',
        completed: false,
        completedAt: null,
      },
      {
        id: 'todo-meeting-note',
        title: '회의록 작성 완료',
        date: addDays(today, -1),
        priority: 'medium',
        project: '캡스톤',
        description: '주간 회의 내용을 공유 문서로 정리했습니다.',
        completed: true,
        completedAt: withTime(addDays(today, -1), 18, 0),
      },
      {
        id: 'todo-asset-upload',
        title: '프로젝트 문서 업데이트',
        date: addDays(today, -2),
        priority: 'high',
        project: '포트폴리오',
        description: '포트폴리오 소개 섹션에 최신 스크린샷을 반영했습니다.',
        completed: true,
        completedAt: withTime(addDays(today, -2), 16, 30),
      },
      {
        id: 'todo-archived-task',
        title: '마감 지난 작업',
        date: addDays(today, -4),
        priority: 'low',
        project: '선택하지 않음',
        description: '이미 반영이 끝난 작업을 완료 목록으로 옮깁니다.',
        completed: true,
        completedAt: withTime(addDays(today, -3), 13, 0),
      },
    ],
  };
}
