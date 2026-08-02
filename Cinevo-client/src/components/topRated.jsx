// components/topRated.jsx
export const TopRated = ({ movie }) => {
  return (
    <li className="rated-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="rated-poster"
        loading="lazy"
      />
      <div className="rated-overlay">
        <span className="rated-score">★ {movie.vote_average?.toFixed(1)}</span>
        <h3 className="rated-title">{movie.title}</h3>
        <span className="rated-year">{movie.release_date?.slice(0, 4)}</span>
      </div>
    </li>
  );
};