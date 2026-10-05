import axios from "axios";

const rawUrl = import.meta.env.VITE_BACKEND_URL || "https://flickevo.onrender.com/api";
const cleanUrl = rawUrl.replace(/\/+$/, "");
const BASE_URL = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;

export const backendApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends the httpOnly refreshToken cookie when supported
});

const ACCESS_TOKEN_KEY = "flickevo_access_token";
const REFRESH_TOKEN_KEY = "flickevo_refresh_token";

let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const getAccessToken = () => accessToken;

export const setStoredRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

backendApi.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise = null;

backendApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute = originalRequest?.url?.includes("/auth/");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          const storedRefresh = getStoredRefreshToken();
          refreshPromise = backendApi
            .post("/auth/refresh", { refreshToken: storedRefresh })
            .then((res) => {
              setAccessToken(res.data.accessToken);
              if (res.data.refreshToken) {
                setStoredRefreshToken(res.data.refreshToken);
              }
              return res.data.accessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return backendApi(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        setStoredRefreshToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);