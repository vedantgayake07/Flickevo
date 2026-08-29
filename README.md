# FlickEvo

**FlickEvo** is a modern, responsive web application for discovering movies and TV shows, powered by the TMDB (The Movie Database) API. Built with a dark-mode cinematic aesthetic, it allows users to explore trending content, view detailed statistics about movies and TV series, and discover top-rated media.

---

## Features Built So Far

* **Dynamic Home & Hero Banner:**
* Interactive mosaic hero background generated from real-time trending media posters.


* Modern design layout highlighting featured titles and community-driven discovery.




* **Comprehensive Movie & TV Show Discovery:**
* Browse trending daily content, top-rated movies/shows, popular items, and upcoming releases.


* Horizontal scrolling poster carousels (`PosterSlider`) with smooth navigation controls and subtle edge fades.




* **Detailed Media Pages (`MovieDetails` & `ShowDetails`):**
* **Movie Views:** Visual hero section featuring poster artwork, rating averages, vote counts, runtime, release date, revenue, budget, genres, and official website links.


* **TV Show Views:** Specialized metadata section displaying season counts, episode metrics, original networks, creators, show status, and type.




* **UX & Navigation Enhancements:**
* Clean route switching managed via React Router DOM.


* Automatic page scroll reset on route changes (`ScrollToTop`).


* Reusable routing utility (`getDetailsPath`) for unified navigation across movies and TV series.




* **Placeholder Watchlist Module:**
* Initial scaffolding for a user watchlist page ready for upcoming state/backend integration.





---

## Tech Stack

* **Frontend Framework:** React (Vite)


* **Routing:** `react-router-dom`

* **HTTP Client:** `axios`

* **Styling:** Vanilla CSS with custom properties/variables, CSS Grid, Flexbox, and custom animations


* **Data Source:** TMDB API (The Movie Database)



---

## Project Structure

```text
src/
├── components/
│   ├── MovieCard.jsx         # Detailed movie hero layout
│   ├── showCard.jsx          # Detailed TV show hero layout
│   ├── posterSlider.jsx      # Multi-item horizontal carousel
│   └── scrollToTop.jsx       # Route change scroll reset utility
├── helpers/
│   └── getDetailsPath.jsx    # Media route builder helper
├── layout/
│   ├── appLayout.jsx         # Main layout wrapper (Header, Outlet, Footer)
│   ├── header.jsx            # Application header navigation
│   └── footer.jsx            # Application footer component
├── pages/
│   ├── home.jsx              # Landing page with hero mosaic & shelves
│   ├── movieDetails.jsx      # Movie details container page
│   ├── showDetails.jsx       # TV show details container page
│   └── watchList.jsx         # Watchlist placeholder view
└── services/
    └── apiClient.jsx         # TMDB API service layer

```

---

## Setup & Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/flickevo.git
cd flickevo

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env` file in the root directory and add your TMDB credentials:


```env
VITE_TMDB_API=https://api.themoviedb.org/3
VITE_HEADER=Bearer YOUR_TMDB_READ_ACCESS_TOKEN

```


4. **Run the development server:**
```bash
npm run dev

```



* [ ] Implement user ratings and review submission forms.
