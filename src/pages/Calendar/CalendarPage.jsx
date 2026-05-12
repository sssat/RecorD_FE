import { useMemo, useState } from "react";
import {
  EVENT_THEMES,
  WEEKDAY_LABELS,
  buildMockCalendarData,
  buildMonthGrid,
  combineDateAndTime,
  formatEventDateRange,
  formatMonthTitle,
  formatReadableDate,
  getTodoBadgeToneClassName,
  formatTodoDate,
  getEventColorByType,
  getTodoBadgeLabel,
  getTodoPriorityLabel,
  isSameDay,
  isSameMonth,
  isWithinRange,
  startOfDay,
  startOfMonth,
  toDateKey,
  toInputDateValue,
  toTimeInputValue,
} from "./calendarData";
import {
  EventDetailDialog,
  EventFormDialog,
  TodoFormDialog,
} from "./CalendarDialogs";

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[2]"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[2]"
    >
      <path d="m14.5 5.5-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[2]"
    >
      <path d="m9.5 5.5 6 6-6 6" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="m4.75 16.75 8.8-8.8 3.5 3.5-8.8 8.8-3.9.4.4-3.9Z" />
      <path d="m12.75 8.75 2.25-2.25a1.6 1.6 0 0 1 2.25 0l.25.25a1.6 1.6 0 0 1 0 2.25l-2.25 2.25" />
    </svg>
  );
}

function CheckCircleIcon({ completed = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 fill-none stroke-current stroke-[1.8]"
    >
      <circle cx="12" cy="12" r="8.5" />
      {completed ? <path d="m8.7 12 2.1 2.2 4.7-4.9" /> : null}
    </svg>
  );
}

function ActionButton({ children, tone = "primary", ...props }) {
  const toneClassName =
    tone === "secondary"
      ? "bg-[#767676] text-white shadow-[0_18px_35px_-22px_rgba(118,118,118,0.55)] hover:bg-[#565656]"
      : "bg-[#3A3A3A] text-white shadow-[0_18px_35px_-22px_rgba(58,58,58,0.55)] hover:bg-[#000000]";

  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-2 rounded-[22px] px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${toneClassName}`}
    >
      {children}
    </button>
  );
}

function getEventSegmentClass(day, event) {
  const isStart = isSameDay(day, event.start);
  const isEnd = isSameDay(day, event.end);

  if (isStart && isEnd) {
    return "rounded-full";
  }

  if (isStart) {
    return "rounded-l-full rounded-r-md";
  }

  if (isEnd) {
    return "rounded-l-md rounded-r-full";
  }

  return "rounded-md";
}

function moveMonth(date, amount) {
  const targetYear = date.getFullYear();
  const targetMonth = date.getMonth() + amount;
  const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
  const safeDay = Math.min(date.getDate(), lastDay);

  return startOfDay(new Date(targetYear, targetMonth, safeDay));
}

function getSortableEventStart(event, anchorDate) {
  const eventStartTime = startOfDay(event.start).getTime();
  const anchorTime = startOfDay(anchorDate).getTime();

  return Math.max(eventStartTime, anchorTime);
}

function sortEventsByAnchor(events, anchorDate) {
  return [...events].sort((firstEvent, secondEvent) => {
    const firstTime = getSortableEventStart(firstEvent, anchorDate);
    const secondTime = getSortableEventStart(secondEvent, anchorDate);

    if (firstTime !== secondTime) {
      return firstTime - secondTime;
    }

    return firstEvent.start - secondEvent.start;
  });
}

function sortTodosByPriorityAndDate(todos) {
  const priorityRank = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...todos].sort((firstTodo, secondTodo) => {
    const firstPriority =
      priorityRank[firstTodo.priority] ?? priorityRank.medium;
    const secondPriority =
      priorityRank[secondTodo.priority] ?? priorityRank.medium;

    if (firstPriority !== secondPriority) {
      return firstPriority - secondPriority;
    }

    const firstDate = startOfDay(firstTodo.date).getTime();
    const secondDate = startOfDay(secondTodo.date).getTime();

    if (firstDate !== secondDate) {
      return firstDate - secondDate;
    }

    return firstTodo.title.localeCompare(secondTodo.title, "ko");
  });
}

function buildTodoFormInitialValues(selectedDate, todo) {
  if (todo) {
    return {
      title: todo.title,
      priority: todo.priority,
      date: toInputDateValue(todo.date),
      description: todo.description ?? "",
      project: todo.project ?? "선택하지 않음",
    };
  }

  return {
    title: "",
    priority: "medium",
    date: toInputDateValue(selectedDate),
    description: "",
    project: "선택하지 않음",
  };
}

function buildEventFormInitialValues(selectedDate, event) {
  if (event) {
    const hasTime = event.hasTime !== false;

    return {
      title: event.title,
      startDate: toInputDateValue(event.start),
      endDate: toInputDateValue(event.end),
      startTime: hasTime ? toTimeInputValue(event.start) : "09:00",
      endTime: hasTime ? toTimeInputValue(event.end) : "10:00",
      hasTime,
      type: event.type,
      color: event.color,
      location: event.location ?? "",
      description: event.description ?? "",
      project: event.project ?? "선택하지 않음",
    };
  }

  return {
    title: "",
    startDate: toInputDateValue(selectedDate),
    endDate: toInputDateValue(selectedDate),
    startTime: "14:00",
    endTime: "15:00",
    hasTime: false,
    type: "meeting",
    color: getEventColorByType("meeting"),
    location: "",
    description: "",
    project: "선택하지 않음",
  };
}

function CalendarPage() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [calendarState, setCalendarState] = useState(() =>
    buildMockCalendarData(today),
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(today));
  const [todoDialog, setTodoDialog] = useState(null);
  const [eventDialog, setEventDialog] = useState(null);
  const [detailEventId, setDetailEventId] = useState(null);

  const { events, todos } = calendarState;

  const calendarDays = useMemo(
    () => buildMonthGrid(currentMonth),
    [currentMonth],
  );

  const eventsByDate = useMemo(() => {
    const map = new Map();

    events.forEach((event) => {
      const startDate = startOfDay(event.start);
      const endDate = startOfDay(event.end);

      for (
        let cursor = startDate;
        cursor.getTime() <= endDate.getTime();
        cursor = new Date(
          cursor.getFullYear(),
          cursor.getMonth(),
          cursor.getDate() + 1,
        )
      ) {
        const dateKey = toDateKey(cursor);
        const dateEvents = map.get(dateKey) ?? [];
        dateEvents.push(event);
        map.set(dateKey, dateEvents);
      }
    });

    return map;
  }, [events]);

  const todosByDate = useMemo(() => {
    const map = new Map();

    todos.forEach((todo) => {
      const dateKey = toDateKey(todo.date);
      const dateTodos = map.get(dateKey) ?? [];
      dateTodos.push(todo);
      map.set(dateKey, dateTodos);
    });

    return map;
  }, [todos]);

  const monthEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          isSameMonth(event.start, currentMonth) ||
          isSameMonth(event.end, currentMonth) ||
          isWithinRange(currentMonth, event.start, event.end),
      ),
    [currentMonth, events],
  );

  const monthTodos = useMemo(
    () => todos.filter((todo) => isSameMonth(todo.date, currentMonth)),
    [currentMonth, todos],
  );

  const selectedUpcomingEvents = useMemo(() => {
    const anchorTime = startOfDay(selectedDate).getTime();

    return sortEventsByAnchor(
      events.filter((event) => startOfDay(event.end).getTime() >= anchorTime),
      selectedDate,
    ).slice(0, 4);
  }, [events, selectedDate]);

  const activeTodos = useMemo(() => {
    const anchorTime = startOfDay(selectedDate).getTime();

    return sortTodosByPriorityAndDate(
      todos.filter(
        (todo) =>
          !todo.completed && startOfDay(todo.date).getTime() >= anchorTime,
      ),
    );
  }, [selectedDate, todos]);

  const completedTodos = useMemo(
    () =>
      [...todos]
        .filter(
          (todo) => todo.completed && isSameDay(todo.date, selectedDate),
        )
        .sort((firstTodo, secondTodo) => {
          const firstTime =
            firstTodo.completedAt?.getTime() ?? firstTodo.date.getTime();
          const secondTime =
            secondTodo.completedAt?.getTime() ?? secondTodo.date.getTime();

          return secondTime - firstTime;
        }),
    [selectedDate, todos],
  );

  const selectedEvent =
    detailEventId !== null
      ? (events.find((event) => event.id === detailEventId) ?? null)
      : null;

  const editingTodo =
    todoDialog?.todoId != null
      ? (todos.find((todo) => todo.id === todoDialog.todoId) ?? null)
      : null;

  const editingEvent =
    eventDialog?.eventId != null
      ? (events.find((event) => event.id === eventDialog.eventId) ?? null)
      : null;

  const selectDate = (day) => {
    const normalizedDate = startOfDay(day);
    setSelectedDate(normalizedDate);
    setCurrentMonth(startOfMonth(normalizedDate));
  };

  const changeMonth = (amount) => {
    const shiftedDate = moveMonth(selectedDate, amount);
    setSelectedDate(shiftedDate);
    setCurrentMonth(startOfMonth(shiftedDate));
  };

  const goToToday = () => {
    setSelectedDate(today);
    setCurrentMonth(startOfMonth(today));
  };

  const toggleTodoCompletion = (todoId) => {
    setCalendarState((currentState) => ({
      ...currentState,
      todos: currentState.todos.map((todo) => {
        if (todo.id !== todoId) {
          return todo;
        }

        const nextCompleted = !todo.completed;

        return {
          ...todo,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date() : null,
        };
      }),
    }));
  };

  const handleSubmitTodo = (formValues) => {
    setCalendarState((currentState) => {
      const todoDate = formValues.date
        ? startOfDay(new Date(`${formValues.date}T00:00:00`))
        : selectedDate;

      if (todoDialog?.mode === "edit" && editingTodo) {
        return {
          ...currentState,
          todos: currentState.todos.map((todo) =>
            todo.id === editingTodo.id
              ? {
                  ...todo,
                  title: formValues.title,
                  priority: formValues.priority,
                  date: todoDate,
                  description: formValues.description,
                  project: formValues.project,
                }
              : todo,
          ),
        };
      }

      return {
        ...currentState,
        todos: [
          ...currentState.todos,
          {
            id: `todo-${Date.now()}`,
            title: formValues.title,
            priority: formValues.priority,
            date: todoDate,
            description: formValues.description,
            project: formValues.project,
            completed: false,
            completedAt: null,
          },
        ],
      };
    });

    setTodoDialog(null);
  };

  const handleSubmitEvent = (formValues) => {
    setCalendarState((currentState) => {
      const startDateValue = formValues.startDate || toInputDateValue(selectedDate);
      const endDateValue =
        formValues.endDate && formValues.endDate >= startDateValue
          ? formValues.endDate
          : startDateValue;
      const hasTime = formValues.hasTime !== false;
      const startDate = combineDateAndTime(
        startDateValue,
        hasTime ? formValues.startTime : "00:00",
      );
      let endDate = combineDateAndTime(
        endDateValue,
        hasTime ? formValues.endTime : "00:00",
      );

      if (
        hasTime &&
        endDateValue === startDateValue &&
        endDate.getTime() <= startDate.getTime()
      ) {
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      }

      if (eventDialog?.mode === "edit" && editingEvent) {
        return {
          ...currentState,
          events: currentState.events.map((event) =>
            event.id === editingEvent.id
              ? {
                  ...event,
                  title: formValues.title,
                  start: startDate,
                  end: endDate,
                  hasTime,
                  type: formValues.type,
                  color: formValues.color,
                  location: formValues.location,
                  description: formValues.description,
                  project: formValues.project,
                }
              : event,
          ),
        };
      }

      return {
        ...currentState,
        events: [
          ...currentState.events,
          {
            id: `event-${Date.now()}`,
            title: formValues.title,
            start: startDate,
            end: endDate,
            hasTime,
            type: formValues.type,
            color: formValues.color,
            location: formValues.location,
            description: formValues.description,
            project: formValues.project,
          },
        ],
      };
    });

    setEventDialog(null);
  };

  const deleteEvent = (eventId) => {
    setCalendarState((currentState) => ({
      ...currentState,
      events: currentState.events.filter((event) => event.id !== eventId),
    }));
    setDetailEventId(null);
  };

  const openCreateTodoDialog = () => {
    setTodoDialog({ mode: "create", todoId: null });
  };

  const openCreateEventDialog = () => {
    setEventDialog({ mode: "create", eventId: null });
  };

  const openEditTodoDialog = (todo) => {
    setTodoDialog({ mode: "edit", todoId: todo.id });
  };

  const openEventDetailDialog = (event) => {
    setDetailEventId(event.id);
  };

  const openEventEditDialog = (event) => {
    setDetailEventId(null);
    setEventDialog({ mode: "edit", eventId: event.id });
  };

  return (
    <>
      <section className="calendar-page space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              캘린더
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionButton tone="secondary" onClick={openCreateTodoDialog}>
              <PlusIcon />새 할 일
            </ActionButton>
            <ActionButton onClick={openCreateEventDialog}>
              <PlusIcon />새 일정
            </ActionButton>
          </div>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_390px]">
          <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  {formatMonthTitle(currentMonth)}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  이번 달 일정 {monthEvents.length}개 · 할 일{" "}
                  {monthTodos.length}개
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToToday}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-[#767676] hover:text-slate-900"
                >
                  오늘
                </button>
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#767676] hover:text-slate-900"
                  aria-label="이전 달"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#767676] hover:text-slate-900"
                  aria-label="다음 달"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-200">
              <div className="grid grid-cols-7 gap-px bg-slate-200">
                {WEEKDAY_LABELS.map((label, index) => {
                  const textColorClassName =
                    index === 0
                      ? "text-rose-400"
                      : index === 6
                        ? "text-lime-500"
                        : "text-slate-400";

                  return (
                    <div
                      key={label}
                      className={`bg-slate-50 px-3 py-4 text-center text-base font-semibold ${textColorClassName}`}
                    >
                      {label}
                    </div>
                  );
                })}

                {calendarDays.map((day) => {
                  const dateKey = toDateKey(day);
                  const dayEvents = eventsByDate.get(dateKey) ?? [];
                  const dayTodos = todosByDate.get(dateKey) ?? [];
                  const visibleEvents = dayEvents.slice(0, 2);
                  const hiddenEventCount = Math.max(
                    dayEvents.length - visibleEvents.length,
                    0,
                  );
                  const isToday = isSameDay(day, today);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);

                  return (
                    <div
                      key={dateKey}
                      role="button"
                      tabIndex={0}
                      onClick={() => selectDate(day)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectDate(day);
                        }
                      }}
                      className={`min-h-[140px] bg-white px-3 py-3 text-left align-top transition outline-none sm:min-h-[154px] ${
                        isCurrentMonth ? "" : "bg-slate-50/70 text-slate-300"
                      } ${
                        isSelected
                          ? "ring-2 ring-inset ring-[#767676]"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                            isSelected
                              ? "bg-[#3A3A3A] text-white"
                              : isToday
                                ? "bg-[#767676] text-white"
                                : isCurrentMonth
                                  ? "text-slate-700"
                                  : "text-slate-300"
                          }`}
                        >
                          {day.getDate()}
                        </span>

                        {dayTodos.length > 0 ? (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                            할 일 {dayTodos.length}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 space-y-1.5">
                        {visibleEvents.map((event) => {
                          const theme =
                            EVENT_THEMES[event.color] ?? EVENT_THEMES.primary;

                          return (
                            <button
                              key={`${event.id}-${dateKey}`}
                              type="button"
                              onClick={(eventClick) => {
                                eventClick.stopPropagation();
                                selectDate(day);
                                openEventDetailDialog(event);
                              }}
                              className={`truncate border px-2 py-1 text-[11px] font-semibold ${theme.chip} ${getEventSegmentClass(day, event)}`}
                            >
                              {event.title}
                            </button>
                          );
                        })}

                        {hiddenEventCount > 0 ? (
                          <p className="truncate px-1 text-[11px] font-medium text-slate-400">
                            +{hiddenEventCount}개 일정
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    다가오는 일정
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {formatReadableDate(selectedDate)} 기준
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {selectedUpcomingEvents.length}개
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {selectedUpcomingEvents.length > 0 ? (
                  selectedUpcomingEvents.map((event) => {
                    const theme =
                      EVENT_THEMES[event.color] ?? EVENT_THEMES.primary;

                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => openEventDetailDialog(event)}
                        className={`block w-full rounded-[24px] border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${theme.panelBorder}`}
                      >
                        <div className="flex items-start gap-4">
                          <span
                            className={`mt-2 h-4 w-4 rounded-full ${theme.dot}`}
                          />
                          <div className="min-w-0">
                            <h3 className="truncate text-xl font-semibold text-slate-900">
                              {event.title}
                            </h3>
                            <p className="mt-2 text-base text-slate-400">
                              {formatEventDateRange(event)}
                            </p>
                            {event.location ? (
                              <p className="mt-2 text-sm text-slate-400">
                                {event.location}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      선택한 날짜 이후 예정된 일정이 없습니다.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    할 일
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {formatReadableDate(selectedDate)} 기준
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    남은 일 {activeTodos.length}개
                  </span>
                  <button
                    type="button"
                    onClick={openCreateTodoDialog}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label="할 일 추가"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {activeTodos.length > 0 ? (
                  activeTodos.map((todo) => (
                    <article
                      key={todo.id}
                      className="flex items-start gap-4 rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTodoCompletion(todo.id)}
                        className="mt-1 text-slate-400 transition hover:text-[#565656]"
                        aria-label="할 일 완료 처리"
                      >
                        <CheckCircleIcon />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-[1.1rem] font-semibold text-slate-900">
                              {todo.title}
                            </h3>
                            <p className="mt-2 text-sm text-slate-400">
                              {formatTodoDate(todo.date)}
                            </p>
                            {todo.project &&
                            todo.project !== "선택하지 않음" ? (
                              <p className="mt-1 text-sm text-slate-400">
                                {todo.project}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${getTodoBadgeToneClassName(
                                todo.date,
                                selectedDate,
                              )}`}
                            >
                              {getTodoBadgeLabel(todo.date, selectedDate)}
                            </span>
                            <button
                              type="button"
                              onClick={() => openEditTodoDialog(todo)}
                              className="rounded-full p-2 text-slate-300 transition hover:bg-white hover:text-slate-500"
                              aria-label="할 일 수정"
                            >
                              <PencilIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      선택한 날짜 이후 남은 할 일이 없습니다.
                    </p>
                  </div>
                )}
              </div>

              {completedTodos.length > 0 ? (
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <p className="text-lg font-semibold text-slate-400">완료됨</p>

                  <div className="mt-4 space-y-4">
                    {completedTodos.map((todo) => (
                      <article
                        key={todo.id}
                        className="flex items-start gap-4 px-2 py-1"
                      >
                        <button
                          type="button"
                          onClick={() => toggleTodoCompletion(todo.id)}
                          className="mt-1 text-[#565656] transition hover:text-[#3A3A3A]"
                          aria-label="완료 해제"
                        >
                          <CheckCircleIcon completed />
                        </button>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[1.05rem] font-medium text-slate-400 line-through">
                            {todo.title}
                          </h3>
                          <p className="mt-2 text-sm text-slate-300">
                            {getTodoPriorityLabel(todo.priority)}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </aside>
        </div>
      </section>

      {todoDialog ? (
        <TodoFormDialog
          key={`${todoDialog.mode}-${todoDialog.todoId ?? "new"}`}
          mode={todoDialog.mode}
          initialValues={buildTodoFormInitialValues(selectedDate, editingTodo)}
          onClose={() => setTodoDialog(null)}
          onSubmit={handleSubmitTodo}
        />
      ) : null}

      {eventDialog ? (
        <EventFormDialog
          key={`${eventDialog.mode}-${eventDialog.eventId ?? "new"}`}
          mode={eventDialog.mode}
          initialValues={buildEventFormInitialValues(
            selectedDate,
            editingEvent,
          )}
          onClose={() => setEventDialog(null)}
          onSubmit={handleSubmitEvent}
        />
      ) : null}

      {selectedEvent ? (
        <EventDetailDialog
          event={selectedEvent}
          onClose={() => setDetailEventId(null)}
          onDelete={deleteEvent}
          onEdit={openEventEditDialog}
        />
      ) : null}
    </>
  );
}

export default CalendarPage;
