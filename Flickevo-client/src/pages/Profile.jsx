/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { getProfile } from "../services/userApi";
import { getDiscussions } from "../services/discussionApi";
import { FaEdit, FaPlus, FaSignOutAlt, FaTv, FaFilm, FaRegComment, FaHeart, FaArrowRight } from "react-icons/fa";
import "../styles/Profile.css";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { items } = useWatchlist();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [myDiscussions, setMyDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchUserData() {
      try {
        setLoading(true);
        const data = await getProfile();
        if (isMounted) {
          setProfile(data);
          if (updateUser) updateUser(data);
          const discList = await getDiscussions({ author: data._id || user?._id });
          setMyDiscussions(discList || []);
        }
      } catch (err) {
        console.error("Failed to load user profile or discussions", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchUserData();
    return () => { isMounted = false; };
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

  if (loading && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-loading-state">Loading user profile…</div>
      </div>
    );
  }

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
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat-box" onClick={() => navigate("/watchlist")}>
            <span className="profile-stat-num">{items?.length || 0}</span>
            <span className="profile-stat-label">Saved in Watchlist</span>
            <span className="profile-stat-link flex items-center justify-center gap-1">View Watchlist <FaArrowRight className="text-xs" /></span>
          </div>

          <div className="profile-stat-box" onClick={() => navigate("/discussions")}>
            <span className="profile-stat-num">{myDiscussions.length}</span>
            <span className="profile-stat-label">Discussions Started</span>
            <span className="profile-stat-link flex items-center justify-center gap-1">Community Feed <FaArrowRight className="text-xs" /></span>
          </div>

          <div className="profile-stat-box">
            <span className="profile-stat-num">Active</span>
            <span className="profile-stat-label">Account Status</span>
            <span className="profile-stat-meta">Joined {createdAt}</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/profile/edit" className="profile-btn profile-btn--primary flex items-center justify-center gap-1.5">
            <FaEdit className="text-xs" /> Edit Profile
          </Link>
          <Link to="/discussions/create" className="profile-btn profile-btn--secondary flex items-center justify-center gap-1.5">
            <FaPlus className="text-xs" /> Start Discussion
          </Link>
          <button
            type="button"
            className="profile-btn profile-btn--danger flex items-center justify-center gap-1.5"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-xs" /> Sign Out
          </button>
        </div>

        {/* User's Created Discussions */}
        <div className="profile-discussions-section">
          <h2 className="profile-section-heading">My Discussions</h2>

          {myDiscussions.length === 0 ? (
            <div className="profile-discussions-empty">
              <p>You haven't started any discussions yet.</p>
              <Link to="/discussions/create" className="profile-btn profile-btn--secondary inline-flex items-center gap-1.5">
                <FaPlus className="text-xs" /> Share your first movie theory or review
              </Link>
            </div>
          ) : (
            <div className="profile-discussions-list">
              {myDiscussions.map((d) => (
                <Link key={d._id} to={`/discussions/${d._id}`} className="profile-disc-item">
                  <div className="profile-disc-item-info">
                    <span className="profile-disc-badge flex items-center gap-1">
                      {d.mediaType === "tv" ? (
                        <>
                          <FaTv className="text-xs text-flickCyan" /> TV Show
                        </>
                      ) : (
                        <>
                          <FaFilm className="text-xs text-flickCyan" /> Movie
                        </>
                      )}{" "}
                      • {d.mediaTitle || `Title #${d.mediaId}`}
                    </span>
                    <h4 className="profile-disc-title">{d.title}</h4>
                    <span className="profile-disc-date flex items-center flex-wrap gap-2 text-xs">
                      <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaRegComment className="text-xs" /> {d.commentsCount || 0}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaHeart className="text-red-400 text-xs" /> {d.likesCount || 0}
                      </span>
                    </span>
                  </div>
                  <FaArrowRight className="profile-disc-arrow text-xs" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

