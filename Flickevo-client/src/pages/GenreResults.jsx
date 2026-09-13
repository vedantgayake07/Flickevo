import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { discoverByGenre } from "../services/apiClient";
import "./GenreResults.css";

const GenreResults = () => {
  const { type, id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name") || "Genre";
  const page = Number(searchParams.get("page")) || 1;

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function fetchGenreResults() {
      setLoading(true);
      try {
        const data = await discoverByGenre(type, id, page);
        if (!cancelled) {
          setResults(data.results || []);
          setTotalPages(data.total_pages || 1);
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchGenreResults();
    return () => { cancelled = true; };
  }, [type, id, page]);

  const handleOpen = (item) => {
    navigate(`/content/${item.id}/${type}`);
  };

  const goToPage = (nextPage) => {
    setSearchParams({ name, page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="gr-page">
      <h1 className="gr-heading">
        {name} <span className="gr-type-label">{type === "tv" ? "Shows" : "Movies"}</span>
      </h1>

      {loading ? (
        <div className="gr-loading">Loading…</div>
      ) : results.length === 0 ? (
        <div className="gr-empty">No results found for this genre.</div>
      ) : (
        <>
          <div className="gr-grid">
            {results.map((item) => (
              <div key={item.id} className="poster-card" onClick={() => handleOpen(item)}>
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                      : "/placeholder-movie.jpg"
                  }
                  alt={item.title || item.name}
                  className="poster-img"
                  loading="lazy"
                />
                <div className="poster-overlay">
                  <span className="poster-score">★ {item.vote_average?.toFixed(1) ?? "-"}</span>
                  <h3 className="poster-title">{item.title || item.name}</h3>
                  <span className="poster-year">
                    {(item.release_date || item.first_air_date)?.slice(0, 4) || ""}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="gr-pagination">
              <button
                type="button"
                className="gr-page-btn"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                ‹ Prev
              </button>
              <span className="gr-page-indicator">
                Page {page} of {Math.min(totalPages, 500)}
              </span>
              <button
                type="button"
                className="gr-page-btn"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GenreResults;