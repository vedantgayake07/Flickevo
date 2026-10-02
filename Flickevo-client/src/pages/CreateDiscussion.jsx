/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import { createDiscussion } from "../services/discussionApi";
import { searchMovie } from "../services/apiClient";
import { getMediaType } from "../helpers/mediaType";
import { FaTv, FaFilm, FaStar, FaArrowLeft } from "react-icons/fa";
import "../styles/CreateDiscussion.css";

const CreateDiscussion = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialMediaId = searchParams.get("mediaId") || "";
  const initialMediaType = searchParams.get("mediaType") || "movie";
  const initialMediaTitle = searchParams.get("title") || "";
  const initialMediaPoster = searchParams.get("poster") || "";

  const [mediaId, setMediaId] = useState(initialMediaId);
  const [mediaType, setMediaType] = useState(initialMediaType);
  const [mediaTitle, setMediaTitle] = useState(initialMediaTitle);
  const [mediaPoster, setMediaPoster] = useState(initialMediaPoster);

  // Search state for autocomplete
  const [movieQuery, setMovieQuery] = useState("");
  const [movieSuggestions, setMovieSuggestions] = useState([]);
  const [searchingMovies, setSearchingMovies] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Live search for movies/shows when typing in search box
  useEffect(() => {
    if (!movieQuery.trim() || movieQuery.trim().length < 2) {
      setMovieSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchingMovies(true);
        const res = await searchMovie(movieQuery.trim());
        const results = (res.data?.results || []).filter(
          (item) => item.media_type !== "person"
        );
        setMovieSuggestions(results.slice(0, 6));
      } catch (err) {
        console.error("Failed to search titles", err);
      } finally {
        setSearchingMovies(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [movieQuery]);

  const handleSelectMedia = (item) => {
    const determinedType = getMediaType(item);
    const itemTitle = item.title || item.name || "Untitled";
    const posterPath = item.poster_path
      ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
      : "";

    setMediaId(String(item.id));
    setMediaType(determinedType);
    setMediaTitle(itemTitle);
    setMediaPoster(posterPath);
    setMovieQuery("");
    setMovieSuggestions([]);
    setError("");
  };

  const handleClearSelectedMedia = () => {
    setMediaId("");
    setMediaTitle("");
    setMediaPoster("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Please provide both a discussion title and your thoughts.");
      return;
    }

    if (!mediaId || isNaN(Number(mediaId))) {
      setError("Please select a movie or TV show to discuss.");
      return;
    }

    try {
      setSubmitting(true);
      const newDisc = await createDiscussion({
        mediaId: Number(mediaId),
        mediaType,
        mediaTitle: mediaTitle || "Untitled Title",
        mediaPoster,
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
        <Link to="/discussions" className="create-disc-back flex items-center gap-1.5">
          <FaArrowLeft className="text-xs" /> Back to Discussions
        </Link>

        <h1 className="create-disc-title">Start a Discussion</h1>
        <p className="create-disc-subtitle">
          Share your review, analysis, or theories with other movie and show lovers
        </p>

        {error && <div className="create-disc-error">{error}</div>}

        <form onSubmit={handleSubmit} className="create-disc-form">
          {/* Movie / Show Selection Section */}
          <div className="create-disc-group">
            <label className="create-disc-label">
              Select Movie or TV Show to Discuss
            </label>

            {mediaId ? (
              <div className="create-disc-selected-media">
                <img
                  src={mediaPoster || "/placeholder-movie.svg"}
                  alt={mediaTitle || "Poster"}
                  className="create-disc-selected-poster"
                />
                <div className="create-disc-selected-info">
                  <span className="create-disc-selected-badge flex items-center gap-1">
                    {mediaType === "tv" ? (
                      <>
                        <FaTv className="text-xs text-flickCyan" /> TV Show
                      </>
                    ) : (
                      <>
                        <FaFilm className="text-xs text-flickCyan" /> Movie
                      </>
                    )}
                  </span>
                  <h4 className="create-disc-selected-title">
                    {mediaTitle || `TMDB ID #${mediaId}`}
                  </h4>
                  <span className="create-disc-selected-id">ID: {mediaId}</span>
                </div>
                <button
                  type="button"
                  className="create-disc-change-btn"
                  onClick={handleClearSelectedMedia}
                  disabled={submitting}
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="create-disc-search-box">
                <input
                  type="text"
                  className="create-disc-input"
                  placeholder="Search for a movie or TV show (e.g. Inception, Breaking Bad)..."
                  value={movieQuery}
                  onChange={(e) => setMovieQuery(e.target.value)}
                  disabled={submitting}
                />
                {searchingMovies && (
                  <span className="create-disc-searching-tag">Searching…</span>
                )}

                {movieSuggestions.length > 0 && (
                  <div className="create-disc-suggestions">
                    {movieSuggestions.map((item) => {
                      const itemTitle = item.title || item.name;
                      const itemType = getMediaType(item);
                      const year = (item.release_date || item.first_air_date)?.slice(0, 4);

                      return (
                        <div
                          key={item.id}
                          className="create-disc-suggestion-item"
                          onClick={() => handleSelectMedia(item)}
                        >
                          <img
                            src={
                              item.poster_path
                                ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                                : "/placeholder-movie.svg"
                            }
                            alt={itemTitle}
                            className="create-disc-suggestion-poster"
                          />
                          <div className="create-disc-suggestion-info">
                            <span className="create-disc-suggestion-name">{itemTitle}</span>
                            <div className="create-disc-suggestion-meta">
                              <span className="create-disc-suggestion-type">
                                {itemType === "tv" ? "TV Show" : "Movie"}
                              </span>
                              {year && <span>• {year}</span>}
                              {item.vote_average && (
                                <span className="flex items-center gap-1">
                                  • <FaStar className="text-amber-400 text-xs inline" /> {item.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="create-disc-group">
            <label className="create-disc-label" htmlFor="disc-title-input">
              Discussion Topic / Title
            </label>
            <input
              id="disc-title-input"
              type="text"
              className="create-disc-input"
              placeholder="e.g., What did you think about the final twist?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="create-disc-group">
            <label className="create-disc-label" htmlFor="disc-content-input">
              Your Review / Analysis / Thoughts
            </label>
            <textarea
              id="disc-content-input"
              className="create-disc-textarea"
              placeholder="Share your perspectives, ask questions, or review what you loved..."
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
              disabled={submitting || !mediaId}
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

