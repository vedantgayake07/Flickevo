import { useRef } from "react";
const CastSlider = ({ cast }) => {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.8;
    track.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="movie-hero__cast">
      <div className="movie-hero__cast-header">
        <h2 className="movie-hero__cast-title">Main Cast</h2>
        <div className="movie-hero__cast-controls">
          <button
            type="button"
            className="movie-hero__cast-arrow"
            onClick={() => scroll("prev")}
            aria-label="Scroll cast left"
          >
            ‹
          </button>
          <button
            type="button"
            className="movie-hero__cast-arrow"
            onClick={() => scroll("next")}
            aria-label="Scroll cast right"
          >
            ›
          </button>
        </div>
      </div>

      <div className="movie-hero__cast-track" ref={trackRef}>
        {cast.slice(0,12).map((actor) => (
          <div key={actor.credit_id || actor.id} className="movie-hero__cast-card">
            <div className="movie-hero__cast-image-wrapper">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "/placeholder-person.jpg"
                }
                alt={actor.name}
                className="movie-hero__cast-image"
              />
            </div>

            <div className="movie-hero__cast-info">
              <h3 className="movie-hero__cast-name">{actor.name}</h3>
              {actor.character && (
                <p className="movie-hero__cast-character">{actor.character}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


export default CastSlider;