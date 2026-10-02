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
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaHome
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
          <div className="hidden sm:flex items-center gap-3">
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
            className="mobile-menu-btn md:hidden flex items-center justify-center p-2 rounded-lg text-flickText hover:text-flickCyan hover:bg-white/5 transition"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer md:hidden">
          <div className="mobile-drawer__links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `mobile-drawer__link ${isActive ? 'mobile-drawer__link--active' : ''}`
              }
            >
              <FaHome className="mobile-drawer__icon text-flickCyan" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/movies"
              className={({ isActive }) =>
                `mobile-drawer__link ${isActive ? 'mobile-drawer__link--active' : ''}`
              }
            >
              <FaFilm className="mobile-drawer__icon text-flickCyan" />
              <span>Movies</span>
            </NavLink>

            <NavLink
              to="/shows"
              className={({ isActive }) =>
                `mobile-drawer__link ${isActive ? 'mobile-drawer__link--active' : ''}`
              }
            >
              <FaTv className="mobile-drawer__icon text-flickCyan" />
              <span>TV Shows</span>
            </NavLink>

            <NavLink
              to="/genres"
              className={({ isActive }) =>
                `mobile-drawer__link ${isActive ? 'mobile-drawer__link--active' : ''}`
              }
            >
              <FaCompass className="mobile-drawer__icon text-flickCyan" />
              <span>Genres</span>
            </NavLink>

            <NavLink
              to="/discussions"
              className={({ isActive }) =>
                `mobile-drawer__link ${isActive ? 'mobile-drawer__link--active' : ''}`
              }
            >
              <FaComments className="mobile-drawer__icon text-flickCyan" />
              <span>Discussions</span>
            </NavLink>

            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                `mobile-drawer__link ${isActive ? 'mobile-drawer__link--active' : ''}`
              }
            >
              <FaBookmark className="mobile-drawer__icon text-flickCyan" />
              <span>Watchlist</span>
            </NavLink>
          </div>

          <div className="mobile-drawer__auth">
            {user ? (
              <div className="flex flex-col gap-3">
                <NavLink
                  to="/profile"
                  className="mobile-drawer__link"
                >
                  <FaUser className="mobile-drawer__icon text-flickCyan" />
                  <span>Profile ({user.username})</span>
                </NavLink>
                <button
                  type="button"
                  className="mobile-drawer__btn-signout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mobile-drawer__btn-signin"
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
      )}
    </header>
  );
};

export default Header;