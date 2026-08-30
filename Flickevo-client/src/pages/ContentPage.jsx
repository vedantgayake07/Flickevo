import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getContentById } from "../services/apiClient";
import './ContentPage.css';

const ContentPage = () => {
  const [movie, setMovie] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const { id, type } = useParams();

  useEffect(() => {
    async function getMovieOrShow() {
      const movieData = await getContentById(id, type);
      setMovie(movieData);
    }
    if (id && type) getMovieOrShow();
  }, [id, type]);

  if (!movie) {
    return <div className="cp-loading">Loading content…</div>;
  }

  const isShow = type === 'tv' || !!movie.first_air_date || !!movie.name;
  const cast = movie.credits?.cast || [];
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const runtime = movie.runtime || movie.episode_run_time?.[0];
  const watchProviders = movie["watch/providers"]?.results?.IN?.flatrate;

  const trailer =
    movie.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube" && v.official
    ) ||
    movie.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );

  return (
    <div className="cp-page">
      {/* Backdrop */}
      <div className="cp-backdrop">
        {movie.backdrop_path && (
          <img
            className="cp-backdrop__image"
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt=""
          />
        )}
        <div className="cp-backdrop__overlay" />

        <div className="cp-header">
          <div className="cp-poster">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                  : "/placeholder-movie.jpg"
              }
              alt={title}
            />
          </div>

          <div className="cp-info">
            {movie.status && <span className="cp-badge">{movie.status}</span>}
            <h1 className="cp-title">{title}</h1>
            {movie.tagline && <p className="cp-tagline">{movie.tagline}</p>}

            <div className="cp-meta">
              {movie.vote_average != null && (
                <span className="cp-meta__rating">⭐ {movie.vote_average.toFixed(1)}</span>
              )}
              {releaseDate && <span>{releaseDate.slice(0, 4)}</span>}
              {runtime > 0 && <span>{runtime} min{isShow ? "/ep" : ""}</span>}
              {isShow && movie.number_of_seasons && (
                <span>{movie.number_of_seasons} season{movie.number_of_seasons > 1 ? "s" : ""}</span>
              )}
              {movie.original_language && <span>{movie.original_language.toUpperCase()}</span>}
            </div>

            <div className="cp-genres">
              {movie.genres?.map((g) => (
                <span key={g.id} className="cp-genre-pill">{g.name}</span>
              ))}
            </div>

            <div className="cp-actions">
              {trailer && (
                <button
                  type="button"
                  className="cp-btn cp-btn--primary"
                  onClick={() => setTrailerOpen(true)}
                >
                  ▶ Watch Trailer
                </button>
              )}

              {watchProviders?.length > 0 ? (
                <div className="cp-providers">
                  {watchProviders.slice(0, 4).map((p) => (
                    <img
                      key={p.provider_id}
                      className="cp-providers__logo"
                      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      title={p.provider_name}
                    />
                  ))}
                </div>
              ) : (
                <span className="cp-no-provider">Not available to stream</span>
              )}

              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cp-btn cp-btn--ghost"
                >
                  Official Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="cp-body">
        {movie.overview && (
          <section className="cp-section cp-overview-section">
            <h2 className="cp-section__title">Overview</h2>
            <p className="cp-overview-text">{movie.overview}</p>
          </section>
        )}

        {cast.length > 0 && (
          <section className="cp-section">
            <h2 className="cp-section__title">Cast</h2>
            <div className="cp-cast-row">
              {cast.slice(0, 20).map((actor) => (
                <div key={actor.credit_id || actor.id} className="cp-cast-item">
                  <div className="cp-cast-avatar">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                      />
                    ) : (
                      <div className="cp-cast-avatar__fallback">
                        {actor.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                    )}
                  </div>
                  <span className="cp-cast-name">{actor.name}</span>
                  {actor.character && (
                    <span className="cp-cast-character">{actor.character}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="cp-section">
          <h2 className="cp-section__title">Details</h2>
          <div className="cp-details-grid">
            {!isShow && (
              <>
                <div className="cp-detail">
                  <span className="cp-detail__label">Budget</span>
                  <span className="cp-detail__value">
                    {movie.budget ? `$${movie.budget.toLocaleString()}` : "-"}
                  </span>
                </div>
                <div className="cp-detail">
                  <span className="cp-detail__label">Revenue</span>
                  <span className="cp-detail__value">
                    {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "-"}
                  </span>
                </div>
              </>
            )}

            {isShow && (
              <>
                <div className="cp-detail">
                  <span className="cp-detail__label">Episodes</span>
                  <span className="cp-detail__value">{movie.number_of_episodes ?? "-"}</span>
                </div>
                <div className="cp-detail">
                  <span className="cp-detail__label">Network</span>
                  <span className="cp-detail__value">
                    {movie.networks?.map((n) => n.name).join(", ") || "-"}
                  </span>
                </div>
                <div className="cp-detail">
                  <span className="cp-detail__label">Created By</span>
                  <span className="cp-detail__value">
                    {movie.created_by?.map((p) => p.name).join(", ") || "-"}
                  </span>
                </div>
              </>
            )}

            <div className="cp-detail">
              <span className="cp-detail__label">Popularity</span>
              <span className="cp-detail__value">
                {movie.popularity != null ? movie.popularity.toFixed(0) : "-"}
              </span>
            </div>

            <div className="cp-detail">
              <span className="cp-detail__label">Vote Count</span>
              <span className="cp-detail__value">
                {movie.vote_count?.toLocaleString() ?? "-"}
              </span>
            </div>

            <div className="cp-detail cp-detail--wide">
              <span className="cp-detail__label">Production</span>
              <span className="cp-detail__value">
                {movie.production_companies?.map((c) => c.name).join(" • ") || "-"}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Trailer modal */}
      {trailerOpen && trailer && (
        <div className="cp-modal-overlay" onClick={() => setTrailerOpen(false)}>
          <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="cp-modal__close"
              onClick={() => setTrailerOpen(false)}
              aria-label="Close trailer"
            >
              ✕
            </button>
            <div className="cp-modal__frame">
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