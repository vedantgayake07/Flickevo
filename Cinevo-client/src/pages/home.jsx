// Home.jsx
import { getTrending } from '../services/apiClient';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './home.css';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const response = await getTrending();
        setPopularMovies(response.results);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);



  // Use a handful of posters to build the hero mosaic backdrop
  const heroPosters = popularMovies.slice(0, 8);

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-mosaic">
          {heroPosters.map((movie) => (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt=""
              className="hero-mosaic-img"
            />
          ))}
        </div>
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="eyebrow">Community-driven movie discovery</span>
          <h1 className="hero-title">
            Know what's <span className="accent">worth watching</span>
            <br />before you press play.
          </h1>
          <p className="hero-sub">
            Build your watchlist, get reminders for what you plan to watch,
            and ask real people whether a movie is actually worth your time.
          </p>
          <div className="hero-actions">
            <NavLink to="/movies" className="btn btn-primary" >Start your watchlist</NavLink>
          </div>
        </div>

        <div className="sprocket-strip" aria-hidden="true" />
      </section>

      {/* POPULAR GRID */}
      <section className="popular-section">
        <div className="section-header">
          <h2>Popular this week</h2>
          <p>What the community is watching right now</p>
        </div>
        <div className="movie-shelf">
          {loading &&
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="movie-card skeleton" />
            ))}

          {!loading &&
            popularMovies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                  loading="lazy"
                />
                <div className="movie-card-overlay">
                  <div className="movie-rating">
                    ★ {movie.vote_average?.toFixed(1)}
                  </div>
                  <h3 className="movie-title">{movie.title}</h3>
                  <span className="movie-year">
                    {movie.release_date?.slice(0, 4)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;