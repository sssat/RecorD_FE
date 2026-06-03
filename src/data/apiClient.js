import axios from "axios";

const DEFAULT_API_BASE_URL =
  "https://port-0-recor-d-be-moibwvfm46c84723.sel3.cloudtype.app";

const CANONICAL_ACCESS_TOKEN_KEY = "record-access-token";
const CANONICAL_REFRESH_TOKEN_KEY = "record-refresh-token";

const ACCESS_TOKEN_KEYS = [
  CANONICAL_ACCESS_TOKEN_KEY,
  "recordAccessToken",
  "accessToken",
  "access_token",
  "access",
  "token",
];

const REFRESH_TOKEN_KEYS = [
  CANONICAL_REFRESH_TOKEN_KEY,
  "recordRefreshToken",
  "refreshToken",
  "refresh_token",
  "refresh",
];

const AUTH_CONTAINER_KEYS = [
  "auth",
  "record-auth",
  "recordAuth",
  "user",
  "record-user",
  "recordUser",
  "login",
];

const DEFAULT_API_TIMEOUT_MS = 20000;
export const LONG_RUNNING_API_TIMEOUT_MS = 300000;

function getApiBaseUrl() {
  return (
    process.env.REACT_APP_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
  ).replace(/\/+$/, "");
}

function getAvailableStorages() {
  if (typeof window === "undefined") {
    return [];
  }

  return [window.localStorage, window.sessionStorage].filter(Boolean);
}

function safeJsonParse(value) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function findNestedValueByKeys(value, candidateKeys, seen = new Set()) {
  if (value == null || typeof value !== "object") {
    return null;
  }

  if (seen.has(value)) {
    return null;
  }

  seen.add(value);

  for (const key of candidateKeys) {
    const nestedValue = value[key];

    if (typeof nestedValue === "string" && nestedValue.trim()) {
      return nestedValue.trim();
    }
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nestedValue = findNestedValueByKeys(item, candidateKeys, seen);

      if (nestedValue) {
        return nestedValue;
      }
    }

    return null;
  }

  for (const nestedValue of Object.values(value)) {
    const resolvedValue = findNestedValueByKeys(
      nestedValue,
      candidateKeys,
      seen,
    );

    if (resolvedValue) {
      return resolvedValue;
    }
  }

  return null;
}

function readDirectToken(candidateKeys) {
  for (const storage of getAvailableStorages()) {
    for (const key of candidateKeys) {
      const value = storage.getItem(key);

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  return null;
}

function readTokenFromAuthContainers(candidateKeys) {
  for (const storage of getAvailableStorages()) {
    for (const key of AUTH_CONTAINER_KEYS) {
      const parsedValue = safeJsonParse(storage.getItem(key));
      const resolvedValue = findNestedValueByKeys(parsedValue, candidateKeys);

      if (resolvedValue) {
        return resolvedValue;
      }
    }
  }

  return null;
}

function readToken(tokenType) {
  const candidateKeys =
    tokenType === "refresh" ? REFRESH_TOKEN_KEYS : ACCESS_TOKEN_KEYS;

  return readDirectToken(candidateKeys) || readTokenFromAuthContainers(candidateKeys);
}

function persistToken(key, value) {
  if (typeof window === "undefined" || !value) {
    return;
  }

  const keys =
    key === CANONICAL_REFRESH_TOKEN_KEY ? REFRESH_TOKEN_KEYS : ACCESS_TOKEN_KEYS;

  keys.forEach((storageKey) => window.localStorage.setItem(storageKey, value));
}

function flattenErrorMessages(value, parentKey = "") {
  if (typeof value === "string") {
    if (/<\/?[a-z][\s\S]*>/i.test(value)) {
      return [];
    }

    return [parentKey ? `${parentKey}: ${value}` : value];
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return [parentKey ? `${parentKey}: ${String(value)}` : String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenErrorMessages(item, parentKey));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, nestedValue]) => {
      if (key === "status_code") {
        return [];
      }

      if (key === "detail" && typeof nestedValue === "string") {
        return [nestedValue];
      }

      const nextParentKey =
        parentKey !== "" ? parentKey : key === "error" ? "" : key;

      return flattenErrorMessages(nestedValue, nextParentKey);
    });
  }

  return [];
}

export function extractApiErrorMessage(
  error,
  fallbackMessage = "Request failed. Please try again.",
) {
  const responseData = error?.response?.data;
  const messages = flattenErrorMessages(responseData);

  if (messages.length > 0) {
    return messages.join("\n");
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

let refreshRequestPromise = null;

async function refreshAccessToken() {
  if (refreshRequestPromise) {
    return refreshRequestPromise;
  }

  const refreshToken = readToken("refresh");

  if (!refreshToken) {
    throw new Error("Login is required before calling the API.");
  }

  refreshRequestPromise = axios
    .post(
      `${getApiBaseUrl()}/api/auth/token/refresh/`,
      { refresh: refreshToken },
      {
        timeout: DEFAULT_API_TIMEOUT_MS,
      },
    )
    .then((response) => {
      const nextAccessToken = findNestedValueByKeys(
        response.data,
        ACCESS_TOKEN_KEYS,
      );
      const nextRefreshToken = findNestedValueByKeys(
        response.data,
        REFRESH_TOKEN_KEYS,
      );

      if (!nextAccessToken) {
        throw new Error("The refresh response did not include a new access token.");
      }

      persistToken(CANONICAL_ACCESS_TOKEN_KEY, nextAccessToken);

      if (nextRefreshToken) {
        persistToken(CANONICAL_REFRESH_TOKEN_KEY, nextRefreshToken);
      }

      return nextAccessToken;
    })
    .catch((error) => {
      throw new Error(
        extractApiErrorMessage(
          error,
          "Your login session has expired. Please sign in again.",
        ),
      );
    })
    .finally(() => {
      refreshRequestPromise = null;
    });

  return refreshRequestPromise;
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: DEFAULT_API_TIMEOUT_MS,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = readToken("access");

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const statusCode = error?.response?.status;

    if (
      statusCode !== 401 ||
      !originalRequest ||
      originalRequest.__isRetryRequest ||
      String(originalRequest.url).includes("/api/auth/token/refresh/")
    ) {
      throw error;
    }

    const nextAccessToken = await refreshAccessToken();

    originalRequest.__isRetryRequest = true;
    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

    return apiClient(originalRequest);
  },
);
