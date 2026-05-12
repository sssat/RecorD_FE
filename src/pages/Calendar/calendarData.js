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

export const EVENT_COLOR_OPTIONS = [
  {
    value: 'primary',
    label: 'Sage',
  },
  {
    value: 'secondary',
    label: 'Mint',
  },
  {
    value: 'success',
    label: 'Lime',
  },
  {
    value: 'info',
    label: 'Sky',
  },
  {
    value: 'warning',
    label: 'Amber',
  },
  {
    value: 'danger',
    label: 'Rose',
  },
];

export const EVENT_THEMES = {
  primary: {
    dot: 'bg-[#95D34F]',
    chip: 'border-[#D1EFA9] bg-[#E8F7D4] text-[#3F6021]',
    card: 'bg-[#E8F7D4]',
    panelBorder: 'border-[#D1EFA9]',
    swatch: 'bg-[#E8F7D4]',
    text: 'text-[#3F6021]',
  },
  secondary: {
    dot: 'bg-[#3CC4AD]',
    chip: 'border-[#A9EBE1] bg-[#D4F5F0] text-[#1A574D]',
    card: 'bg-[#D4F5F0]',
    panelBorder: 'border-[#A9EBE1]',
    swatch: 'bg-[#D4F5F0]',
    text: 'text-[#1A574D]',
  },
  success: {
    dot: 'bg-[#6FDB6D]',
    chip: 'border-[#BFEFBD] bg-[#DFF7DE] text-[#2D632C]',
    card: 'bg-[#DFF7DE]',
    panelBorder: 'border-[#BFEFBD]',
    swatch: 'bg-[#DFF7DE]',
    text: 'text-[#2D632C]',
  },
  info: {
    dot: 'bg-[#5BA3F3]',
    chip: 'border-[#BBE1FB] bg-[#DDF0FD] text-[#214B75]',
    card: 'bg-[#DDF0FD]',
    panelBorder: 'border-[#BBE1FB]',
    swatch: 'bg-[#DDF0FD]',
    text: 'text-[#214B75]',
  },
  warning: {
    dot: 'bg-[#F2D518]',
    chip: 'border-[#FDF3A3] bg-[#FEF9D1] text-[#70620A]',
    card: 'bg-[#FEF9D1]',
    panelBorder: 'border-[#FDF3A3]',
    swatch: 'bg-[#FEF9D1]',
    text: 'text-[#70620A]',
  },
  danger: {
    dot: 'bg-[#FF5456]',
    chip: 'border-[#FFC1C1] bg-[#FFE0E0] text-[#752425]',
    card: 'bg-[#FFE0E0]',
    panelBorder: 'border-[#FFC1C1]',
    swatch: 'bg-[#FFE0E0]',
    text: 'text-[#752425]',
  },
};

const EVENT_COLOR_BY_TYPE = {
  meeting: 'primary',
  deadline: 'warning',
  presentation: 'secondary',
  review: 'info',
  content: 'success',
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
  const [hours, minutes] = (timeValue || '00:00').split(':').map(Number);

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
  return EVENT_COLOR_BY_TYPE[type] ?? 'primary';
}

export function hasEventTime(event) {
  return event?.hasTime !== false;
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
  if (!hasEventTime(event)) {
    if (isSameDay(event.start, event.end)) {
      return formatCompactDate(event.start);
    }

    return `${formatCompactDate(event.start)} - ${formatCompactDate(
      event.end
    )}`;
  }

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

function getTodoDateDiff(todoDate, anchorDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.round(
    (startOfDay(todoDate).getTime() - startOfDay(anchorDate).getTime()) /
      millisecondsPerDay
  );
}

export function getTodoBadgeLabel(todoDate, anchorDate) {
  const diffDays = getTodoDateDiff(todoDate, anchorDate);

  if (diffDays === 0) {
    return 'D-Day';
  }

  if (diffDays > 0) {
    return `D-${diffDays}`;
  }

  return `D+${Math.abs(diffDays)}`;
}

export function getTodoBadgeToneClassName(todoDate, anchorDate) {
  const diffDays = getTodoDateDiff(todoDate, anchorDate);

  if (diffDays < 0) {
    return 'bg-[#FBE4E4] text-[#A04949] ring-1 ring-inset ring-[#F1C7C7]';
  }

  if (diffDays === 0) {
    return 'bg-[#3A3A3A] text-white ring-1 ring-inset ring-[#565656]';
  }

  if (diffDays <= 3) {
    return 'bg-[#F9F1DE] text-[#8E6820] ring-1 ring-inset ring-[#EFD79C]';
  }

  if (diffDays <= 7) {
    return 'bg-[#E6EDF6] text-[#50627F] ring-1 ring-inset ring-[#C9D7EA]';
  }

  return 'bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200';
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
        color: 'primary',
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
        color: 'warning',
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
        color: 'secondary',
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
        color: 'success',
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
        color: 'info',
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
