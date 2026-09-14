import axios from "axios";
import { getImageKitAuthApi } from "../services/userApi";

/**
 * Uploads an image file to ImageKit using backend-generated authentication parameters.
 * @param {File} file - The file to upload
 * @returns {Promise<string>} The uploaded image URL
 */
export const uploadToImageKit = async (file) => {
  // 1. Fetch authentication parameters from our secure backend
  const auth = await getImageKitAuthApi();

  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || auth.publicKey;

  if (!publicKey) {
    throw new Error("ImageKit Public Key is missing.");
  }

  // 2. Prepare FormData for ImageKit upload API
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name || `avatar_${Date.now()}.jpg`);
  formData.append("publicKey", publicKey);
  formData.append("signature", auth.signature);
  formData.append("expire", auth.expire);
  formData.append("token", auth.token);

  // 3. Upload directly to ImageKit
  const response = await axios.post(
    "https://upload.imagekit.io/api/v1/files/upload",
    formData
  );

  return response.data.url;
};
