const KOREAN_DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function parseDateInput(dateInput) {
  if (!dateInput) {
    return null;
  }

  if (dateInput instanceof Date) {
    return new Date(dateInput.getTime());
  }

  return new Date(`${dateInput}T00:00:00`);
}

export function formatKoreanDate(dateInput) {
  const parsedDate = parseDateInput(dateInput);

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return KOREAN_DATE_FORMATTER.format(parsedDate);
}

export function formatCompactKoreanDate(dateInput) {
  const parsedDate = parseDateInput(dateInput);

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();

  return `${year}. ${month}. ${day}.`;
}

export function formatDateRange(startDateInput, endDateInput) {
  return `${formatKoreanDate(startDateInput)} ~ ${formatKoreanDate(endDateInput)}`;
}

export function getDurationDays(startDateInput, endDateInput) {
  const startDate = parseDateInput(startDateInput);
  const endDate = parseDateInput(endDateInput);

  if (
    !startDate ||
    !endDate ||
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return 0;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const difference = endDate.getTime() - startDate.getTime();

  return Math.floor(difference / millisecondsPerDay) + 1;
}

export function isDateRangeValid(startDateInput, endDateInput) {
  const startDate = parseDateInput(startDateInput);
  const endDate = parseDateInput(endDateInput);

  if (
    !startDate ||
    !endDate ||
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return false;
  }

  return startDate.getTime() <= endDate.getTime();
}
