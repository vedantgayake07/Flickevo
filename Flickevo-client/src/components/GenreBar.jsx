import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovieGenres, getTvGenres } from "../services/apiClient";
import "./GenreBar.css";

const GenreBar = ({ type }) => {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function loadGenres() {
      try {
        const data = type === "tv" ? await getTvGenres() : await getMovieGenres();
        if (!cancelled) setGenres(data.genres || []);
      } catch {
        if (!cancelled) setGenres([]);
      }
    }

    loadGenres();
    return () => { cancelled = true; };
  }, [type]);

  if (genres.length === 0) return null;

  const handleClick = (genre) => {
    navigate(`/genre/${type}/${genre.id}?name=${encodeURIComponent(genre.name)}`);
  };

  return (
    <div className="genre-bar">
      {genres.map((genre) => (
        <button
          key={genre.id}
          type="button"
          className="genre-bar__pill"
          onClick={() => handleClick(genre)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreBar;