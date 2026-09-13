/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { searchMovie } from '../services/apiClient'
import { getMediaType } from '../helpers/mediaType'
import { useLocation } from 'react-router-dom';
import './Header.css';


const Header = () => {

  const [searchbar, setsearchbar] = useState(false);

  const { user, logout } = useAuth();

  const location = useLocation();

  useEffect(() => {
    setsearchoptions([]);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setsearch("");
      setsearchoptions([]);
      setsearchbar(false);
    }
  };

  const [search, setsearch] = useState("");

  const navigate = useNavigate();
  const [searchoptions, setsearchoptions] = useState([]);

  const handleOnChange = (e) => {
    setsearch(e.target.value)
  }

  useEffect(() => {
    if (!search.trim()) {
      setsearchoptions([]);
      return;
    }

    const searchmovie = async () => {
      try {
        const response = await searchMovie(search);
        setsearchoptions(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };

    searchmovie();
  }, [search]);

  const handleSuggestion = (movie) => {
    const type = getMediaType(movie);
    navigate(`/content/${movie.id}/${type}`);
    setsearch("");
    setsearchoptions([]); // was missing — this is why the dropdown stayed open
    setsearchbar(false);  // also collapse the search input itself
  };


  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          Flick<span className="accent">evo</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/movies"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Movies
          </NavLink>

          <NavLink
            to="/shows"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Shows
          </NavLink>


          <NavLink
            to="/watchlist"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Watchlist
          </NavLink>
        </nav>


        <div className="header-actions">
          <div id='searchbarbar'>
            <input
              type='text'
              className={searchbar ? `show` : `hide`}
              value={search}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
            >
            </input>

            {searchbar && searchoptions.length > 0 && (
              <div className="search-suggestions">
                {searchoptions.map((movie) => (
                  <div key={movie.id} className="suggestion" onClick={() => handleSuggestion(movie)}>
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                          : "/no-poster.png"
                      }
                      alt={movie.title}
                      className="suggestion-poster"
                    />

                    <div className="suggestion-info">
                      <h4>{movie.title || movie.name}</h4>

                      <div className="suggestion-meta">
                        <span>
                          {movie.release_date?.slice(0, 4) ||
                            movie.first_air_date?.slice(0, 4)}
                        </span>

                        <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className="suggestion suggestion-viewall"
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
                    setsearch("");
                    setsearchoptions([]);
                  }}
                >
                  See all results for "{search}"
                </div>
              </div>
            )}
          </div>



          <button
            className="icon-btn"
            aria-label="Searchbar"
            onClick={() => {
              const opening = !searchbar;
              setsearchbar(opening);
              if (!opening) {
                setsearch("");
                setsearchoptions([]);
              }
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          {user ? (
            <div className="header-user">
              <span className="header-username">{user.username}</span>
              <button className="btn-signin" onClick={handleLogout}>Sign out</button>
            </div>
          ) : (
            <button className="btn-signin" onClick={() => navigate('/login')}>Sign in</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;