import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfileApi } from "../services/userApi";
import { uploadToImageKit } from "../helpers/imageKitUpload";
import { FaCamera, FaArrowLeft, FaTrash, FaSpinner } from "react-icons/fa";
import "../styles/EditProfile.css";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState(user?.username || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getProfile();
        setUsername(data.username || "");
        setProfilePicture(data.profilePicture || "");
        setPreviewUrl(data.profilePicture || "");
      } catch (err) {
        console.error("Failed to fetch profile details", err);
      }
    }
    loadUser();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB. Please choose a smaller image.");
      return;
    }

    // Show instant local preview while uploading
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setError("");
    setSuccess("");
    setUploadingImage(true);

    try {
      // Upload directly to ImageKit using backend signature
      const uploadedUrl = await uploadToImageKit(file);
      setProfilePicture(uploadedUrl);
      setPreviewUrl(uploadedUrl);
      setSuccess("Avatar uploaded successfully! Click 'Save Changes' to update your profile.");
    } catch (uploadErr) {
      console.error("Avatar upload failed:", uploadErr);
      setError("Failed to upload avatar image. Please try again with a JPG, PNG, or WEBP file.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveAvatar = () => {
    setProfilePicture("");
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
    setSuccess("Avatar removed. Click 'Save Changes' to apply.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      // Save updated profile to backend
      const updatedUser = await updateProfileApi({
        username: username.trim(),
        profilePicture: profilePicture || "",
      });

      if (updateUser) {
        updateUser(updatedUser);
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <Link to="/profile" className="edit-profile-back flex items-center gap-1.5">
            <FaArrowLeft className="text-xs" /> Back to Profile
          </Link>
          <h1 className="edit-profile-title">Edit Profile</h1>
          <p className="edit-profile-subtitle">
            Update your account information and avatar
          </p>
        </div>

        {error && <div className="edit-profile-alert edit-profile-alert--error">{error}</div>}
        {success && <div className="edit-profile-alert edit-profile-alert--success">{success}</div>}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="edit-profile-avatar-section">
            <div
              className="edit-avatar-preview-wrap cursor-pointer relative"
              onClick={() => fileInputRef.current?.click()}
              title="Click to choose a photo"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  className="edit-avatar-preview"
                />
              ) : (
                <div className="edit-avatar-placeholder">
                  {username ? username.slice(0, 2).toUpperCase() : "U"}
                </div>
              )}
              {uploadingImage && (
                <div className="edit-avatar-loading-overlay">
                  <FaSpinner className="edit-avatar-spinner" />
                </div>
              )}
            </div>

            <div className="edit-avatar-controls">
              <div className="edit-avatar-btn-row">
                <label className="edit-file-label flex items-center justify-center gap-2" htmlFor="avatar-file-input">
                  <FaCamera className="text-sm" />
                  {uploadingImage ? "Uploading..." : "Upload New Avatar"}
                </label>
                {(previewUrl || profilePicture) && (
                  <button
                    type="button"
                    className="edit-remove-avatar-btn flex items-center gap-1.5"
                    onClick={handleRemoveAvatar}
                    disabled={saving || uploadingImage}
                  >
                    <FaTrash className="text-xs" /> Remove
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                id="avatar-file-input"
                accept="image/*"
                onChange={handleFileChange}
                className="edit-file-input"
                disabled={saving || uploadingImage}
              />
              <span className="edit-avatar-note">
                Supported formats: JPG, PNG, WEBP (Max 5MB).
              </span>
            </div>
          </div>

          <div className="edit-form-group">
            <label className="edit-label" htmlFor="edit-username">
              Username
            </label>
            <input
              id="edit-username"
              type="text"
              className="edit-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new username"
              required
              disabled={saving}
            />
          </div>

          <div className="edit-form-actions">
            <button
              type="submit"
              className="edit-submit-btn"
              disabled={saving || uploadingImage}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="edit-cancel-btn"
              onClick={() => navigate("/profile")}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
