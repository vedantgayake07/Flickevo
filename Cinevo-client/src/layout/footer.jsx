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
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Explore</h4>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/movies">Movies</NavLink>
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