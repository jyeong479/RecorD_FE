import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://port-0-recor-d-be-moibwvfm46c84723.sel3.cloudtype.app';
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');
const PROFILE_STORAGE_KEY = 'userProfile';

export const getApiBaseUrl = () => API_BASE_URL;

export const getAccessToken = () => localStorage.getItem('token');

export const getRefreshToken = () => localStorage.getItem('refreshToken');

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
    return storedProfile ? normalizeProfile(JSON.parse(storedProfile)) : { name: '', email: '' };
  } catch (error) {
    console.error('저장된 프로필 정보를 읽지 못했습니다.', error);
    return { name: '', email: '' };
  }
};

export const storeProfile = (profile) => {
  const normalizedProfile = normalizeProfile(profile);
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfile));
  return normalizedProfile;
};

export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
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

  return storeProfile({
    name: responseProfile.name || profile.name,
    email: responseProfile.email || profile.email,
  });
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
    localStorage.setItem('token', accessToken);
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  const profile = normalizeProfile(data);

  if (profile.name || profile.email) {
    storeProfile(profile);
  }

  return { accessToken, refreshToken, profile };
};
