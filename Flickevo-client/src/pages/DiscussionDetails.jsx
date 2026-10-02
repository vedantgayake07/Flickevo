import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getDiscussion,
  deleteDiscussion,
  getComments,
  createComment,
  deleteComment,
  toggleLikeDiscussion,
} from "../services/discussionApi";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFilm,
  FaTv,
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaRegComment
} from "react-icons/fa";
import "../styles/DiscussionDetails.css";

const DiscussionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingDiscussion, setDeletingDiscussion] = useState(false);
  const [liking, setLiking] = useState(false);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");

  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const [discData, commentsData] = await Promise.all([
          getDiscussion(id),
          getComments(id),
        ]);
        setDiscussion(discData);
        setComments(commentsData || []);
      } catch (err) {
        console.error("Failed to load discussion details", err);
        setError("Failed to load discussion. It may have been removed.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleToggleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (liking) return;

    try {
      setLiking(true);
      const res = await toggleLikeDiscussion(id);
      setDiscussion((prev) => {
        if (!prev) return prev;
        const updatedLikes = res.hasLiked
          ? [...(prev.likes || []), currentUserId]
          : (prev.likes || []).filter((uid) => uid.toString() !== currentUserId.toString());

        return {
          ...prev,
          likes: updatedLikes,
          likesCount: res.likesCount,
        };
      });
    } catch (err) {
      console.error("Failed to like discussion", err);
    } finally {
      setLiking(false);
    }
  };

  const handleDeleteDiscussion = async () => {
    if (!window.confirm("Are you sure you want to delete this discussion?")) {
      return;
    }
    try {
      setDeletingDiscussion(true);
      await deleteDiscussion(id);
      navigate("/discussions");
    } catch (err) {
      console.error("Failed to delete discussion", err);
      alert("Failed to delete discussion.");
    } finally {
      setDeletingDiscussion(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      setCommentError("");
      const created = await createComment(id, newComment.trim());
      // Populate author on local state if not returned populated
      const authorObj = {
        _id: currentUserId,
        username: user?.username || "You",
        profilePicture: user?.profilePicture || "",
      };
      const enrichedComment = {
        ...created,
        author: created.author && typeof created.author === "object" ? created.author : authorObj,
      };
      setComments((prev) => [...prev, enrichedComment]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment", err);
      setCommentError("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
      alert("Failed to delete comment.");
    }
  };

  if (loading) {
    return (
      <div className="discussion-detail-page">
        <div className="discussion-detail-loading">Loading discussion...</div>
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="discussion-detail-page">
        <div className="discussion-detail-error">
          <p>{error || "Discussion not found."}</p>
          <Link to="/discussions" className="discussion-back-link flex items-center gap-1.5 justify-center">
            <FaArrowLeft className="text-xs" /> Back to Discussions
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = currentUserId && (discussion.author?._id === currentUserId || discussion.author === currentUserId);
  const authorName = discussion.author?.username || "Anonymous";
  const authorPic = discussion.author?.profilePicture;
  const dateStr = discussion.createdAt
    ? new Date(discussion.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const hasLiked =
    currentUserId &&
    Array.isArray(discussion.likes) &&
    discussion.likes.some((uid) => uid.toString() === currentUserId.toString());

  const displayMediaTitle = discussion.mediaTitle || `${discussion.mediaType === "tv" ? "TV Show" : "Movie"} #${discussion.mediaId}`;
  const posterSrc = discussion.mediaPoster || "/placeholder-movie.svg";

  return (
    <div className="discussion-detail-page">
      <Link to="/discussions" className="discussion-back-link flex items-center gap-1.5">
        <FaArrowLeft className="text-xs" /> Back to All Discussions
      </Link>

      <article className="discussion-main-card">
        {/* Linked Movie / Show Banner */}
        <div className="discussion-media-banner">
          <img src={posterSrc} alt={displayMediaTitle} className="discussion-media-banner-poster" />
          <div className="discussion-media-banner-info">
            <span className="discussion-media-banner-type flex items-center gap-1">
              {discussion.mediaType === "tv" ? (
                <>
                  <FaTv className="text-xs text-flickCyan" /> TV Show Topic
                </>
              ) : (
                <>
                  <FaFilm className="text-xs text-flickCyan" /> Movie Topic
                </>
              )}
            </span>
            <h3 className="discussion-media-banner-title">{displayMediaTitle}</h3>
          </div>
          <Link
            to={`/content/${discussion.mediaId}/${discussion.mediaType}`}
            className="discussion-media-banner-btn flex items-center gap-1"
          >
            View Details <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <header className="discussion-main-header">
          <div className="discussion-main-meta-top">
            <div className="discussion-main-author">
              {authorPic ? (
                <img
                  src={authorPic}
                  alt={authorName}
                  className="discussion-main-author-pic"
                />
              ) : (
                <div className="discussion-main-author-fallback">
                  {authorName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <span className="discussion-main-author-name">{authorName}</span>
                <span className="discussion-main-date">{dateStr}</span>
              </div>
            </div>

            <div className="discussion-main-header-actions">
              <button
                type="button"
                className={`discussion-like-btn flex items-center gap-1.5 ${
                  hasLiked ? "discussion-like-btn--liked" : ""
                }`}
                onClick={handleToggleLike}
                disabled={liking}
              >
                {hasLiked ? (
                  <FaHeart className="text-red-400 text-xs" />
                ) : (
                  <FaRegHeart className="text-xs" />
                )}{" "}
                {hasLiked ? "Liked" : "Like"} ({discussion.likesCount || 0})
              </button>
            </div>
          </div>

          <h1 className="discussion-main-title">{discussion.title}</h1>
        </header>

        <div className="discussion-main-body">
          <p>{discussion.content}</p>
        </div>

        {isAuthor && (
          <footer className="discussion-main-footer">
            <button
              type="button"
              className="delete-discussion-btn flex items-center gap-1.5"
              onClick={handleDeleteDiscussion}
              disabled={deletingDiscussion}
            >
              <FaTrash className="text-xs" /> {deletingDiscussion ? "Deleting..." : "Delete Discussion"}
            </button>
          </footer>
        )}
      </article>


      {/* Comments Section */}
      <section className="comments-section">
        <h2 className="comments-heading flex items-center gap-2">
          <FaRegComment className="text-sm text-cyan-400" /> Comments ({comments.length})
        </h2>

        {/* New Comment Box */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            {commentError && (
              <div className="comment-form-error">{commentError}</div>
            )}
            <textarea
              className="comment-textarea"
              placeholder="Write a thoughtful comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="3"
              required
              disabled={submittingComment}
            />
            <div className="comment-form-actions">
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={submittingComment || !newComment.trim()}
              >
                {submittingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        ) : (
          <div className="comment-login-prompt">
            <p>
              Want to join the conversation?{" "}
              <Link to="/login" className="comment-login-link">
                Sign in to leave a comment
              </Link>
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments-msg">No comments yet. Share what you think!</p>
          ) : (
            comments.map((c) => {
              const cAuthorId = c.author?._id || c.author;
              const isCommentAuthor = currentUserId && cAuthorId === currentUserId;
              const cName = c.author?.username || "Anonymous";
              const cPic = c.author?.profilePicture;
              const cDate = c.createdAt
                ? new Date(c.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "";

              return (
                <div key={c._id} className="comment-item">
                  <div className="comment-item-avatar">
                    {cPic ? (
                      <img src={cPic} alt={cName} className="comment-avatar-img" />
                    ) : (
                      <div className="comment-avatar-fallback">
                        {cName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="comment-item-content">
                    <div className="comment-item-header">
                      <span className="comment-author-name">{cName}</span>
                      <span className="comment-date">{cDate}</span>
                      {isCommentAuthor && (
                        <button
                          type="button"
                          className="comment-delete-btn flex items-center justify-center"
                          onClick={() => handleDeleteComment(c._id)}
                          title="Delete comment"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </div>
                    <p className="comment-text">{c.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default DiscussionDetails;
