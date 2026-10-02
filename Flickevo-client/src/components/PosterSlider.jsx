// components/PosterSlider.jsx
import { useRef } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/PosterSlider.css';

export const PosterSlider = ({ title, movies, handleSuggestion }) => {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.85;
    track.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="slider-section">
      <h2 className="section-title">{title}</h2>

      <div className="slider-wrap">
        <button
          className="slider-nav slider-nav-left flex items-center justify-center"
          onClick={() => scroll('left')}
          aria-label={`Scroll ${title} left`}
        >
          <FaChevronLeft className="text-sm" />
        </button>

        <div className="slider-track" ref={trackRef}>
          {movies.map((movie) => (
            <div key={movie.id} className="poster-card" onClick={() => {console.log(movie) ; handleSuggestion(movie)}}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="poster-img"
                loading="lazy"
              />
              <div className="poster-overlay">
                <span className="poster-score flex items-center gap-1">
                  <FaStar className="text-amber-400 text-xs" /> {movie.vote_average?.toFixed(1)}
                </span>
                <h3 className="poster-title">{movie.title || movie.name}</h3>
                <span className="poster-year">
                  {(movie.release_date || movie.first_air_date)?.slice(0, 4)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="slider-fade slider-fade-left" aria-hidden="true" />
        <div className="slider-fade slider-fade-right" aria-hidden="true" />

        <button
          className="slider-nav slider-nav-right flex items-center justify-center"
          onClick={() => scroll('right')}
          aria-label={`Scroll ${title} right`}
        >
          <FaChevronRight className="text-sm" />
        </button>
      </div>
    </section>
  );
};  