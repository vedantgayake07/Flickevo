// Footer.jsx
import { NavLink } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-sprocket" aria-hidden="true" />
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo">Cin<span className="accent">evo</span></span>
          <p>Find out what's worth watching, together.</p>
          <span className="made-with">
            Made with{' '}
            <svg
              className="heart-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-label="love"
            >
              <path d="M12 21s-6.7-4.35-9.3-8.2C.9 10.1 1.4 6.7 4.2 5.1c2.2-1.25 4.8-.6 6.2 1.3l1.6 2 1.6-2c1.4-1.9 4-2.55 6.2-1.3 2.8 1.6 3.3 5 1.5 7.7C18.7 16.65 12 21 12 21z" />
            </svg>{' '}
            by Vedant
          </span>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Explore</h4>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/movies">Movies</NavLink>
            <NavLink to="/shows">Movies</NavLink>
            <NavLink to="/watchlist">Watchlist</NavLink>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <NavLink to="/discussions">Discussions</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Cinevo. Built for movie people.</span>
      </div>
    </footer>
  );
};

export default Footer;