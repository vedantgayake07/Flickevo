import axios from "axios";
import { getImageKitAuthApi } from "../services/userApi";

export const uploadToImageKit = async (file) => {
  const auth = await getImageKitAuthApi();

  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || auth.publicKey;

  if (!publicKey) {
    throw new Error("ImageKit Public Key is missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name || `avatar_${Date.now()}.jpg`);
  formData.append("publicKey", publicKey);
  formData.append("signature", auth.signature);
  formData.append("expire", auth.expire);
  formData.append("token", auth.token);
  formData.append("folder", "/avatars");

  const response = await axios.post(
    "https://upload.imagekit.io/api/v1/files/upload",
    formData
  );

  return response.data.url;
};
