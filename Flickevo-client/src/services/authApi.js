import { backendApi, setAccessToken } from "./backendClient";

export const registerUser = async ({ email, username, password }) => {
  const { data } = await backendApi.post("/auth/register", { email, username, password });
  setAccessToken(data.accessToken);
  return data.user;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await backendApi.post("/auth/login", { email, password });
  setAccessToken(data.accessToken);
  return data.user;
};

export const logoutUser = async () => {
  await backendApi.post("/auth/logout");
  setAccessToken(null);
};

export const refreshSession = async () => {
  const { data } = await backendApi.post("/auth/refresh");
  setAccessToken(data.accessToken);
  return data.accessToken;
};