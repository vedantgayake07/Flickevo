import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getContentById } from "../services/apiClient";
import { getDiscussions } from "../services/discussionApi";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import "../styles/ContentPage.css";

const ContentPage = () => {
  const [movie, setMovie] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [wlBusy, setWlBusy] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [discLoading, setDiscLoading] = useState(false);
  const { id, type } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    async function getMovieOrShow() {
      const movieData = await getContentById(id, type);
      setMovie(movieData);
    }
    if (id && type) getMovieOrShow();
  }, [id, type]);

  useEffect(() => {
    async function fetchDiscussions() {
      if (!id || !type) return;
      try {
        setDiscLoading(true);
        const data = await getDiscussions({ mediaId: id, mediaType: type });
        setDiscussions(data || []);
      } catch (err) {
        console.error("Failed to load discussions for title", err);
      } finally {
        setDiscLoading(false);
      }
    }
    fetchDiscussions();
  }, [id, type]);

  if (!movie) {
    return (
      <div className="flick-detail-loading">
        <div className="flick-loading-spinner" />
        <span>Loading cinematic details…</span>
      </div>
    );
  }

  const isShow = type === 'tv' || !!movie.first_air_date || !!movie.name;
  const cast = movie.credits?.cast || [];
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const runtime = movie.runtime || movie.episode_run_time?.[0];
  const watchProviders = movie["watch/providers"]?.results?.IN?.flatrate;
  const mediaType = isShow ? "tv" : "movie";
  const saved = isInWatchlist(movie.id, mediaType);

  const trailer =
    movie.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube" && v.official
    ) ||
    movie.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );

  const handleWatchlistClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setWlBusy(true);
    try {
      await toggleWatchlist(movie.id, mediaType);
    } finally {
      setWlBusy(false);
    }
  };

  return (
    <div className="flick-detail-page">
      {/* ====================================================================
          Hero Backdrop Section
          ==================================================================== */}
      <div className="flick-detail-hero">
        {movie.backdrop_path ? (
          <img
            className="flick-detail-hero__bg"
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={title}
          />
        ) : (
          <div className="flick-detail-hero__fallback" />
        )}
        <div className="flick-detail-hero__gradient" />

        <div className="flick-detail-hero__content">
          {/* Floating Poster */}
          <div className="flick-detail-poster-wrap">
            <img
              className="flick-detail-poster"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/placeholder-movie.svg"
              }
              alt={title}
            />
          </div>

          {/* Title & Key Metadata */}
          <div className="flick-detail-main-info">
            <div className="flick-detail-badges">
              {movie.status && (
                <span className="flick-badge-status">{movie.status}</span>
              )}
              <span className="flick-badge-format">
                {isShow ? "📺 TV Series" : "🎬 Feature Film"}
              </span>
              {movie.original_language && (
                <span className="flick-badge-lang">
                  {movie.original_language.toUpperCase()}
                </span>
              )}
            </div>

            <h1 className="flick-detail-title">{title}</h1>
            {movie.tagline && (
              <p className="flick-detail-tagline">"{movie.tagline}"</p>
            )}

            {/* Score & Timing Chips */}
            <div className="flick-detail-meta-row">
              {movie.vote_average != null && (
                <div
                  className="flick-score-badge"
                  title={`${movie.vote_count || 0} community votes`}
                >
                  <span className="flick-score-star">★</span>
                  <span className="flick-score-val">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="flick-score-denom">/10</span>
                </div>
              )}

              {releaseDate && (
                <span className="flick-meta-item">
                  📅 {releaseDate.slice(0, 4)}
                </span>
              )}

              {runtime > 0 && (
                <span className="flick-meta-item">
                  ⏱️ {runtime} min{isShow ? "/ep" : ""}
                </span>
              )}

              {isShow && movie.number_of_seasons && (
                <span className="flick-meta-item">
                  📺 {movie.number_of_seasons} Season
                  {movie.number_of_seasons > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Genre Pills */}
            <div className="flick-detail-genres">
              {movie.genres?.map((g) => (
                <Link
                  key={g.id}
                  to={`/genre/${type}/${g.id}?name=${encodeURIComponent(g.name)}`}
                  className="flick-genre-chip"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            {/* Primary Action Buttons & Streaming Logos */}
            <div className="flick-detail-actions">
              {trailer && (
                <button
                  type="button"
                  className="flick-action-btn flick-btn-trailer"
                  onClick={() => setTrailerOpen(true)}
                >
                  <span className="flick-btn-icon">▶</span> Watch Trailer
                </button>
              )}

              <button
                type="button"
                className={`flick-action-btn flick-btn-watchlist ${
                  saved ? "flick-btn-watchlist--saved" : ""
                }`}
                onClick={handleWatchlistClick}
                disabled={wlBusy}
              >
                {saved ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>

              <Link
                to={`/discussions/create?mediaId=${movie.id}&mediaType=${mediaType}&title=${encodeURIComponent(
                  title || ""
                )}&poster=${encodeURIComponent(
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                    : ""
                )}`}
                className="flick-action-btn flick-btn-discuss"
              >
                💬 Discuss ({discussions.length})
              </Link>

              {watchProviders?.length > 0 && (
                <div className="flick-providers-box">
                  <span className="flick-providers-label">Stream on</span>
                  <div className="flick-providers-list">
                    {watchProviders.slice(0, 4).map((p) => (
                      <img
                        key={p.provider_id}
                        className="flick-provider-logo"
                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                        alt={p.provider_name}
                        title={p.provider_name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          Main Body: 2-Column Cinematic Layout (Story + Cast + Discussions | Facts)
          ==================================================================== */}
      <div className="flick-detail-body">
        {/* Main Column */}
        <div className="flick-detail-primary-col">
          {/* Storyline Overview */}
          {movie.overview && (
            <section className="flick-section">
              <h2 className="flick-section-title">Storyline</h2>
              <p className="flick-overview-card">{movie.overview}</p>
            </section>
          )}

          {/* Top Billed Cast */}
          {cast.length > 0 && (
            <section className="flick-section">
              <div className="flick-section-header-row">
                <h2 className="flick-section-title">Top Billed Cast</h2>
                <span className="flick-cast-total">{cast.length} Cast Members</span>
              </div>

              <div className="flick-cast-grid">
                {cast.slice(0, 10).map((actor) => (
                  <Link
                    to={`/person/${actor.id}`}
                    key={actor.credit_id || actor.id}
                    className="flick-cast-card"
                  >
                    <div className="flick-cast-photo-wrap">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          className="flick-cast-photo"
                        />
                      ) : (
                        <div className="flick-cast-fallback">
                          {actor.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                      )}
                    </div>
                    <div className="flick-cast-info">
                      <span className="flick-cast-name">{actor.name}</span>
                      {actor.character && (
                        <span className="flick-cast-role">{actor.character}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Community Discussions Feed */}
          <section className="flick-section flick-disc-section">
            <div className="flick-disc-header">
              <div>
                <h2 className="flick-section-title">Community Discussions</h2>
                <p className="flick-disc-sub">
                  Theories, breakdowns, and reviews from fellow cinephiles
                </p>
              </div>
              <Link
                to={`/discussions/create?mediaId=${movie.id}&mediaType=${mediaType}&title=${encodeURIComponent(
                  title || ""
                )}&poster=${encodeURIComponent(
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                    : ""
                )}`}
                className="flick-start-disc-btn"
              >
                + Start Discussion
              </Link>
            </div>

            {discLoading ? (
              <div className="flick-disc-loading">Loading discussions…</div>
            ) : discussions.length === 0 ? (
              <div className="flick-disc-empty">
                <span className="flick-disc-empty-icon">💬</span>
                <p className="flick-disc-empty-text">
                  No discussions yet for <strong>{title}</strong>. Share your review, ending theories, or favorite moments!
                </p>
                <Link
                  to={`/discussions/create?mediaId=${movie.id}&mediaType=${mediaType}&title=${encodeURIComponent(
                    title || ""
                  )}&poster=${encodeURIComponent(
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                      : ""
                  )}`}
                  className="flick-action-btn flick-btn-trailer"
                >
                  Start First Discussion
                </Link>
              </div>
            ) : (
              <div className="flick-disc-grid">
                {discussions.map((disc) => {
                  const authorName = disc.author?.username || "Anonymous";
                  const authorPic = disc.author?.profilePicture;
                  const dateStr = disc.createdAt
                    ? new Date(disc.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <Link
                      key={disc._id}
                      to={`/discussions/${disc._id}`}
                      className="flick-disc-card"
                    >
                      <div className="flick-disc-card-top">
                        <div className="flick-disc-author">
                          {authorPic ? (
                            <img
                              src={authorPic}
                              alt={authorName}
                              className="flick-disc-avatar"
                            />
                          ) : (
                            <div className="flick-disc-avatar-fallback">
                              {authorName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span className="flick-disc-author-name">
                            {authorName}
                          </span>
                        </div>
                        <span className="flick-disc-date">{dateStr}</span>
                      </div>

                      <h3 className="flick-disc-title">{disc.title}</h3>
                      <p className="flick-disc-excerpt">
                        {disc.content.length > 140
                          ? disc.content.slice(0, 140) + "..."
                          : disc.content}
                      </p>

                      <div className="flick-disc-card-footer">
                        <span>💬 {disc.commentsCount || 0} comments</span>
                        <span>❤️ {disc.likesCount || 0} likes</span>
                        <span className="flick-disc-arrow">Join →</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Column: Sticky Production Facts & Tech Specs */}
        <aside className="flick-detail-sidebar-col">
          <div className="flick-facts-card">
            <h3 className="flick-facts-title">Film Details & Specs</h3>

            <div className="flick-fact-row">
              <span className="flick-fact-label">Status</span>
              <span className="flick-fact-val">{movie.status || "Released"}</span>
            </div>

            {releaseDate && (
              <div className="flick-fact-row">
                <span className="flick-fact-label">Release Date</span>
                <span className="flick-fact-val">{releaseDate}</span>
              </div>
            )}

            {!isShow && movie.budget > 0 && (
              <div className="flick-fact-row">
                <span className="flick-fact-label">Budget</span>
                <span className="flick-fact-val">
                  ${movie.budget.toLocaleString()}
                </span>
              </div>
            )}

            {!isShow && movie.revenue > 0 && (
              <div className="flick-fact-row">
                <span className="flick-fact-label">Box Office</span>
                <span className="flick-fact-val flick-fact-val--revenue">
                  ${movie.revenue.toLocaleString()}
                </span>
              </div>
            )}

            {isShow && movie.number_of_episodes && (
              <div className="flick-fact-row">
                <span className="flick-fact-label">Episodes</span>
                <span className="flick-fact-val">{movie.number_of_episodes}</span>
              </div>
            )}

            {isShow && movie.networks?.length > 0 && (
              <div className="flick-fact-row">
                <span className="flick-fact-label">Network</span>
                <span className="flick-fact-val">
                  {movie.networks.map((n) => n.name).join(", ")}
                </span>
              </div>
            )}

            {movie.popularity != null && (
              <div className="flick-fact-row">
                <span className="flick-fact-label">Popularity Score</span>
                <span className="flick-fact-val">
                  {movie.popularity.toFixed(0)}
                </span>
              </div>
            )}

            {movie.vote_count != null && (
              <div className="flick-fact-row">
                <span className="flick-fact-label">Total Votes</span>
                <span className="flick-fact-val">
                  {movie.vote_count.toLocaleString()}
                </span>
              </div>
            )}

            {movie.production_companies?.length > 0 && (
              <div className="flick-fact-row flick-fact-row--stack">
                <span className="flick-fact-label">Production</span>
                <span className="flick-fact-companies">
                  {movie.production_companies.map((c) => c.name).join(" • ")}
                </span>
              </div>
            )}

            {movie.homepage && (
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flick-website-btn"
              >
                Official Website ↗
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Trailer Modal */}
      {trailerOpen && trailer && (
        <div
          className="flick-trailer-overlay"
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="flick-trailer-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="flick-trailer-close"
              onClick={() => setTrailerOpen(false)}
              aria-label="Close trailer"
            >
              ✕
            </button>
            <div className="flick-trailer-frame">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPage;