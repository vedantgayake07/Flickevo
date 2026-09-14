import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { createDiscussion } from "../services/discussionApi";
import "./CreateDiscussion.css";

const CreateDiscussion = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialMediaId = searchParams.get("mediaId") || "";
  const initialMediaType = searchParams.get("mediaType") || "movie";
  const initialMediaTitle = searchParams.get("title") || "";

  const [mediaId, setMediaId] = useState(initialMediaId);
  const [mediaType, setMediaType] = useState(initialMediaType);
  const [mediaTitle, setMediaTitle] = useState(initialMediaTitle);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Please provide both a discussion title and your thoughts.");
      return;
    }

    if (!mediaId || isNaN(Number(mediaId))) {
      setError("Please specify a valid numeric TMDB Media ID.");
      return;
    }

    try {
      setSubmitting(true);
      const newDisc = await createDiscussion({
        mediaId: Number(mediaId),
        mediaType,
        title: title.trim(),
        content: content.trim(),
      });

      navigate(`/discussions/${newDisc._id}`);
    } catch (err) {
      console.error("Failed to create discussion", err);
      setError(err.response?.data?.message || "Failed to create discussion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-discussion-page">
      <div className="create-discussion-card">
        <Link to="/discussions" className="create-disc-back">
          ← Back to Discussions
        </Link>

        <h1 className="create-disc-title">Start a Discussion</h1>
        <p className="create-disc-subtitle">
          Share your review, analysis, or theories with other movie and show lovers
        </p>

        {error && <div className="create-disc-error">{error}</div>}

        <form onSubmit={handleSubmit} className="create-disc-form">
          <div className="create-disc-row">
            <div className="create-disc-group">
              <label className="create-disc-label" htmlFor="media-type-select">
                Content Type
              </label>
              <select
                id="media-type-select"
                className="create-disc-select"
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                disabled={submitting}
              >
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </select>
            </div>

            <div className="create-disc-group flex-1">
              <label className="create-disc-label" htmlFor="media-id-input">
                TMDB Content ID {mediaTitle && `(${mediaTitle})`}
              </label>
              <input
                id="media-id-input"
                type="number"
                className="create-disc-input"
                placeholder="e.g. 550 for Fight Club"
                value={mediaId}
                onChange={(e) => setMediaId(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div className="create-disc-group">
            <label className="create-disc-label" htmlFor="disc-title-input">
              Discussion Title
            </label>
            <input
              id="disc-title-input"
              type="text"
              className="create-disc-input"
              placeholder="e.g., What did you think about the ending?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="create-disc-group">
            <label className="create-disc-label" htmlFor="disc-content-input">
              Discussion Thoughts / Analysis
            </label>
            <textarea
              id="disc-content-input"
              className="create-disc-textarea"
              placeholder="Write your review, questions, or perspectives here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              required
              disabled={submitting}
            />
          </div>

          <div className="create-disc-actions">
            <button
              type="submit"
              className="create-disc-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Publishing..." : "Publish Discussion"}
            </button>
            <button
              type="button"
              className="create-disc-cancel-btn"
              onClick={() => navigate("/discussions")}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscussion;
