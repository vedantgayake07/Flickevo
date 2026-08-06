export const MovieCard = ({ movie }) => {
  if (!movie) return null;

  return (
    <div className="movie-hero">
      <div className="movie-hero__poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
      </div>

      <div className="movie-hero__body">
        <h1 className="movie-hero__title">{movie.title}</h1>

        {movie.tagline && (
          <p className="movie-hero__tagline">{movie.tagline}</p>
        )}

        <div className="movie-hero__meta">
          <span className="movie-hero__rating">
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>

          <span className="movie-hero__meta-item">
            {movie.vote_count?.toLocaleString()} votes
          </span>

          <span className="movie-hero__meta-item">
            {movie.runtime ?? "-"} min
          </span>

          <span className="movie-hero__meta-item">
            {movie.release_date}
          </span>

          <span className="movie-hero__meta-item">
            {movie.original_language?.toUpperCase()}
          </span>

          <span className="movie-hero__status">
            {movie.status}
          </span>
        </div>

        <p className="movie-hero__overview">
          {movie.overview}
        </p>

        <div className="movie-hero__stats">
          <div className="movie-hero__stat">
            <span className="movie-hero__stat-label">Budget</span>
            <span className="movie-hero__stat-value">
              ${movie.budget?.toLocaleString()}
            </span>
          </div>

          <div className="movie-hero__stat">
            <span className="movie-hero__stat-label">Revenue</span>
            <span className="movie-hero__stat-value">
              ${movie.revenue?.toLocaleString()}
            </span>
          </div>

          <div className="movie-hero__stat">
            <span className="movie-hero__stat-label">Popularity</span>
            <span className="movie-hero__stat-value">
              {movie.popularity?.toFixed(0)}
            </span>
          </div>
        </div>

        <div className="movie-hero__tags">
          {movie.genres?.map((genre) => (
            <span key={genre.id} className="movie-hero__tag">
              {genre.name}
            </span>
          ))}
        </div>

        <div className="movie-hero__companies">
          <span className="movie-hero__label">Production</span>
          <p>
            {movie.production_companies
              ?.map((company) => company.name)
              .join(" • ")}
          </p>
        </div>

        {movie.homepage && (
          <a
            href={movie.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="movie-hero__link"
          >
            Visit Official Website →
          </a>
        )}
      </div>
    </div>
  );
};