import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMovieGenres, getTvGenres } from "../services/apiClient";
import { FaSearch, FaTimes, FaFilm, FaTv, FaArrowRight } from "react-icons/fa";
import "../styles/Genres.css";

// Curated cinematic visual profiles for each genre (Zero AI clichés, pure cinephile curation)
const GENRE_PROFILES = {
  Action: {
    code: "01 / ACT",
    bg: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    subgenres: "High-Octane • Martial Arts • Spy Thriller",
    accent: "#ff4d4d",
  },
  "Action & Adventure": {
    code: "02 / A&A",
    bg: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&w=800&q=80",
    subgenres: "Expeditions • Quests • Survival",
    accent: "#fb923c",
  },
  Adventure: {
    code: "03 / ADV",
    bg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    subgenres: "Wild Frontiers • Archaeological • Odysseys",
    accent: "#f59e0b",
  },
  Animation: {
    code: "04 / ANI",
    bg: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    subgenres: "Anime • 3D CGI • Hand-Drawn Classics",
    accent: "#c084fc",
  },
  Comedy: {
    code: "05 / COM",
    bg: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80",
    subgenres: "Satire • Dark Comedy • Slapstick & Parody",
    accent: "#fde047",
  },
  Crime: {
    code: "06 / CRM",
    bg: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80",
    subgenres: "Neo-Noir • Organized Crime • Heist",
    accent: "#94a3b8",
  },
  Documentary: {
    code: "07 / DOC",
    bg: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    subgenres: "Investigative • Nature & Cosmos • Social History",
    accent: "#34d399",
  },
  Drama: {
    code: "08 / DRM",
    bg: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
    subgenres: "Character Studies • Period Pieces • Courtroom",
    accent: "#60a5fa",
  },
  Family: {
    code: "09 / FAM",
    bg: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    subgenres: "Coming-of-Age • Whimsical • Multi-Generational",
    accent: "#f472b6",
  },
  Fantasy: {
    code: "10 / FNT",
    bg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    subgenres: "High Fantasy • Myth & Lore • Dark Tales",
    accent: "#a78bfa",
  },
  History: {
    code: "11 / HST",
    bg: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80",
    subgenres: "Biopics • Historical Epics • Archival Chronicles",
    accent: "#fbbf24",
  },
  Horror: {
    code: "12 / HOR",
    bg: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80",
    subgenres: "Psychological • Cosmic Dread • Slasher",
    accent: "#ef4444",
  },
  Music: {
    code: "13 / MUS",
    bg: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    subgenres: "Musicals • Concert Films • Biographies",
    accent: "#f43f5e",
  },
  Mystery: {
    code: "14 / MYS",
    bg: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    subgenres: "Whodunits • Conspiracies • Detective Fiction",
    accent: "#38bdf8",
  },
  Romance: {
    code: "15 / ROM",
    bg: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    subgenres: "Romantic Drama • Melodrama • Indie Romance",
    accent: "#fb7185",
  },
  "Science Fiction": {
    code: "16 / SCI",
    bg: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    subgenres: "Cyberpunk • Space Opera • AI & Time Travel",
    accent: "#22d3ee",
  },
  "Sci-Fi & Fantasy": {
    code: "17 / S&F",
    bg: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    subgenres: "Parallel Dimensions • World-Building • Speculative",
    accent: "#38bdf8",
  },
  "TV Movie": {
    code: "18 / TVM",
    bg: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80",
    subgenres: "Special Events • Anthology Films • Broadcasts",
    accent: "#818cf8",
  },
  Thriller: {
    code: "19 / THL",
    bg: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    subgenres: "Psychological Thrillers • Political • Techno",
    accent: "#2dd4bf",
  },
  War: {
    code: "20 / WAR",
    bg: "https://images.unsplash.com/photo-1579965342575-16428a7c8881?auto=format&fit=crop&w=800&q=80",
    subgenres: "Combat Realism • Anti-War • Historic Battles",
    accent: "#a8a29e",
  },
  "War & Politics": {
    code: "21 / W&P",
    bg: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    subgenres: "Statecraft • Geopolitics • Propaganda",
    accent: "#94a3b8",
  },
  Western: {
    code: "22 / WST",
    bg: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    subgenres: "Spaghetti Western • Frontier • Revisionist",
    accent: "#ea580c",
  },
  Reality: {
    code: "23 / RLT",
    bg: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    subgenres: "Docuseries • Competitions • Unscripted",
    accent: "#e879f9",
  },
  News: {
    code: "24 / NWS",
    bg: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
    subgenres: "Current Affairs • Investigation • Global Reports",
    accent: "#38bdf8",
  },
  Talk: {
    code: "25 / TLK",
    bg: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    subgenres: "Late Night • In-Depth Interviews • Panels",
    accent: "#facc15",
  },
  Kids: {
    code: "26 / KDS",
    bg: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80",
    subgenres: "Early Childhood • Educational • Animated Series",
    accent: "#38bdf8",
  },
  Soap: {
    code: "27 / SOP",
    bg: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    subgenres: "Daily Dramas • Melodrama • Family Dynasties",
    accent: "#f472b6",
  },
};

const DEFAULT_PROFILE = {
  code: "00 / CIN",
  bg: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  subgenres: "Feature Film • Curated Cinema",
  accent: "#64def5",
};

const Genres = () => {
  const [activeTab, setActiveTab] = useState("movie"); // 'movie' or 'tv'
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllGenres() {
      try {
        const [mRes, tRes] = await Promise.all([
          getMovieGenres(),
          getTvGenres(),
        ]);
        setMovieGenres(mRes.genres || []);
        setTvGenres(tRes.genres || []);
      } catch (error) {
        console.error("Failed to load genres", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllGenres();
  }, []);

  const handleGenreClick = (genre) => {
    navigate(`/genre/${activeTab}/${genre.id}?name=${encodeURIComponent(genre.name)}`);
  };

  const currentList = activeTab === "movie" ? movieGenres : tvGenres;

  const filteredGenres = useMemo(() => {
    if (!search.trim()) return currentList;
    const q = search.toLowerCase();
    return currentList.filter((g) => g.name.toLowerCase().includes(q));
  }, [currentList, search]);

  return (
    <div className="genres-page">
      {/* Editorial Header Hero */}
      <div className="genres-hero">
        <div className="genres-hero__eyebrow">
          <span className="genres-hero__pulse" />
          The Cinematheque Archive
        </div>
        <h1 className="genres-hero__title">Explore by Genre & Movement</h1>
        <p className="genres-hero__sub">
          Delve into cinema through cinematic traditions, visual movements, and storytelling forms.
          Select a category to uncover acclaimed titles and hidden gems.
        </p>

        {/* Toolbar: Category Switcher & Filter */}
        <div className="genres-toolbar">
          <div className="genres-tabs">
            <button
              type="button"
              className={`genres-tab ${activeTab === "movie" ? "genres-tab--active" : ""}`}
              onClick={() => setActiveTab("movie")}
            >
              <FaFilm className="inline mr-1.5 text-xs" /> Feature Films ({movieGenres.length})
            </button>
            <button
              type="button"
              className={`genres-tab ${activeTab === "tv" ? "genres-tab--active" : ""}`}
              onClick={() => setActiveTab("tv")}
            >
              <FaTv className="inline mr-1.5 text-xs" /> Television Series ({tvGenres.length})
            </button>
          </div>

          <div className="genres-search-wrap">
            <FaSearch className="genres-search-icon text-xs text-flickMuted" />
            <input
              type="text"
              className="genres-search-input"
              placeholder="Filter movements & genres..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="genres-search-clear flex items-center justify-center"
                onClick={() => setSearch("")}
                aria-label="Clear filter"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="genres-loading">
          <span className="genres-spinner" />
          Loading cinematheque archive…
        </div>
      ) : filteredGenres.length === 0 ? (
        <div className="genres-empty">
          <p>No genre archive found matching "{search}".</p>
          <button type="button" className="btn btn-secondary" onClick={() => setSearch("")}>
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="genres-grid">
          {filteredGenres.map((genre) => {
            const profile = GENRE_PROFILES[genre.name] || DEFAULT_PROFILE;

            return (
              <div
                key={genre.id}
                className="genre-card"
                style={{
                  "--genre-accent": profile.accent,
                }}
                onClick={() => handleGenreClick(genre)}
              >
                {/* Atmospheric Photography Backdrop */}
                <div
                  className="genre-card__bg"
                  style={{ backgroundImage: `url(${profile.bg})` }}
                />
                <div className="genre-card__gradient" />

                {/* Top Bar: Code Index & Format Badge */}
                <div className="genre-card__top">
                  <span className="genre-card__code">{profile.code}</span>
                  <span className="genre-card__format">
                    {activeTab === "movie" ? "Cinema" : "Series"}
                  </span>
                </div>

                {/* Content: Title & Subgenres */}
                <div className="genre-card__body">
                  <h3 className="genre-card__title">{genre.name}</h3>
                  <p className="genre-card__subgenres">{profile.subgenres}</p>
                </div>

                {/* Footer Action */}
                <div className="genre-card__footer">
                  <span className="genre-card__explore flex items-center gap-1.5">
                    Browse Archive
                    <FaArrowRight className="genre-card__arrow text-xs" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Genres;
