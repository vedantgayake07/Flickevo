// Header.jsx
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          Cin<span className="accent">evo</span>
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
            to="/watchlist"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Watchlist
          </NavLink>
        </nav>

        <div className="header-actions">
          <button className="icon-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button className="btn-signin">Sign in</button>
        </div>
      </div>
    </header>
  );
};

export default Header;