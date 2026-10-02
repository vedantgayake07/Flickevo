import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDiscussions, toggleLikeDiscussion } from "../services/discussionApi";
import { useAuth } from "../context/AuthContext";
import "../styles/Discussions.css";

const Discussions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'movie' | 'tv'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'comments' | 'likes'
  const [likingMap, setLikingMap] = useState({});

  useEffect(() => {
    async function loadDiscussions() {
      try {
        setLoading(true);
        const data = await getDiscussions();
        setDiscussions(data || []);
      } catch (err) {
        console.error("Failed to load discussions", err);
        setError("Unable to load discussions at this time.");
      } finally {
        setLoading(false);
      }
    }
    loadDiscussions();
  }, []);

  const handleToggleLike = async (e, discussionId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    if (likingMap[discussionId]) return;

    try {
      setLikingMap((prev) => ({ ...prev, [discussionId]: true }));
      const res = await toggleLikeDiscussion(discussionId);

      setDiscussions((prev) =>
        prev.map((item) => {
          if (item._id === discussionId) {
            const currentUserId = user._id || user.id;
            const updatedLikes = res.hasLiked
              ? [...(item.likes || []), currentUserId]
              : (item.likes || []).filter((id) => id.toString() !== currentUserId.toString());

            return {
              ...item,
              likes: updatedLikes,
              likesCount: res.likesCount,
            };
          }
          return item;
        })
      );
    } catch (err) {
      console.error("Failed to like discussion", err);
    } finally {
      setLikingMap((prev) => ({ ...prev, [discussionId]: false }));
    }
  };

  const filteredDiscussions = useMemo(() => {
    let list = [...discussions];

    // Filter by media type
    if (activeTab !== "all") {
      list = list.filter((item) => item.mediaType === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.content?.toLowerCase().includes(q) ||
          item.mediaTitle?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "comments") {
      list.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
    } else if (sortBy === "likes") {
      list.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [discussions, activeTab, searchQuery, sortBy]);

  const currentUserId = user?._id || user?.id;

  return (
    <div className="discussions-page">
      <div className="discussions-header">
        <div>
          <h1 className="discussions-title">Community Discussions</h1>
          <p className="discussions-subtitle">
            Share reviews, theories, and perspectives on your favorite cinema and series
          </p>
        </div>
        <Link to="/discussions/create" className="start-discussion-btn">
          + Start Discussion
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="discussions-toolbar">
        <div className="discussions-tabs">
          <button
            type="button"
            className={`disc-tab ${activeTab === "all" ? "disc-tab--active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Discussions
          </button>
          <button
            type="button"
            className={`disc-tab ${activeTab === "movie" ? "disc-tab--active" : ""}`}
            onClick={() => setActiveTab("movie")}
          >
            🎬 Movies
          </button>
          <button
            type="button"
            className={`disc-tab ${activeTab === "tv" ? "disc-tab--active" : ""}`}
            onClick={() => setActiveTab("tv")}
          >
            📺 TV Shows
          </button>
        </div>

        <div className="discussions-tools-right">
          <div className="discussions-search-wrap">
            <input
              type="text"
              placeholder="Search discussions or titles..."
              className="discussions-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="discussions-search-clear"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>

          <select
            className="discussions-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Latest First</option>
            <option value="comments">Most Commented</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="discussions-loading">Loading community discussions...</div>
      )}

      {error && !loading && (
        <div className="discussions-error">{error}</div>
      )}

      {!loading && !error && filteredDiscussions.length === 0 && (
        <div className="discussions-empty">
          <div className="discussions-empty-icon">💬</div>
          <h3>
            {searchQuery || activeTab !== "all"
              ? "No Discussions Found"
              : "No Discussions Yet"}
          </h3>
          <p>
            {searchQuery || activeTab !== "all"
              ? "Try clearing your search or filters to see more discussions."
              : "Be the first in the Flickevo community to start a discussion!"}
          </p>
          <Link to="/discussions/create" className="start-discussion-btn">
            Create Discussion
          </Link>
        </div>
      )}

      {!loading && !error && filteredDiscussions.length > 0 && (
        <div className="discussions-list">
          {filteredDiscussions.map((item) => {
            const authorName = item.author?.username || "Anonymous";
            const authorPic = item.author?.profilePicture;
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "";

            const hasLiked =
              currentUserId &&
              Array.isArray(item.likes) &&
              item.likes.some((id) => id.toString() === currentUserId.toString());

            const displayTitle = item.mediaTitle || `${item.mediaType === "tv" ? "TV Show" : "Movie"} #${item.mediaId}`;
            const posterSrc = item.mediaPoster || "/placeholder-movie.svg";

            return (
              <div key={item._id} className="discussion-card">
                <div className="discussion-card-media-side">
                  <Link to={`/content/${item.mediaId}/${item.mediaType}`}>
                    <img
                      src={posterSrc}
                      alt={displayTitle}
                      className="discussion-card-poster"
                    />
                  </Link>
                </div>

                <div className="discussion-card-main">
                  <div className="discussion-card-top">
                    <div className="discussion-author">
                      {authorPic ? (
                        <img
                          src={authorPic}
                          alt={authorName}
                          className="discussion-author-pic"
                        />
                      ) : (
                        <div className="discussion-author-fallback">
                          {authorName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="discussion-author-meta">
                        <span className="discussion-author-name">{authorName}</span>
                        <span className="discussion-date">{dateStr}</span>
                      </div>
                    </div>

                    <Link
                      to={`/content/${item.mediaId}/${item.mediaType}`}
                      className="discussion-media-tag"
                    >
                      {item.mediaType === "tv" ? "📺 TV Show" : "🎬 Movie"} • {displayTitle}
                    </Link>
                  </div>

                  <Link to={`/discussions/${item._id}`} className="discussion-title-link">
                    <h2 className="discussion-item-title">{item.title}</h2>
                  </Link>

                  <p className="discussion-snippet">
                    {item.content?.length > 180
                      ? item.content.slice(0, 180) + "..."
                      : item.content}
                  </p>

                  <div className="discussion-card-footer">
                    <div className="discussion-stats">
                      <button
                        type="button"
                        className={`discussion-stat-btn ${hasLiked ? "discussion-stat-btn--liked" : ""}`}
                        onClick={(e) => handleToggleLike(e, item._id)}
                        disabled={likingMap[item._id]}
                        title="Like this discussion"
                      >
                        {hasLiked ? "❤️" : "🤍"} {item.likesCount || 0}
                      </button>

                      <Link
                        to={`/discussions/${item._id}`}
                        className="discussion-stat-pill"
                        title="Comments"
                      >
                        💬 {item.commentsCount || 0} Comments
                      </Link>
                    </div>

                    <Link
                      to={`/discussions/${item._id}`}
                      className="discussion-read-more"
                    >
                      Join Discussion →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Discussions;

