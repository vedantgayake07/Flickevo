/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMovie } from "../services/apiClient";
import { getMediaType } from "../helpers/mediaType";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchResults() {
      setLoading(true);
      try {
        const response = await searchMovie(query, page);
        const data = response.data;

        const filtered = (data.results || []).filter(
          (item) => item.media_type !== "person"
        );

        if (!cancelled) {
          setResults(filtered);
          setTotalPages(data.total_pages || 1);
          setTotalResults(data.total_results || 0);
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchResults();

    return () => {
      cancelled = true;
    };
  }, [query, page]);

  const handleOpen = (item) => {
    const type = getMediaType(item);
    navigate(`/content/${item.id}/${type}`);
  };

  const goToPage = (nextPage) => {
    setSearchParams({ q: query, page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!query.trim()) {
    return (
      <div className="sr-placeholder">
        <h1 className="sr-placeholder__title">Search for movies & shows</h1>
        <p className="sr-placeholder__text">
          Use the search bar above to find something to watch.
        </p>
      </div>
    );
  }

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1 className="sr-heading">
          Results for <span className="sr-query">"{query}"</span>
        </h1>
        {!loading && (
          <span className="sr-count">
            {totalResults.toLocaleString()} result{totalResults !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {loading ? (
        <div className="sr-loading">Searching…</div>
      ) : results.length === 0 ? (
        <div className="sr-empty">
          <p>No results found for "{query}".</p>
        </div>
      ) : (
        <>
          <div className="sr-grid">
            {results.map((item) => (
              <div
                key={item.id}
                className="poster-card"
                onClick={() => handleOpen(item)}
              >
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
                  <span className="poster-score">
                    ★ {item.vote_average?.toFixed(1) ?? "-"}
                  </span>
                  <h3 className="poster-title">{item.title || item.name}</h3>
                  <span className="poster-year">
                    {(item.release_date || item.first_air_date)?.slice(0, 4) || ""}
                  </span>
                </div>
                <span className="sr-type-badge">
                  {getMediaType(item) === "tv" ? "TV" : "Movie"}
                </span>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="sr-pagination">
              <button
                type="button"
                className="sr-page-btn"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                ‹ Prev
              </button>

              <span className="sr-page-indicator">
                Page {page} of {Math.min(totalPages, 500)}
              </span>

              <button
                type="button"
                className="sr-page-btn"
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

export default SearchResults;