import { backendApi } from "./backendClient";

export const getProfile = async () => {
  const { data } = await backendApi.get("/users/me");
  return data.user;
};