import { apiClient, extractApiErrorMessage } from "./apiClient";

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

export const PROJECT_COLOR_CHOICES = Object.keys(PROJECT_COLOR_THEMES);

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

const PROJECT_PAGE_SIZE = 100;

const EMPTY_PROJECT_WORKSPACE = {
  projects: [],
  meetingNotes: [],
  todos: [],
  schedules: [],
  portfolios: [],
};

const PROJECT_STATUS_VALUES = new Set(["inProgress", "completed", "planning"]);
const PROJECT_COLOR_VALUES = new Set(Object.keys(PROJECT_COLOR_THEMES));

function cloneData(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function buildDefaultProjectWorkspace() {
  return cloneData(EMPTY_PROJECT_WORKSPACE);
}

function normalizeProjectWorkspace(workspace) {
  const defaultWorkspace = buildDefaultProjectWorkspace();

  return {
    projects: Array.isArray(workspace?.projects)
      ? workspace.projects
      : defaultWorkspace.projects,
    meetingNotes: Array.isArray(workspace?.meetingNotes)
      ? workspace.meetingNotes
      : defaultWorkspace.meetingNotes,
    todos: Array.isArray(workspace?.todos)
      ? workspace.todos
      : defaultWorkspace.todos,
    schedules: Array.isArray(workspace?.schedules)
      ? workspace.schedules
      : defaultWorkspace.schedules,
    portfolios: Array.isArray(workspace?.portfolios)
      ? workspace.portfolios
      : defaultWorkspace.portfolios,
  };
}

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

function toIdString(value) {
  const normalizedValue = pickFirstDefined(value, "");

  return normalizedValue === "" || normalizedValue === null
    ? ""
    : String(normalizedValue);
}

function toApiId(value) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function normalizeIdList(value) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function toDateValue(value) {
  return toTrimmedString(value).slice(0, 10);
}

function formatTime(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function formatScheduleTimeLabel(rawSchedule) {
  if (rawSchedule?.is_all_day) {
    return "종일";
  }

  const startDate = new Date(rawSchedule?.start_datetime);
  const endDate = new Date(rawSchedule?.end_datetime);
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);

  if (!startTime || !endTime) {
    return "";
  }

  return `${startTime} - ${endTime}`;
}

function normalizeStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => toTrimmedString(item)).filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(value.includes("\n") ? "\n" : ",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeProjectStatus(value) {
  return PROJECT_STATUS_VALUES.has(value) ? value : "inProgress";
}

function normalizeProjectColor(value) {
  return PROJECT_COLOR_VALUES.has(value) ? value : "green";
}

function getPriorityLabel(priority) {
  const labels = {
    high: "우선순위 높음",
    medium: "우선순위 보통",
    low: "우선순위 낮음",
  };

  return labels[priority] ?? "우선순위 보통";
}

function normalizeProject(rawProject) {
  return {
    id: toIdString(rawProject?.id),
    name: toTrimmedString(rawProject?.name),
    description: toTrimmedString(rawProject?.description),
    startDate: toDateValue(rawProject?.startDate),
    endDate: toDateValue(rawProject?.endDate),
    tags: normalizeStringList(rawProject?.tags),
    status: normalizeProjectStatus(rawProject?.status),
    colorKey: normalizeProjectColor(rawProject?.colorKey),
    meetingIds: normalizeIdList(rawProject?.meetingIds),
    todoIds: normalizeIdList(rawProject?.todoIds),
    scheduleIds: normalizeIdList(rawProject?.scheduleIds),
  };
}

function normalizeMeeting(rawMeeting) {
  const sourceType = toTrimmedString(rawMeeting?.sourceType);

  return {
    id: toIdString(rawMeeting?.id),
    projectId: toIdString(rawMeeting?.projectId),
    project: toTrimmedString(rawMeeting?.project),
    title: toTrimmedString(rawMeeting?.title),
    date: toDateValue(rawMeeting?.date),
    summary: toTrimmedString(rawMeeting?.aiSummary || rawMeeting?.summary),
    source: sourceType === "upload" ? "Whisper AI" : "수동 작성",
  };
}

function normalizeTodo(rawTodo) {
  const status = toTrimmedString(rawTodo?.status) || "in_progress";
  const priority = toTrimmedString(rawTodo?.priority) || "medium";

  return {
    id: toIdString(rawTodo?.id),
    projectId: toIdString(rawTodo?.project),
    title: toTrimmedString(rawTodo?.title),
    dueDate: toDateValue(rawTodo?.due_date),
    completed: status === "done",
    priority,
    estimate: getPriorityLabel(priority),
  };
}

function normalizeSchedule(rawSchedule) {
  return {
    id: toIdString(rawSchedule?.id),
    projectId: toIdString(rawSchedule?.project),
    title: toTrimmedString(rawSchedule?.title),
    date: toDateValue(rawSchedule?.start_datetime),
    timeLabel: formatScheduleTimeLabel(rawSchedule),
  };
}

function normalizePortfolio(rawPortfolio) {
  const action = pickFirstDefined(rawPortfolio?.action, []);

  return {
    id: toIdString(rawPortfolio?.id),
    projectId: toIdString(rawPortfolio?.projectId),
    title: toTrimmedString(rawPortfolio?.title),
    createdAt: toDateValue(rawPortfolio?.createdAt),
    summary: toTrimmedString(rawPortfolio?.summary || rawPortfolio?.description),
    keywords: normalizeStringList(rawPortfolio?.keywords),
    situation: toTrimmedString(rawPortfolio?.situation),
    task: toTrimmedString(rawPortfolio?.task),
    action: Array.isArray(action) ? action.map(toTrimmedString).filter(Boolean) : action,
    result: toTrimmedString(rawPortfolio?.result),
  };
}

function addDerivedProjectRelations(projects, meetingNotes, todos, schedules) {
  return projects.map((project) => {
    const meetingIds = new Set(project.meetingIds);
    const todoIds = new Set(project.todoIds);
    const scheduleIds = new Set(project.scheduleIds);

    meetingNotes.forEach((meetingNote) => {
      if (
        meetingNote.projectId === project.id ||
        (meetingNote.project && meetingNote.project === project.name)
      ) {
        meetingIds.add(meetingNote.id);
      }
    });

    todos.forEach((todo) => {
      if (todo.projectId === project.id) {
        todoIds.add(todo.id);
      }
    });

    schedules.forEach((schedule) => {
      if (schedule.projectId === project.id) {
        scheduleIds.add(schedule.id);
      }
    });

    return {
      ...project,
      meetingIds: Array.from(meetingIds),
      todoIds: Array.from(todoIds),
      scheduleIds: Array.from(scheduleIds),
    };
  });
}

function buildProjectRequestPayload(payload) {
  return {
    name: toTrimmedString(payload?.name),
    description: toTrimmedString(payload?.description),
    startDate: toDateValue(payload?.startDate) || null,
    endDate: toDateValue(payload?.endDate) || null,
    status: normalizeProjectStatus(payload?.status),
    tags: normalizeStringList(payload?.tags),
    colorKey: normalizeProjectColor(payload?.colorKey),
    meetingIds: normalizeIdList(payload?.meetingIds).map(toApiId).filter(Boolean),
    todoIds: normalizeIdList(payload?.todoIds).map(toApiId).filter(Boolean),
    scheduleIds: normalizeIdList(payload?.scheduleIds)
      .map(toApiId)
      .filter(Boolean),
  };
}

function buildPortfolioRequestPayload(payload, projectId) {
  return {
    projectId: toApiId(projectId ?? payload?.projectId),
    title: toTrimmedString(payload?.title),
    summary: toTrimmedString(payload?.summary || payload?.situation),
    keywords: normalizeStringList(payload?.keywords),
    situation: toTrimmedString(payload?.situation),
    task: toTrimmedString(payload?.task),
    action: normalizeStringList(payload?.action),
    result: toTrimmedString(payload?.result),
    isPublic: Boolean(payload?.isPublic),
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

async function patchItemProject(path, itemId, projectValue) {
  await apiClient.patch(`${path}${itemId}/`, { project: projectValue });
}

async function syncProjectRelations(project, nextValues, previousValues = {}) {
  const projectId = toApiId(project.id);

  if (!projectId) {
    return;
  }

  const relationConfigs = [
    {
      path: "/api/meetings/",
      selectedIds: normalizeIdList(nextValues.meetingIds),
      previousIds: normalizeIdList(previousValues.meetingIds),
      projectValue: project.name,
      emptyProjectValue: null,
    },
    {
      path: "/api/todos/",
      selectedIds: normalizeIdList(nextValues.todoIds),
      previousIds: normalizeIdList(previousValues.todoIds),
      projectValue: projectId,
      emptyProjectValue: null,
    },
    {
      path: "/api/schedules/",
      selectedIds: normalizeIdList(nextValues.scheduleIds),
      previousIds: normalizeIdList(previousValues.scheduleIds),
      projectValue: projectId,
      emptyProjectValue: null,
    },
  ];

  for (const config of relationConfigs) {
    const selectedIdSet = new Set(config.selectedIds);
    const previousIdSet = new Set(config.previousIds);
    const idsToAttach = config.selectedIds;
    const idsToDetach = config.previousIds.filter((id) => !selectedIdSet.has(id));

    await Promise.all([
      ...idsToAttach.map((id) =>
        patchItemProject(config.path, id, config.projectValue),
      ),
      ...idsToDetach
        .filter((id) => previousIdSet.has(id))
        .map((id) =>
          patchItemProject(config.path, id, config.emptyProjectValue),
        ),
    ]);
  }
}

export function getProjectWorkspace() {
  return buildDefaultProjectWorkspace();
}

export function saveProjectWorkspace(workspace) {
  return cloneData(normalizeProjectWorkspace(workspace));
}

export async function fetchProjectWorkspace() {
  try {
    const [
      rawProjects,
      rawMeetingNotes,
      rawTodos,
      rawSchedules,
      rawPortfolios,
    ] = await Promise.all([
      getPaginatedResults("/api/projects/", { page_size: PROJECT_PAGE_SIZE }),
      getPaginatedResults("/api/meetings/", { page_size: PROJECT_PAGE_SIZE }),
      getPaginatedResults("/api/todos/", { page_size: PROJECT_PAGE_SIZE }),
      getPaginatedResults("/api/schedules/", {
        ordering: "start_datetime",
        page_size: PROJECT_PAGE_SIZE,
      }),
      getPaginatedResults("/api/portfolios/", { page_size: PROJECT_PAGE_SIZE }),
    ]);

    const meetingNotes = rawMeetingNotes.map(normalizeMeeting);
    const todos = rawTodos.map(normalizeTodo);
    const schedules = rawSchedules.map(normalizeSchedule);
    const projects = addDerivedProjectRelations(
      rawProjects.map(normalizeProject),
      meetingNotes,
      todos,
      schedules,
    );
    const portfolios = rawPortfolios.map(normalizePortfolio);

    return normalizeProjectWorkspace({
      projects,
      meetingNotes,
      todos,
      schedules,
      portfolios,
    });
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "프로젝트 데이터를 불러오지 못했습니다."),
    );
  }
}

export async function createProject(payload) {
  try {
    const response = await apiClient.post(
      "/api/projects/",
      buildProjectRequestPayload(payload),
    );
    const project = normalizeProject(response.data);

    await syncProjectRelations(project, payload);

    return project;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "프로젝트를 생성하지 못했습니다."),
    );
  }
}

export async function updateProject(projectId, payload, previousProject) {
  try {
    const response = await apiClient.patch(
      `/api/projects/${projectId}/`,
      buildProjectRequestPayload(payload),
    );
    const project = normalizeProject(response.data);

    await syncProjectRelations(project, payload, previousProject);

    return project;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "프로젝트를 수정하지 못했습니다."),
    );
  }
}

export async function deleteProject(projectId) {
  try {
    await apiClient.delete(`/api/projects/${projectId}/`);
    return true;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "프로젝트를 삭제하지 못했습니다."),
    );
  }
}

export async function createPortfolio(payload, projectId) {
  try {
    const response = await apiClient.post(
      "/api/portfolios/",
      buildPortfolioRequestPayload(payload, projectId),
    );

    return normalizePortfolio(response.data);
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "포트폴리오를 생성하지 못했습니다."),
    );
  }
}

export async function updatePortfolio(portfolioId, payload, projectId) {
  try {
    const response = await apiClient.patch(
      `/api/portfolios/${portfolioId}/`,
      buildPortfolioRequestPayload(payload, projectId),
    );

    return normalizePortfolio(response.data);
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "포트폴리오를 수정하지 못했습니다."),
    );
  }
}

export async function deletePortfolio(portfolioId) {
  try {
    await apiClient.delete(`/api/portfolios/${portfolioId}/`);
    return true;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "포트폴리오를 삭제하지 못했습니다."),
    );
  }
}

export async function generatePortfolio(projectId) {
  try {
    const response = await apiClient.post("/api/portfolios/generate/", {
      projectId: toApiId(projectId),
    });

    return normalizePortfolio(response.data);
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "AI 포트폴리오를 생성하지 못했습니다."),
    );
  }
}

export function getProjectTheme(colorKey) {
  return PROJECT_COLOR_THEMES[colorKey] ?? PROJECT_COLOR_THEMES.green;
}

export function getProjectThemeByName(projectName) {
  const matchedProject = getProjectWorkspace().projects.find(
    (project) => project.name === projectName,
  );

  return getProjectTheme(matchedProject?.colorKey);
}
