import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDiscussions } from "../services/discussionApi";
import "./Discussions.css";

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="discussions-page">
      <div className="discussions-header">
        <div>
          <h1 className="discussions-title">Community Discussions</h1>
          <p className="discussions-subtitle">
            Share your thoughts, theories, and reviews on movies and TV shows
          </p>
        </div>
        <Link to="/discussions/create" className="start-discussion-btn">
          + Start Discussion
        </Link>
      </div>

      {loading && (
        <div className="discussions-loading">Loading discussions...</div>
      )}

      {error && !loading && (
        <div className="discussions-error">{error}</div>
      )}

      {!loading && !error && discussions.length === 0 && (
        <div className="discussions-empty">
          <div className="discussions-empty-icon">💬</div>
          <h3>No Discussions Yet</h3>
          <p>Be the first in the Flickevo community to start a movie or show discussion!</p>
          <Link to="/discussions/create" className="start-discussion-btn">
            Create First Discussion
          </Link>
        </div>
      )}

      {!loading && !error && discussions.length > 0 && (
        <div className="discussions-list">
          {discussions.map((item) => {
            const authorName = item.author?.username || "Anonymous";
            const authorPic = item.author?.profilePicture;
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "";

            return (
              <div key={item._id} className="discussion-card">
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
                    🎬 {item.mediaType === "tv" ? "TV Show" : "Movie"} #{item.mediaId}
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
                  <Link
                    to={`/discussions/${item._id}`}
                    className="discussion-read-more"
                  >
                    Read Discussion & Comments →
                  </Link>
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
