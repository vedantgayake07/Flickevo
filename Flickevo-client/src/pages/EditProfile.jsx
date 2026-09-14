import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfileApi } from "../services/userApi";
import { uploadToImageKit } from "../helpers/imageKitUpload";
import "./EditProfile.css";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      setError("");
    }
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
      let finalImageUrl = profilePicture;

      // If a new file was chosen, upload to ImageKit first
      if (selectedFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadToImageKit(selectedFile);
          setProfilePicture(finalImageUrl);
        } catch (uploadErr) {
          console.error("ImageKit upload failed:", uploadErr);
          setError("Failed to upload image to ImageKit. Please check your connection or use an image URL.");
          setSaving(false);
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Save updated profile to backend
      const updatedUser = await updateProfileApi({
        username: username.trim(),
        profilePicture: finalImageUrl,
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
          <Link to="/profile" className="edit-profile-back">
            ← Back to Profile
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
            <div className="edit-avatar-preview-wrap">
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
            </div>

            <div className="edit-avatar-controls">
              <label className="edit-file-label" htmlFor="avatar-file-input">
                {uploadingImage ? "Uploading..." : "📷 Choose Avatar File"}
              </label>
              <input
                type="file"
                id="avatar-file-input"
                accept="image/*"
                onChange={handleFileChange}
                className="edit-file-input"
                disabled={saving || uploadingImage}
              />
              <span className="edit-avatar-note">
                Uploads securely to ImageKit. Supported: JPG, PNG, WEBP.
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

          <div className="edit-form-group">
            <label className="edit-label" htmlFor="edit-avatar-url">
              Avatar Image URL (Optional Direct URL)
            </label>
            <input
              id="edit-avatar-url"
              type="url"
              className="edit-input"
              value={profilePicture}
              onChange={(e) => {
                setProfilePicture(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              placeholder="https://ik.imagekit.io/... or any image URL"
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
