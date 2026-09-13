/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import { getContentById } from "../services/apiClient";
import "./Watchlist.css";

const WatchList = () => {
  const { items, loaded, toggleWatchlist } = useWatchlist();
  const [details, setDetails] = useState({}); // { [_id]: fullMovieOrShowObject }
  const [detailsLoading, setDetailsLoading] = useState(true);
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



  if (!loaded || detailsLoading) {
    return <div className="wl-loading">Loading your watchlist…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="wl-placeholder">
        <div className="wl-placeholder__icon">🎬</div>
        <h1 className="wl-placeholder__title">Your Watchlist is Empty</h1>
        <p className="wl-placeholder__text">
          Add movies or shows from their detail page to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="wl-page">
      <h1 className="wl-heading">Your Watchlist</h1>

      <ul className="wl-grid">
        {items.map((item) => {
          const data = details[item._id];
          if (!data) return null;

          const title = data.title || data.name;
          const releaseDate = data.release_date || data.first_air_date;

          return (
            <li key={item._id} className="wl-card" onClick={() => handleOpen(item)}>
              <img
                className="wl-poster"
                src={
                  data.poster_path
                    ? `https://image.tmdb.org/t/p/w342${data.poster_path}`
                    : "/placeholder-movie.jpg"
                }
                alt={title}
              />

              <div className="wl-overlay">
                <span className="wl-score">⭐ {data.vote_average?.toFixed(1) ?? "-"}</span>
                <p className="wl-title">{title}</p>
                <span className="wl-year">{releaseDate ? releaseDate.slice(0, 4) : ""}</span>
                <span className="wl-type">{item.mediaType === "tv" ? "TV Show" : "Movie"}</span>
              </div>

              <button
                type="button"
                className="wl-remove"
                onClick={(e) => handleRemove(e, item)}
                aria-label={`Remove ${title} from watchlist`}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WatchList;