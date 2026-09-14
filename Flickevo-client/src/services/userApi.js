import { backendApi } from "./backendClient";

export const getProfile = async () => {
  const { data } = await backendApi.get("/users/me");
  return data.user;
};

export const updateProfileApi = async (profileData) => {
  const { data } = await backendApi.put("/users/me", profileData);
  return data.user;
};

export const getImageKitAuthApi = async () => {
  const { data } = await backendApi.get("/users/imagekit-auth");
  return data;
};