/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import { getContentById } from "../services/apiClient";
import { FaFilm, FaStar, FaTrash, FaTv, FaBookmark } from "react-icons/fa";
import "../styles/Watchlist.css";

const WatchList = () => {
  const { items, loaded, toggleWatchlist } = useWatchlist();
  const [details, setDetails] = useState({}); // { [_id]: fullMovieOrShowObject }
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'movie' | 'tv'
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) return;

    if (items.length === 0) {
      setDetails({});
      setDetailsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadDetails() {
      setDetailsLoading(true);
      const results = await Promise.all(
        items.map(async (item) => {
          try {
            const data = await getContentById(item.mediaId, item.mediaType);
            return [item._id, data];
          } catch {
            return [item._id, null];
          }
        })
      );

      if (!cancelled) {
        setDetails(Object.fromEntries(results));
        setDetailsLoading(false);
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [items, loaded]);

  const handleRemove = async (e, item) => {
    e.stopPropagation();
    await toggleWatchlist(item.mediaId, item.mediaType);
  };

  const handleOpen = (item) => {
    navigate(`/content/${item.mediaId}/${item.mediaType}`);
  };

  const movieCount = useMemo(() => items.filter((i) => i.mediaType !== "tv").length, [items]);
  const tvCount = useMemo(() => items.filter((i) => i.mediaType === "tv").length, [items]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "movie") return items.filter((i) => i.mediaType !== "tv");
    if (activeFilter === "tv") return items.filter((i) => i.mediaType === "tv");
    return items;
  }, [items, activeFilter]);

  if (!loaded || detailsLoading) {
    return (
      <div className="wl-page">
        <div className="wl-header">
          <div className="wl-header-left">
            <span className="wl-eyebrow">Personal Archive</span>
            <h1 className="wl-heading">Your Watchlist</h1>
          </div>
        </div>
        <div className="wl-loading-container">
          <div className="wl-spinner" />
          <p>Loading your curated watchlist…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wl-page">
      <div className="wl-header">
        <div className="wl-header-left">
          <span className="wl-eyebrow">Personal Archive</span>
          <div className="wl-title-row">
            <h1 className="wl-heading">Your Watchlist</h1>
            <span className="wl-count-pill">{items.length} {items.length === 1 ? "title" : "titles"}</span>
          </div>
        </div>

        {items.length > 0 && (
          <div className="wl-filters">
            <button
              type="button"
              className={`wl-filter-btn ${activeFilter === "all" ? "wl-filter-btn--active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              className={`wl-filter-btn ${activeFilter === "movie" ? "wl-filter-btn--active" : ""}`}
              onClick={() => setActiveFilter("movie")}
            >
              Movies ({movieCount})
            </button>
            <button
              type="button"
              className={`wl-filter-btn ${activeFilter === "tv" ? "wl-filter-btn--active" : ""}`}
              onClick={() => setActiveFilter("tv")}
            >
              TV Shows ({tvCount})
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="wl-empty-card">
          <div className="wl-empty-icon-wrap">
            <FaBookmark className="wl-empty-icon" />
          </div>
          <h2 className="wl-empty-title">Your Watchlist is Empty</h2>
          <p className="wl-empty-desc">
            Keep track of films and series you want to watch. Tap the watchlist button on any title to save it to your personal archive.
          </p>
          <div className="wl-empty-actions">
            <Link to="/movies" className="wl-btn wl-btn--primary">
              <FaFilm className="text-xs" /> Explore Movies
            </Link>
            <Link to="/shows" className="wl-btn wl-btn--secondary">
              <FaTv className="text-xs" /> Explore Shows
            </Link>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="wl-empty-filtered">
          <p>No {activeFilter === "movie" ? "movies" : "TV shows"} in your watchlist.</p>
          <button type="button" className="wl-btn-reset" onClick={() => setActiveFilter("all")}>
            Show all titles
          </button>
        </div>
      ) : (
        <ul className="wl-grid">
          {filteredItems.map((item) => {
            const data = details[item._id];
            if (!data) return null;

            const title = data.title || data.name;
            const releaseDate = data.release_date || data.first_air_date;
            const isTv = item.mediaType === "tv";

            return (
              <li key={item._id} className="wl-card" onClick={() => handleOpen(item)}>
                <div className="wl-poster-wrap">
                  <img
                    className="wl-poster"
                    src={
                      data.poster_path
                        ? `https://image.tmdb.org/t/p/w342${data.poster_path}`
                        : "/no-poster.png"
                    }
                    alt={title}
                    loading="lazy"
                  />

                  <span className="wl-type-tag">
                    {isTv ? "TV" : "Film"}
                  </span>

                  <button
                    type="button"
                    className="wl-remove"
                    onClick={(e) => handleRemove(e, item)}
                    aria-label={`Remove ${title} from watchlist`}
                    title="Remove from watchlist"
                  >
                    <FaTrash />
                  </button>

                  <div className="wl-overlay">
                    <span className="wl-score">
                      <FaStar className="text-amber-400 text-xs" />
                      {data.vote_average ? data.vote_average.toFixed(1) : "—"}
                    </span>
                  </div>
                </div>

                <div className="wl-info">
                  <p className="wl-title" title={title}>{title}</p>
                  <div className="wl-meta">
                    <span className="wl-year">{releaseDate ? releaseDate.slice(0, 4) : "—"}</span>
                    <span className="wl-rating-badge">
                      <FaStar className="text-amber-400 text-[10px]" />
                      {data.vote_average ? data.vote_average.toFixed(1) : "—"}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WatchList;