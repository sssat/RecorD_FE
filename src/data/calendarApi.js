import { apiClient, extractApiErrorMessage } from "./apiClient";

const CALENDAR_PAGE_SIZE = 100;

const SCHEDULE_TYPE_VALUES = new Set([
  "meeting",
  "deadline",
  "presentation",
  "other",
]);

const SCHEDULE_COLOR_VALUES = new Set([
  "green",
  "blue",
  "teal",
  "yellow",
  "brightGreen",
  "red",
]);

const TODO_PRIORITY_VALUES = new Set(["low", "medium", "high"]);
const TODO_STATUS_VALUES = new Set(["in_progress", "done"]);

const SCHEDULE_COLOR_BY_TYPE = {
  meeting: "green",
  deadline: "yellow",
  presentation: "teal",
  other: "blue",
};

function pickFirstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function toTrimmedString(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function toNullableProjectId(value) {
  if (value === "" || value === undefined || value === null) {
    return null;
  }

  const projectId = Number(value);
  return Number.isFinite(projectId) ? projectId : null;
}

function parseDateTime(value, fallbackDate = new Date()) {
  const date = value ? new Date(value) : fallbackDate;

  if (Number.isNaN(date.getTime())) {
    return fallbackDate;
  }

  return date;
}

function parseDateOnly(value, fallbackDate = new Date()) {
  const date =
    value instanceof Date
      ? value
      : value
        ? new Date(`${value}T00:00:00`)
        : fallbackDate;

  if (Number.isNaN(date.getTime())) {
    return fallbackDate;
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function toDateKey(date) {
  return [
    date.getFullYear(),
    padNumber(date.getMonth() + 1),
    padNumber(date.getDate()),
  ].join("-");
}

function normalizeScheduleType(value) {
  return SCHEDULE_TYPE_VALUES.has(value) ? value : "other";
}

function normalizeScheduleColor(value, type) {
  if (SCHEDULE_COLOR_VALUES.has(value)) {
    return value;
  }

  return SCHEDULE_COLOR_BY_TYPE[normalizeScheduleType(type)] ?? "green";
}

function normalizeTodoPriority(value) {
  return TODO_PRIORITY_VALUES.has(value) ? value : "medium";
}

function normalizeTodoStatus(value) {
  return TODO_STATUS_VALUES.has(value) ? value : "in_progress";
}

function normalizeProject(rawProject) {
  const id = pickFirstDefined(rawProject?.id, rawProject?.projectId);

  return {
    id: Number(id),
    name: toTrimmedString(rawProject?.name ?? rawProject?.title),
  };
}

function buildProjectLookup(projects) {
  return new Map(
    projects
      .filter((project) => Number.isFinite(project.id))
      .map((project) => [String(project.id), project]),
  );
}

function getProjectName(projectId, projectLookup) {
  if (projectId === null || projectId === undefined) {
    return "";
  }

  return projectLookup.get(String(projectId))?.name ?? "";
}

function normalizeSchedule(rawSchedule, projectLookup = new Map()) {
  const type = normalizeScheduleType(rawSchedule?.type);
  const start = parseDateTime(rawSchedule?.start_datetime);
  const end = parseDateTime(rawSchedule?.end_datetime, start);
  const projectId = toNullableProjectId(rawSchedule?.project);

  return {
    id: String(rawSchedule?.id),
    title: toTrimmedString(rawSchedule?.title),
    start,
    end: end.getTime() >= start.getTime() ? end : start,
    hasTime: rawSchedule?.is_all_day !== true,
    type,
    color: normalizeScheduleColor(rawSchedule?.color, type),
    location: toTrimmedString(rawSchedule?.location),
    description: toTrimmedString(rawSchedule?.description),
    projectId,
    project: getProjectName(projectId, projectLookup),
  };
}

function normalizeTodo(rawTodo, projectLookup = new Map()) {
  const status = normalizeTodoStatus(rawTodo?.status);
  const projectId = toNullableProjectId(rawTodo?.project);

  return {
    id: String(rawTodo?.id),
    title: toTrimmedString(rawTodo?.title),
    date: parseDateOnly(rawTodo?.due_date),
    priority: normalizeTodoPriority(rawTodo?.priority),
    status,
    completed: status === "done",
    completedAt:
      status === "done" ? parseDateTime(rawTodo?.updated_at, new Date()) : null,
    description: toTrimmedString(rawTodo?.description),
    projectId,
    project: getProjectName(projectId, projectLookup),
  };
}

function buildScheduleRequestPayload(payload) {
  const type = normalizeScheduleType(payload?.type);
  const color = normalizeScheduleColor(payload?.color, type);

  return {
    project: toNullableProjectId(payload?.projectId),
    title: toTrimmedString(payload?.title),
    description: toTrimmedString(payload?.description),
    type,
    color,
    start_datetime: parseDateTime(payload?.start).toISOString(),
    end_datetime: parseDateTime(payload?.end, parseDateTime(payload?.start)).toISOString(),
    is_all_day: payload?.hasTime === false,
    location: toTrimmedString(payload?.location),
  };
}

function buildTodoRequestPayload(payload) {
  const status = normalizeTodoStatus(
    payload?.status ?? (payload?.completed ? "done" : "in_progress"),
  );

  return {
    project: toNullableProjectId(payload?.projectId),
    title: toTrimmedString(payload?.title),
    description: toTrimmedString(payload?.description),
    priority: normalizeTodoPriority(payload?.priority),
    status,
    due_date: payload?.date ? toDateKey(parseDateOnly(payload.date)) : null,
  };
}

async function getPaginatedResults(path, params = {}) {
  const collectedResults = [];
  let nextPath = path;
  let nextParams = params;

  while (nextPath) {
    const response = await apiClient.get(nextPath, { params: nextParams });
    const responseData = response.data;

    if (Array.isArray(responseData)) {
      collectedResults.push(...responseData);
      break;
    }

    const pageResults = Array.isArray(responseData?.results)
      ? responseData.results
      : [];

    collectedResults.push(...pageResults);

    if (!responseData?.next) {
      break;
    }

    nextPath = responseData.next;
    nextParams = undefined;
  }

  return collectedResults;
}

async function getProjects() {
  const rawProjects = await getPaginatedResults("/api/projects/", {
    page_size: CALENDAR_PAGE_SIZE,
  });

  return rawProjects.map(normalizeProject).filter((project) => project.name);
}

export async function getCalendarData() {
  try {
    const projects = await getProjects();
    const projectLookup = buildProjectLookup(projects);
    const [rawSchedules, rawTodos] = await Promise.all([
      getPaginatedResults("/api/schedules/", {
        ordering: "start_datetime",
        page_size: CALENDAR_PAGE_SIZE,
      }),
      getPaginatedResults("/api/todos/", {
        ordering: "due_date",
        page_size: CALENDAR_PAGE_SIZE,
      }),
    ]);

    return {
      projects,
      events: rawSchedules.map((schedule) =>
        normalizeSchedule(schedule, projectLookup),
      ),
      todos: rawTodos.map((todo) => normalizeTodo(todo, projectLookup)),
    };
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "캘린더 데이터를 불러오지 못했습니다."),
    );
  }
}

export async function createCalendarEvent(payload, projects = []) {
  try {
    const response = await apiClient.post(
      "/api/schedules/",
      buildScheduleRequestPayload(payload),
    );

    return normalizeSchedule(response.data, buildProjectLookup(projects));
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "일정을 생성하지 못했습니다."),
    );
  }
}

export async function updateCalendarEvent(eventId, payload, projects = []) {
  try {
    const response = await apiClient.patch(
      `/api/schedules/${eventId}/`,
      buildScheduleRequestPayload(payload),
    );

    return normalizeSchedule(response.data, buildProjectLookup(projects));
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "일정을 수정하지 못했습니다."),
    );
  }
}

export async function deleteCalendarEvent(eventId) {
  try {
    await apiClient.delete(`/api/schedules/${eventId}/`);
    return true;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "일정을 삭제하지 못했습니다."),
    );
  }
}

export async function createCalendarTodo(payload, projects = []) {
  try {
    const response = await apiClient.post(
      "/api/todos/",
      buildTodoRequestPayload(payload),
    );

    return normalizeTodo(response.data, buildProjectLookup(projects));
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "할 일을 생성하지 못했습니다."),
    );
  }
}

export async function updateCalendarTodo(todoId, payload, projects = []) {
  try {
    const response = await apiClient.patch(
      `/api/todos/${todoId}/`,
      buildTodoRequestPayload(payload),
    );

    return normalizeTodo(response.data, buildProjectLookup(projects));
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "할 일을 수정하지 못했습니다."),
    );
  }
}

export async function deleteCalendarTodo(todoId) {
  try {
    await apiClient.delete(`/api/todos/${todoId}/`);
    return true;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "할 일을 삭제하지 못했습니다."),
    );
  }
}
