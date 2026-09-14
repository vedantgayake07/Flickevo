import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonById } from "../services/apiClient";
import "./PersonDetails.css";

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCreditTab, setActiveCreditTab] = useState("all"); // 'all', 'movie', 'tv'

  useEffect(() => {
    async function loadPerson() {
      setLoading(true);
      setError("");
      try {
        const data = await getPersonById(id);
        setPerson(data);
      } catch (err) {
        console.error("Failed to load person", err);
        setError("Unable to load person details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadPerson();
  }, [id]);

  if (loading) {
    return <div className="person-loading">Loading cast information…</div>;
  }

  if (error || !person) {
    return (
      <div className="person-error">
        <h2>Person Not Found</h2>
        <p>{error || "Unable to display details."}</p>
        <button className="person-back-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }

  // Combined credits
  const castCredits = person.combined_credits?.cast || [];
  // Sort by popularity descending and deduplicate
  const sortedCredits = [...castCredits]
    .filter((c) => c.poster_path)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const filteredCredits =
    activeCreditTab === "all"
      ? sortedCredits
      : sortedCredits.filter((c) => c.media_type === activeCreditTab);

  const handleCreditClick = (item) => {
    const type = item.media_type || (item.first_air_date ? "tv" : "movie");
    navigate(`/content/${item.id}/${type}`);
  };

  return (
    <div className="person-page">
      <div className="person-hero">
        <div className="person-poster-wrap">
          <img
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : "/placeholder-person.jpg"
            }
            alt={person.name}
            className="person-poster"
          />
        </div>

        <div className="person-info">
          <span className="person-department-badge">
            {person.known_for_department || "Acting"}
          </span>
          <h1 className="person-name">{person.name}</h1>

          <div className="person-meta-grid">
            {person.birthday && (
              <div className="person-meta-item">
                <span className="person-meta-label">Born</span>
                <span className="person-meta-val">
                  {person.birthday}
                  {person.deathday ? ` (Died: ${person.deathday})` : ""}
                </span>
              </div>
            )}
            {person.place_of_birth && (
              <div className="person-meta-item">
                <span className="person-meta-label">Place of Birth</span>
                <span className="person-meta-val">{person.place_of_birth}</span>
              </div>
            )}
            {person.popularity != null && (
              <div className="person-meta-item">
                <span className="person-meta-label">Popularity</span>
                <span className="person-meta-val">{person.popularity.toFixed(1)}</span>
              </div>
            )}
          </div>

          {person.biography && (
            <div className="person-bio-section">
              <h3 className="person-section-heading">Biography</h3>
              <p className="person-biography">
                {person.biography.length > 700
                  ? `${person.biography.slice(0, 700)}…`
                  : person.biography}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filmography Section */}
      <section className="person-credits-section">
        <div className="person-credits-header">
          <h2 className="person-credits-title">Known For & Filmography</h2>

          <div className="person-credits-tabs">
            <button
              type="button"
              className={`person-tab-btn ${activeCreditTab === "all" ? "active" : ""}`}
              onClick={() => setActiveCreditTab("all")}
            >
              All ({sortedCredits.length})
            </button>
            <button
              type="button"
              className={`person-tab-btn ${activeCreditTab === "movie" ? "active" : ""}`}
              onClick={() => setActiveCreditTab("movie")}
            >
              Movies
            </button>
            <button
              type="button"
              className={`person-tab-btn ${activeCreditTab === "tv" ? "active" : ""}`}
              onClick={() => setActiveCreditTab("tv")}
            >
              TV Shows
            </button>
          </div>
        </div>

        {filteredCredits.length === 0 ? (
          <p className="person-no-credits">No media credits found.</p>
        ) : (
          <div className="person-credits-grid">
            {filteredCredits.slice(0, 30).map((item) => {
              const title = item.title || item.name;
              const date = item.release_date || item.first_air_date;
              const mediaType = item.media_type === "tv" ? "TV" : "Movie";

              return (
                <div
                  key={`${item.id}-${item.credit_id || item.character}`}
                  className="person-credit-card"
                  onClick={() => handleCreditClick(item)}
                >
                  <div className="person-credit-poster-wrap">
                    <img
                      src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                      alt={title}
                      className="person-credit-poster"
                      loading="lazy"
                    />
                    <span className="person-credit-type">{mediaType}</span>
                  </div>

                  <div className="person-credit-details">
                    <span className="person-credit-rating">
                      ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "-"}
                    </span>
                    <h4 className="person-credit-title">{title}</h4>
                    {item.character && (
                      <p className="person-credit-character">as {item.character}</p>
                    )}
                    {date && (
                      <span className="person-credit-year">{date.slice(0, 4)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default PersonDetails;
