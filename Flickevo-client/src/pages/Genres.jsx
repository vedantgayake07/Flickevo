import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovieGenres, getTvGenres } from "../services/apiClient";
import "./Genres.css";

const Genres = () => {
  const [activeTab, setActiveTab] = useState("movie"); // 'movie' or 'tv'
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllGenres() {
      try {
        const [mRes, tRes] = await Promise.all([
          getMovieGenres(),
          getTvGenres(),
        ]);
        setMovieGenres(mRes.genres || []);
        setTvGenres(tRes.genres || []);
      } catch (error) {
        console.error("Failed to load genres", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllGenres();
  }, []);

  const handleGenreClick = (genre) => {
    navigate(`/genre/${activeTab}/${genre.id}?name=${encodeURIComponent(genre.name)}`);
  };

  const currentList = activeTab === "movie" ? movieGenres : tvGenres;

  return (
    <div className="genres-page">
      <div className="genres-header">
        <h1 className="genres-title">Explore by Genre</h1>
        <p className="genres-subtitle">
          Find your next favorite film or series by browsing curated category tags
        </p>

        <div className="genres-tabs">
          <button
            type="button"
            className={`genres-tab ${activeTab === "movie" ? "genres-tab--active" : ""}`}
            onClick={() => setActiveTab("movie")}
          >
            🎬 Movies ({movieGenres.length})
          </button>
          <button
            type="button"
            className={`genres-tab ${activeTab === "tv" ? "genres-tab--active" : ""}`}
            onClick={() => setActiveTab("tv")}
          >
            📺 TV Shows ({tvGenres.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="genres-loading">Loading genres…</div>
      ) : (
        <div className="genres-grid">
          {currentList.map((genre) => (
            <div
              key={genre.id}
              className="genre-tile"
              onClick={() => handleGenreClick(genre)}
            >
              <div className="genre-tile__glow" />
              <div className="genre-tile__content">
                <span className="genre-tile__badge">
                  {activeTab === "movie" ? "Movie" : "TV"}
                </span>
                <h3 className="genre-tile__name">{genre.name}</h3>
                <span className="genre-tile__action">Explore →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Genres;
