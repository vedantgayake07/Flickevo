// Home.jsx
import { getTrending } from '../services/apiClient';
import { getDiscussions } from '../services/discussionApi';
import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { getMediaType } from '../helpers/mediaType';
import { FaFilm, FaComments, FaStar, FaRegComment, FaHeart, FaPlus, FaArrowRight } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentDiscussions, setRecentDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleOnClick = (movie) => {
    const type = getMediaType(movie); // returns 'movie' or 'tv'
    navigate(`/content/${movie.id}/${type}`);
  };

  useEffect(() => {
    async function getData() {
      try {
        const [trendingRes, discRes] = await Promise.all([
          getTrending(),
          getDiscussions().catch(() => []),
        ]);
        setPopularMovies(trendingRes?.results || []);
        setRecentDiscussions((discRes || []).slice(0, 4));
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
            Build your watchlist, join heated discussions, explore what is trending,
            and ask fellow cinephiles whether a movie or show is worth your time.
          </p>
          <div className="hero-actions">
            <NavLink to="/movies" className="btn btn-primary">
              <FaFilm className="text-base" /> Browse Movies
            </NavLink>
            <NavLink to="/discussions" className="btn btn-secondary">
              <FaComments className="text-base" /> Join Discussions
            </NavLink>
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
            popularMovies.map((movie) => {
              const displayTitle = movie.title || movie.name;
              const displayYear = (movie.release_date || movie.first_air_date)?.slice(0, 4);

              return (
                <div key={movie.id} className="movie-card" onClick={() => handleOnClick(movie)}>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/placeholder-movie.svg"
                    }
                    alt={displayTitle}
                    className="movie-poster"
                    loading="lazy"
                  />
                  <div className="movie-card-overlay">
                    <div className="movie-rating flex items-center gap-1">
                      <FaStar className="text-amber-400 text-xs" /> {movie.vote_average?.toFixed(1)}
                    </div>
                    <h3 className="movie-title">{displayTitle}</h3>
                    <span className="movie-year">{displayYear}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* COMMUNITY DISCUSSIONS SHOWCASE */}
      <section className="home-discussions-section">
        <div className="home-discussions-header">
          <div>
            <span className="home-section-tag">Community Buzz</span>
            <h2 className="home-section-title">Trending Discussions</h2>
            <p className="home-section-sub">
              Hear theories, reviews, and insights from other viewers
            </p>
          </div>
          <Link to="/discussions" className="home-view-all-disc flex items-center gap-1.5">
            Explore All Discussions <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {recentDiscussions.length === 0 ? (
          <div className="home-discussions-empty">
            <p>No community discussions yet. Be the first to share your thoughts!</p>
            <Link to="/discussions/create" className="btn btn-primary">
              <FaPlus className="text-xs" /> Start a Discussion
            </Link>
          </div>
        ) : (
          <div className="home-discussions-grid">
            {recentDiscussions.map((disc) => {
              const authorName = disc.author?.username || "Anonymous";
              const authorPic = disc.author?.profilePicture;
              const title = disc.mediaTitle || `${disc.mediaType === "tv" ? "TV Show" : "Movie"}`;
              const poster = disc.mediaPoster || "/placeholder-movie.svg";

              return (
                <Link
                  key={disc._id}
                  to={`/discussions/${disc._id}`}
                  className="home-disc-card"
                >
                  <img src={poster} alt={title} className="home-disc-poster" />
                  <div className="home-disc-content">
                    <span className="home-disc-badge">
                      {disc.mediaType === "tv" ? "TV Show" : "Movie"} • {title}
                    </span>
                    <h3 className="home-disc-title">{disc.title}</h3>
                    <p className="home-disc-snippet">
                      {disc.content.length > 100
                        ? disc.content.slice(0, 100) + "..."
                        : disc.content}
                    </p>
                    <div className="home-disc-footer">
                      <div className="home-disc-author">
                        {authorPic ? (
                          <img src={authorPic} alt={authorName} className="home-disc-avatar" />
                        ) : (
                          <div className="home-disc-avatar-fallback">
                            {authorName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span>{authorName}</span>
                      </div>
                      <div className="home-disc-stats">
                        <span className="flex items-center gap-1">
                          <FaRegComment className="text-xs" /> {disc.commentsCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaHeart className="text-red-400 text-xs" /> {disc.likesCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;