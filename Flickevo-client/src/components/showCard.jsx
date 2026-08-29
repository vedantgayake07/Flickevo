import './showCard.css';

export const ShowCard = ({ show }) => {
  if (!show) return null;

  return (
    <div className="show-hero">
      <div className="show-hero__poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.name}
        />
      </div>

      <div className="show-hero__body">
        <h1 className="show-hero__title">
          {show.name}
        </h1>

        {show.tagline && (
          <p className="show-hero__tagline">
            {show.tagline}
          </p>
        )}

        <div className="show-hero__meta">
          <span className="show-hero__rating">
            ⭐ {show.vote_average?.toFixed(1)}
          </span>

          <span className="show-hero__meta-item">
            {show.vote_count?.toLocaleString()} votes
          </span>

          <span className="show-hero__meta-item">
            {show.episode_run_time?.[0] ?? "-"} min / episode
          </span>

          <span className="show-hero__meta-item">
            {show.first_air_date}
          </span>

          <span className="show-hero__meta-item">
            {show.original_language?.toUpperCase()}
          </span>

          <span className="show-hero__status">
            {show.status}
          </span>
        </div>

        <p className="show-hero__overview">
          {show.overview}
        </p>

        <div className="show-hero__stats">
          <div className="show-hero__stat">
            <span className="show-hero__stat-label">
              Seasons
            </span>

            <span className="show-hero__stat-value">
              {show.number_of_seasons}
            </span>
          </div>

          <div className="show-hero__stat">
            <span className="show-hero__stat-label">
              Episodes
            </span>

            <span className="show-hero__stat-value">
              {show.number_of_episodes}
            </span>
          </div>

          <div className="show-hero__stat">
            <span className="show-hero__stat-label">
              Popularity
            </span>

            <span className="show-hero__stat-value">
              {show.popularity?.toFixed(0)}
            </span>
          </div>
        </div>

        <div className="show-hero__tags">
          {show.genres?.map((genre) => (
            <span
              key={genre.id}
              className="show-hero__tag"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <div className="show-hero__companies">
          <span className="show-hero__label">
            Production
          </span>

          <p>
            {show.production_companies
              ?.map((company) => company.name)
              .join(" • ")}
          </p>
        </div>

        <div className="show-hero__stats show-hero__stats--secondary">
          <div className="show-hero__stat">
            <span className="show-hero__stat-label">
              Created By
            </span>

            <span className="show-hero__stat-value">
              {show.created_by?.map((p) => p.name).join(", ") ||
                "Unknown"}
            </span>
          </div>

          <div className="show-hero__stat">
            <span className="show-hero__stat-label">
              Network
            </span>

            <span className="show-hero__stat-value">
              {show.networks?.map((n) => n.name).join(", ")}
            </span>
          </div>

          <div className="show-hero__stat">
            <span className="show-hero__stat-label">
              Type
            </span>

            <span className="show-hero__stat-value">
              {show.type}
            </span>
          </div>
        </div>

        {show.homepage && (
          <a
            href={show.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="show-hero__link"
          >
            Visit Official Website →
          </a>
        )}
      </div>
    </div>
  );
};