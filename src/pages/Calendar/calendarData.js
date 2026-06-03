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
  { value: 'other', label: '기타' },
];

export const EVENT_COLOR_OPTIONS = [
  {
    value: 'green',
    label: '그린',
  },
  {
    value: 'teal',
    label: '티얼',
  },
  {
    value: 'brightGreen',
    label: '라임',
  },
  {
    value: 'blue',
    label: '블루',
  },
  {
    value: 'yellow',
    label: '옐로우',
  },
  {
    value: 'red',
    label: '레드',
  },
];

export const EVENT_THEMES = {
  green: {
    dot: 'bg-[#95D34F]',
    chip: 'border-[#D1EFA9] bg-[#E8F7D4] text-[#3F6021]',
    card: 'bg-[#E8F7D4]',
    panelBorder: 'border-[#D1EFA9]',
    swatch: 'bg-[#E8F7D4]',
    text: 'text-[#3F6021]',
  },
  teal: {
    dot: 'bg-[#3CC4AD]',
    chip: 'border-[#A9EBE1] bg-[#D4F5F0] text-[#1A574D]',
    card: 'bg-[#D4F5F0]',
    panelBorder: 'border-[#A9EBE1]',
    swatch: 'bg-[#D4F5F0]',
    text: 'text-[#1A574D]',
  },
  brightGreen: {
    dot: 'bg-[#6FDB6D]',
    chip: 'border-[#BFEFBD] bg-[#DFF7DE] text-[#2D632C]',
    card: 'bg-[#DFF7DE]',
    panelBorder: 'border-[#BFEFBD]',
    swatch: 'bg-[#DFF7DE]',
    text: 'text-[#2D632C]',
  },
  blue: {
    dot: 'bg-[#5BA3F3]',
    chip: 'border-[#BBE1FB] bg-[#DDF0FD] text-[#214B75]',
    card: 'bg-[#DDF0FD]',
    panelBorder: 'border-[#BBE1FB]',
    swatch: 'bg-[#DDF0FD]',
    text: 'text-[#214B75]',
  },
  yellow: {
    dot: 'bg-[#F2D518]',
    chip: 'border-[#FDF3A3] bg-[#FEF9D1] text-[#70620A]',
    card: 'bg-[#FEF9D1]',
    panelBorder: 'border-[#FDF3A3]',
    swatch: 'bg-[#FEF9D1]',
    text: 'text-[#70620A]',
  },
  red: {
    dot: 'bg-[#FF5456]',
    chip: 'border-[#FFC1C1] bg-[#FFE0E0] text-[#752425]',
    card: 'bg-[#FFE0E0]',
    panelBorder: 'border-[#FFC1C1]',
    swatch: 'bg-[#FFE0E0]',
    text: 'text-[#752425]',
  },
};

const EVENT_COLOR_BY_TYPE = {
  meeting: 'green',
  deadline: 'yellow',
  presentation: 'teal',
  other: 'blue',
};

function padNumber(value) {
  return String(value).padStart(2, '0');
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
  return EVENT_COLOR_BY_TYPE[type] ?? 'green';
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
