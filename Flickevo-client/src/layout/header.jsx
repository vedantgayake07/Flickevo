/* eslint-disable react-hooks/set-state-in-effect */
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { searchMovie } from '../services/apiClient';
import { getMediaType } from '../helpers/mediaType';
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaFilm,
  FaTv,
  FaCompass,
  FaComments,
  FaBookmark,
  FaStar,
  FaSignOutAlt,
  FaSignInAlt,
  FaHome,
  FaChevronRight
} from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  const [searchbar, setSearchbar] = useState(false);
  const [search, setSearch] = useState("");
  const [searchoptions, setSearchoptions] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSearchoptions([]);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setSearchoptions([]);
      setSearchbar(false);
      setMobileMenuOpen(false);
    }
  };

  const handleOnChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (!search.trim()) {
      setSearchoptions([]);
      return;
    }

    const searchmovie = async () => {
      try {
        const response = await searchMovie(search);
        setSearchoptions(response.data.results || []);
      } catch (error) {
        console.log(error);
      }
    };

    searchmovie();
  }, [search]);

  const handleSuggestion = (movie) => {
    const type = getMediaType(movie);
    navigate(`/content/${movie.id}/${type}`);
    setSearch("");
    setSearchoptions([]);
    setSearchbar(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Logo */}
        <NavLink to="/" className="logo">
          Flick<span className="accent">evo</span>
        </NavLink>

        {/* Desktop Navigation Links */}
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
            to="/genres"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Genres
          </NavLink>
          <NavLink
            to="/discussions"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Discussions
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Watchlist
          </NavLink>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Search Bar */}
          <div id="searchbarbar">
            <input
              type="text"
              placeholder="Search movies & shows..."
              className={searchbar ? "show" : "hide"}
              value={search}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
            />

            {searchbar && searchoptions.length > 0 && (
              <div className="search-suggestions">
                {searchoptions.map((movie) => (
                  <div
                    key={movie.id}
                    className="suggestion"
                    onClick={() => handleSuggestion(movie)}
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                          : "/no-poster.png"
                      }
                      alt={movie.title || movie.name}
                      className="suggestion-poster"
                    />

                    <div className="suggestion-info">
                      <h4>{movie.title || movie.name}</h4>
                      <div className="suggestion-meta">
                        <span>
                          {movie.release_date?.slice(0, 4) ||
                            movie.first_air_date?.slice(0, 4)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaStar className="text-amber-400 text-xs" />
                          {movie.vote_average?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className="suggestion suggestion-viewall"
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
                    setSearch("");
                    setSearchoptions([]);
                    setSearchbar(false);
                  }}
                >
                  See all results for "{search}"
                </div>
              </div>
            )}
          </div>

          {/* Search Toggle Button */}
          <button
            className="icon-btn"
            aria-label="Toggle searchbar"
            onClick={() => {
              const opening = !searchbar;
              setSearchbar(opening);
              if (!opening) {
                setSearch("");
                setSearchoptions([]);
              }
            }}
          >
            {searchbar ? <FaTimes className="text-base" /> : <FaSearch className="text-base" />}
          </button>

          {/* User Profile / Sign In (Desktop) */}
          <div className="header-user-desktop">
            {user ? (
              <div className="header-user">
                <NavLink to="/profile" className="header-profile-link" title="View Profile">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} className="header-avatar" />
                  ) : (
                    <div className="header-avatar-fallback">
                      {user.username?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="header-username">{user.username}</span>
                </NavLink>
                <button className="btn-signin" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            ) : (
              <button className="btn-signin" onClick={() => navigate('/login')}>
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop & Floating Dropdown Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-dropdown-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="mobile-dropdown-menu">
            <div className="mobile-dropdown-header">
              <span className="mobile-dropdown-label">Navigation</span>
              <span className="mobile-dropdown-dot" />
            </div>

            <div className="mobile-dropdown-links">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `mobile-dropdown-item ${isActive ? 'mobile-dropdown-item--active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="mobile-dropdown-icon-box">
                  <FaHome />
                </div>
                <span className="mobile-dropdown-title">Home</span>
                <FaChevronRight className="mobile-dropdown-arrow" />
              </NavLink>

              <NavLink
                to="/movies"
                className={({ isActive }) =>
                  `mobile-dropdown-item ${isActive ? 'mobile-dropdown-item--active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="mobile-dropdown-icon-box">
                  <FaFilm />
                </div>
                <span className="mobile-dropdown-title">Movies</span>
                <FaChevronRight className="mobile-dropdown-arrow" />
              </NavLink>

              <NavLink
                to="/shows"
                className={({ isActive }) =>
                  `mobile-dropdown-item ${isActive ? 'mobile-dropdown-item--active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="mobile-dropdown-icon-box">
                  <FaTv />
                </div>
                <span className="mobile-dropdown-title">TV Shows</span>
                <FaChevronRight className="mobile-dropdown-arrow" />
              </NavLink>

              <NavLink
                to="/genres"
                className={({ isActive }) =>
                  `mobile-dropdown-item ${isActive ? 'mobile-dropdown-item--active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="mobile-dropdown-icon-box">
                  <FaCompass />
                </div>
                <span className="mobile-dropdown-title">Genres</span>
                <FaChevronRight className="mobile-dropdown-arrow" />
              </NavLink>

              <NavLink
                to="/discussions"
                className={({ isActive }) =>
                  `mobile-dropdown-item ${isActive ? 'mobile-dropdown-item--active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="mobile-dropdown-icon-box">
                  <FaComments />
                </div>
                <span className="mobile-dropdown-title">Discussions</span>
                <FaChevronRight className="mobile-dropdown-arrow" />
              </NavLink>

              <NavLink
                to="/watchlist"
                className={({ isActive }) =>
                  `mobile-dropdown-item ${isActive ? 'mobile-dropdown-item--active' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="mobile-dropdown-icon-box">
                  <FaBookmark />
                </div>
                <span className="mobile-dropdown-title">Watchlist</span>
                <FaChevronRight className="mobile-dropdown-arrow" />
              </NavLink>
            </div>

            <div className="mobile-dropdown-divider" />

            <div className="mobile-dropdown-auth">
              {user ? (
                <div className="mobile-dropdown-user-group">
                  <NavLink
                    to="/profile"
                    className="mobile-dropdown-profile-row"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} className="mobile-dropdown-avatar" />
                    ) : (
                      <div className="mobile-dropdown-avatar-fallback">
                        {user.username?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="mobile-dropdown-user-details">
                      <span className="mobile-dropdown-username">{user.username}</span>
                      <span className="mobile-dropdown-subtext">View account profile</span>
                    </div>
                    <FaChevronRight className="mobile-dropdown-arrow" />
                  </NavLink>

                  <button
                    type="button"
                    className="mobile-dropdown-signout-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="mobile-dropdown-signin-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  <FaSignInAlt /> Sign In
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;