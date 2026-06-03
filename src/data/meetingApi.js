import {
  LONG_RUNNING_API_TIMEOUT_MS,
  apiClient,
  extractApiErrorMessage,
} from "./apiClient";

const MAX_AUDIO_FILE_SIZE = 50 * 1024 * 1024;
const SUPPORTED_AUDIO_EXTENSIONS = ["mp3", "wav", "m4a"];
const DEFAULT_DRAFT_DURATION_MINUTES = 40;
const DEFAULT_AUDIO_DRAFT_DATE = () => new Date().toISOString().slice(0, 10);

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

function normalizeStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => toTrimmedString(item)).filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const separator = value.includes("\n") ? "\n" : ",";

  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function alignActionItemChecks(actionItems, actionItemChecks = []) {
  return actionItems.map((_, index) => Boolean(actionItemChecks[index]));
}

function parseDurationMinutes(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }

  const normalizedValue = toTrimmedString(value);

  if (!normalizedValue) {
    return 0;
  }

  if (/^\d+$/.test(normalizedValue)) {
    return Number(normalizedValue);
  }

  const koreanMinuteMatch = normalizedValue.match(/(\d+)\s*분/);

  if (koreanMinuteMatch) {
    return Number(koreanMinuteMatch[1]);
  }

  const timeMatch = normalizedValue.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/,
  );

  if (timeMatch) {
    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);
    const seconds = Number(timeMatch[3] ?? 0);

    return hours * 60 + minutes + (seconds >= 30 ? 1 : 0);
  }

  const firstNumberMatch = normalizedValue.match(/\d+/);

  return firstNumberMatch ? Number(firstNumberMatch[0]) : 0;
}

function normalizeSourceType(value, fallbackValue = "manual") {
  const normalizedValue = toTrimmedString(value);

  return normalizedValue === "upload" ? "upload" : fallbackValue;
}

function normalizeMeetingFields(rawMeeting, fallbackValues = {}) {
  const actionItems = normalizeStringList(
    pickFirstDefined(rawMeeting?.actionItems, rawMeeting?.action_items, []),
  );

  return {
    project: toTrimmedString(
      pickFirstDefined(
        rawMeeting?.project,
        rawMeeting?.projectName,
        fallbackValues.project,
      ),
    ),
    title: toTrimmedString(
      pickFirstDefined(rawMeeting?.title, fallbackValues.title),
    ),
    date:
      toTrimmedString(pickFirstDefined(rawMeeting?.date, fallbackValues.date)) ||
      DEFAULT_AUDIO_DRAFT_DATE(),
    durationMinutes: parseDurationMinutes(
      pickFirstDefined(
        rawMeeting?.durationMinutes,
        rawMeeting?.duration_minutes,
        rawMeeting?.duration,
        fallbackValues.durationMinutes,
      ),
    ),
    participants: normalizeStringList(
      pickFirstDefined(rawMeeting?.participants, fallbackValues.participants, []),
    ),
    summary: toTrimmedString(
      pickFirstDefined(
        rawMeeting?.summary,
        rawMeeting?.aiSummary,
        rawMeeting?.ai_summary,
        fallbackValues.summary,
      ),
    ),
    tags: normalizeStringList(
      pickFirstDefined(rawMeeting?.tags, fallbackValues.tags, []),
    ),
    transcript: toTrimmedString(
      pickFirstDefined(rawMeeting?.transcript, fallbackValues.transcript),
    ),
    keyPoints: normalizeStringList(
      pickFirstDefined(rawMeeting?.keyPoints, rawMeeting?.key_points, []),
    ),
    actionItems,
    actionItemChecks: alignActionItemChecks(
      actionItems,
      pickFirstDefined(
        rawMeeting?.actionItemChecks,
        rawMeeting?.action_item_checks,
        fallbackValues.actionItemChecks,
        [],
      ),
    ),
    sourceType: normalizeSourceType(
      pickFirstDefined(rawMeeting?.sourceType, fallbackValues.sourceType),
      fallbackValues.sourceType ?? "manual",
    ),
    audioFileName: toTrimmedString(
      pickFirstDefined(rawMeeting?.audioFileName, fallbackValues.audioFileName),
    ),
  };
}

function normalizeMeetingNote(rawMeeting) {
  return {
    id: String(rawMeeting?.id),
    projectId: pickFirstDefined(rawMeeting?.projectId, rawMeeting?.project_id, null),
    ...normalizeMeetingFields(rawMeeting),
    createdAt:
      toTrimmedString(
        pickFirstDefined(rawMeeting?.createdAt, rawMeeting?.created_at),
      ) || new Date().toISOString(),
    updatedAt:
      toTrimmedString(
        pickFirstDefined(rawMeeting?.updatedAt, rawMeeting?.updated_at),
      ) || new Date().toISOString(),
  };
}

function buildMeetingRequestPayload(payload) {
  const actionItems = normalizeStringList(payload?.actionItems ?? []);

  return {
    project: toTrimmedString(payload?.project) || null,
    title: toTrimmedString(payload?.title),
    date: toTrimmedString(payload?.date),
    durationMinutes: parseDurationMinutes(payload?.durationMinutes),
    participants: normalizeStringList(payload?.participants ?? []),
    summary: toTrimmedString(payload?.summary),
    tags: normalizeStringList(payload?.tags ?? []),
    transcript: toTrimmedString(payload?.transcript),
    keyPoints: normalizeStringList(payload?.keyPoints ?? []),
    actionItems,
    actionItemChecks: alignActionItemChecks(
      actionItems,
      payload?.actionItemChecks ?? [],
    ),
    sourceType: normalizeSourceType(payload?.sourceType),
    audioFileName: toTrimmedString(payload?.audioFileName),
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

function buildProjectOptionsFromMeetingNotes(meetingNotes) {
  return Array.from(
    new Set(
      meetingNotes.map((meetingNote) => meetingNote.project).filter(Boolean),
    ),
  );
}

function normalizeMeetingProjectsResponse(responseData) {
  let rawProjects = [];

  if (Array.isArray(responseData)) {
    rawProjects = responseData;
  } else if (Array.isArray(responseData?.results)) {
    rawProjects = responseData.results;
  } else if (Array.isArray(responseData?.projects)) {
    rawProjects = responseData.projects;
  } else if (Array.isArray(responseData?.data)) {
    rawProjects = responseData.data;
  }

  return Array.from(
    new Set(
      rawProjects
        .map((project) => {
          if (typeof project === "string") {
            return project.trim();
          }

          return toTrimmedString(
            project?.name ??
              project?.project ??
              project?.projectName ??
              project?.title,
          );
        })
        .filter(Boolean),
    ),
  );
}

function validateAudioFile(file) {
  if (!file) {
    return "Please choose an audio file to upload.";
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!SUPPORTED_AUDIO_EXTENSIONS.includes(extension)) {
    return "Only MP3, WAV, and M4A audio files are supported.";
  }

  if (file.size > MAX_AUDIO_FILE_SIZE) {
    return "The audio file is larger than 50MB. Please choose a smaller file.";
  }

  return "";
}

function buildDraftTitleFromFileName(fileName) {
  const cleanedName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleanedName || "New meeting note";
}

function normalizeDraftResponse(responseData, fileName, projectName) {
  const rawDraft =
    responseData?.draft ?? responseData?.data ?? responseData?.meeting ?? responseData;

  return normalizeMeetingFields(rawDraft, {
    project: projectName,
    title: buildDraftTitleFromFileName(fileName),
    date: DEFAULT_AUDIO_DRAFT_DATE(),
    durationMinutes: DEFAULT_DRAFT_DURATION_MINUTES,
    sourceType: "upload",
    audioFileName: fileName,
  });
}

export async function getMeetingNotes() {
  try {
    const meetingNotes = await getPaginatedResults("/api/meetings/", {
      page_size: 100,
    });

    return meetingNotes.map(normalizeMeetingNote);
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        "Failed to load meeting notes from the server.",
      ),
    );
  }
}

export async function getMeetingProjects() {
  try {
    const response = await apiClient.get("/api/meetings/projects/");
    const normalizedProjects = normalizeMeetingProjectsResponse(response.data);

    if (normalizedProjects.length > 0) {
      return normalizedProjects;
    }
  } catch (error) {
    try {
      const meetingNotes = await getMeetingNotes();
      const fallbackProjects = buildProjectOptionsFromMeetingNotes(meetingNotes);

      if (fallbackProjects.length > 0) {
        return fallbackProjects;
      }
    } catch {
      throw new Error(
        extractApiErrorMessage(
          error,
          "Failed to load the meeting project list from the server.",
        ),
      );
    }

    throw new Error(
      extractApiErrorMessage(
        error,
        "Failed to load the meeting project list from the server.",
      ),
    );
  }

  const meetingNotes = await getMeetingNotes();
  return buildProjectOptionsFromMeetingNotes(meetingNotes);
}

export async function createMeetingNote(payload) {
  try {
    const response = await apiClient.post(
      "/api/meetings/",
      buildMeetingRequestPayload(payload),
    );

    return normalizeMeetingNote(response.data);
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "Failed to create the meeting note."),
    );
  }
}

export async function updateMeetingNote(meetingNoteId, payload) {
  try {
    const response = await apiClient.patch(
      `/api/meetings/${meetingNoteId}/`,
      buildMeetingRequestPayload(payload),
    );

    return normalizeMeetingNote(response.data);
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "Failed to update the meeting note."),
    );
  }
}

export async function deleteMeetingNote(meetingNoteId) {
  try {
    await apiClient.delete(`/api/meetings/${meetingNoteId}/`);
    return true;
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(error, "Failed to delete the meeting note."),
    );
  }
}

export async function generateMeetingDraftFromAudio(file, project) {
  const validationMessage = validateAudioFile(file);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const projectName = toTrimmedString(project);
  const payload = {
    file,
  };

  if (projectName) {
    payload.project = projectName;
  }

  try {
    const response = await apiClient.postForm(
      "/api/meetings/draft-from-audio/",
      payload,
      { timeout: LONG_RUNNING_API_TIMEOUT_MS },
    );

    return normalizeDraftResponse(response.data, file.name, projectName);
  } catch (error) {
    throw new Error(
      extractApiErrorMessage(
        error,
        "녹음 파일로 회의록 초안을 생성하지 못했습니다.",
      ),
    );
  }
}

export { MAX_AUDIO_FILE_SIZE, SUPPORTED_AUDIO_EXTENSIONS };
