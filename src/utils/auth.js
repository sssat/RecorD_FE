import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://port-0-recor-d-be-moibwvfm46c84723.sel3.cloudtype.app';
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');
const PROFILE_STORAGE_KEY = 'userProfile';
const PROFILE_NAME_OVERRIDES_STORAGE_KEY = 'profileNameOverrides';
const ACCESS_TOKEN_STORAGE_KEYS = [
  'token',
  'record-access-token',
  'recordAccessToken',
  'accessToken',
  'access_token',
  'access',
];
const REFRESH_TOKEN_STORAGE_KEYS = [
  'refreshToken',
  'record-refresh-token',
  'recordRefreshToken',
  'refresh_token',
  'refresh',
];

export const getApiBaseUrl = () => API_BASE_URL;

const getStoredValue = (keys) =>
  keys
    .map((key) => localStorage.getItem(key))
    .find((value) => typeof value === 'string' && value.trim().length > 0)
    ?.trim() || '';

const setStoredValue = (keys, value) => {
  if (!value) {
    return;
  }

  keys.forEach((key) => localStorage.setItem(key, value));
};

const removeStoredValues = (keys) => {
  keys.forEach((key) => localStorage.removeItem(key));
};

export const getAccessToken = () => getStoredValue(ACCESS_TOKEN_STORAGE_KEYS);

export const getRefreshToken = () => getStoredValue(REFRESH_TOKEN_STORAGE_KEYS);

export const isAuthenticated = () => Boolean(getAccessToken());

const pickFirstString = (...values) =>
  values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim() || '';

const pickAuthPayload = (data = {}) =>
  data.tokens || data.token || data.auth || data.data || data.result || data;

export const normalizeProfile = (data = {}) => {
  const authPayload = pickAuthPayload(data);
  const source =
    authPayload.user ||
    authPayload.profile ||
    authPayload.member ||
    data.user ||
    data.profile ||
    data.member ||
    authPayload ||
    data;
  const kakaoAccount = source.kakao_account || data.kakao_account || {};
  const properties = source.properties || data.properties || {};

  return {
    name: pickFirstString(
      source.name,
      source.nickname,
      source.username,
      source.displayName,
      properties.nickname,
      kakaoAccount.profile?.nickname
    ),
    email: pickFirstString(source.email, kakaoAccount.email),
  };
};

export const getStoredProfile = () => {
  try {
    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    return storedProfile ? applyStoredNameOverride(normalizeProfile(JSON.parse(storedProfile))) : { name: '', email: '' };
  } catch (error) {
    console.error('저장된 프로필 정보를 읽지 못했습니다.', error);
    return { name: '', email: '' };
  }
};

export const storeProfile = (profile) => {
  const normalizedProfile = applyStoredNameOverride(normalizeProfile(profile));
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfile));
  return normalizedProfile;
};

const getProfileNameOverrides = () => {
  try {
    const storedOverrides = localStorage.getItem(PROFILE_NAME_OVERRIDES_STORAGE_KEY);
    return storedOverrides ? JSON.parse(storedOverrides) : {};
  } catch (error) {
    console.error('저장된 닉네임 정보를 읽지 못했습니다.', error);
    return {};
  }
};

const applyStoredNameOverride = (profile) => {
  if (!profile.email) {
    return profile;
  }

  const nameOverrides = getProfileNameOverrides();
  const storedName = nameOverrides[profile.email];

  return storedName ? { ...profile, name: storedName } : profile;
};

const storeProfileNameOverride = ({ email, name }) => {
  if (!email || !name?.trim()) {
    return;
  }

  const nameOverrides = getProfileNameOverrides();
  localStorage.setItem(
    PROFILE_NAME_OVERRIDES_STORAGE_KEY,
    JSON.stringify({ ...nameOverrides, [email]: name.trim() })
  );
};

export const clearProfileNameOverride = (email) => {
  if (!email) {
    localStorage.removeItem(PROFILE_NAME_OVERRIDES_STORAGE_KEY);
    return;
  }

  const nameOverrides = getProfileNameOverrides();
  delete nameOverrides[email];

  if (Object.keys(nameOverrides).length === 0) {
    localStorage.removeItem(PROFILE_NAME_OVERRIDES_STORAGE_KEY);
    return;
  }

  localStorage.setItem(PROFILE_NAME_OVERRIDES_STORAGE_KEY, JSON.stringify(nameOverrides));
};

export const clearAuthStorage = () => {
  removeStoredValues(ACCESS_TOKEN_STORAGE_KEYS);
  removeStoredValues(REFRESH_TOKEN_STORAGE_KEYS);
  localStorage.removeItem(PROFILE_STORAGE_KEY);
};

export const fetchCurrentUserProfile = async () => {
  const token = getAccessToken();

  if (!token) {
    return { name: '', email: '' };
  }

  const response = await axios.get(`${API_BASE_URL}/api/auth/profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const profile = normalizeProfile(response.data);
  return profile.name || profile.email ? storeProfile(profile) : getStoredProfile();
};

export const requestKakaoLogin = async ({ code, redirectUri }) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/kakao/`, {
    code,
    redirect_uri: redirectUri,
  });

  return response.data;
};

export const updateCurrentUserProfile = async (profile) => {
  const token = getAccessToken();
  const response = await axios.patch(
    `${API_BASE_URL}/api/auth/profile/`,
    { name: profile.name },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const responseProfile = normalizeProfile(response.data);
  const updatedProfile = {
    name: profile.name,
    email: responseProfile.email || profile.email,
  };

  storeProfileNameOverride(updatedProfile);

  return storeProfile(updatedProfile);
};

export const logoutFromServer = async () => {
  const token = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return;
  }

  await axios.post(
    `${API_BASE_URL}/api/auth/logout/`,
    { refresh: refreshToken },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const withdrawFromServer = async () => {
  const token = getAccessToken();

  await axios.delete(`${API_BASE_URL}/api/auth/withdraw/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const storeAuthResponse = (data = {}) => {
  const authPayload = pickAuthPayload(data);
  const accessToken =
    authPayload.access ||
    authPayload.accessToken ||
    authPayload.access_token ||
    data.access ||
    data.accessToken ||
    data.access_token;
  const refreshToken =
    authPayload.refresh ||
    authPayload.refreshToken ||
    authPayload.refresh_token ||
    data.refresh ||
    data.refreshToken ||
    data.refresh_token;

  if (accessToken) {
    setStoredValue(ACCESS_TOKEN_STORAGE_KEYS, accessToken);
  }

  if (refreshToken) {
    setStoredValue(REFRESH_TOKEN_STORAGE_KEYS, refreshToken);
  }

  const profile = normalizeProfile(data);

  if (profile.name || profile.email) {
    storeProfile(profile);
  }

  return { accessToken, refreshToken, profile };
};
