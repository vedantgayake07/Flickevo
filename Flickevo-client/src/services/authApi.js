import { backendApi, setAccessToken, setStoredRefreshToken, getStoredRefreshToken } from "./backendClient";

export const registerUser = async ({ username, password }) => {
  const payload = { username: username?.trim(), password };
  const { data } = await backendApi.post("/auth/register", payload);
  setAccessToken(data.accessToken);
  if (data.refreshToken) {
    setStoredRefreshToken(data.refreshToken);
  }
  const normalizedUser = {
    ...data.user,
    id: data.user.id || data.user._id,
    _id: data.user._id || data.user.id,
  };
  return normalizedUser;
};

export const loginUser = async ({ username, identifier, password }) => {
  const loginId = (username || identifier || "").trim();
  const { data } = await backendApi.post("/auth/login", { username: loginId, password });
  setAccessToken(data.accessToken);
  if (data.refreshToken) {
    setStoredRefreshToken(data.refreshToken);
  }
  const normalizedUser = {
    ...data.user,
    id: data.user.id || data.user._id,
    _id: data.user._id || data.user.id,
  };
  return normalizedUser;
};

export const logoutUser = async () => {
  const refreshToken = getStoredRefreshToken();
  try {
    await backendApi.post("/auth/logout", { refreshToken });
  } catch (err) {
    console.error("Logout request failed", err);
  } finally {
    setAccessToken(null);
    setStoredRefreshToken(null);
    localStorage.removeItem("flickevo_user");
  }
};

export const refreshSession = async () => {
  const storedRefresh = getStoredRefreshToken();
  const { data } = await backendApi.post("/auth/refresh", { refreshToken: storedRefresh });
  setAccessToken(data.accessToken);
  if (data.refreshToken) {
    setStoredRefreshToken(data.refreshToken);
  }
  return data.accessToken;
};