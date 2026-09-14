import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getDiscussion,
  deleteDiscussion,
  getComments,
  createComment,
  deleteComment,
} from "../services/discussionApi";
import "./DiscussionDetails.css";

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
          <Link to="/discussions" className="discussion-back-link">
            ← Back to Discussions
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

  return (
    <div className="discussion-detail-page">
      <Link to="/discussions" className="discussion-back-link">
        ← Back to All Discussions
      </Link>

      <article className="discussion-main-card">
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

            <Link
              to={`/content/${discussion.mediaId}/${discussion.mediaType}`}
              className="discussion-media-pill"
            >
              🎬 View {discussion.mediaType === "tv" ? "TV Show" : "Movie"} Details
            </Link>
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
              className="delete-discussion-btn"
              onClick={handleDeleteDiscussion}
              disabled={deletingDiscussion}
            >
              {deletingDiscussion ? "Deleting..." : "🗑️ Delete Discussion"}
            </button>
          </footer>
        )}
      </article>

      {/* Comments Section */}
      <section className="comments-section">
        <h2 className="comments-heading">
          Comments ({comments.length})
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
                          className="comment-delete-btn"
                          onClick={() => handleDeleteComment(c._id)}
                          title="Delete comment"
                        >
                          ✕
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
