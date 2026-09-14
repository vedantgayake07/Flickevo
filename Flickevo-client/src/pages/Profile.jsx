import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { getProfile } from "../services/userApi";
import "./Profile.css";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { items } = useWatchlist();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
        updateUser(data);
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const username = profile?.username || user?.username || "User";
  const email = profile?.email || user?.email || "";
  const profilePicture = profile?.profilePicture || user?.profilePicture;
  const createdAt = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={username}
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-fallback">
                {username.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-header-info">
            <span className="profile-badge">Community Member</span>
            <h1 className="profile-username">{username}</h1>
            <p className="profile-email">{email}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat-box" onClick={() => navigate("/watchlist")}>
            <span className="profile-stat-num">{items?.length || 0}</span>
            <span className="profile-stat-label">Saved in Watchlist</span>
            <span className="profile-stat-link">View Watchlist →</span>
          </div>

          <div className="profile-stat-box">
            <span className="profile-stat-num">Active</span>
            <span className="profile-stat-label">Account Status</span>
            <span className="profile-stat-meta">Joined {createdAt}</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/profile/edit" className="profile-btn profile-btn--primary">
            ✏️ Edit Profile
          </Link>
          <button
            type="button"
            className="profile-btn profile-btn--danger"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
