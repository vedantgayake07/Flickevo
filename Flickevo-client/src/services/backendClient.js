import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL ;

export const backendApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends the httpOnly refreshToken cookie
});

// Access token lives in memory only (not localStorage) — refreshed via the cookie.
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

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
          refreshPromise = backendApi
            .post("/auth/refresh")
            .then((res) => {
              setAccessToken(res.data.accessToken);
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
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);