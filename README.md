# 🎬 FLICKEVO

<div align="center">

  <h3>A Community-Driven Cinema Discovery & Discussion Platform</h3>

  <p>
    <em>"Know what's worth watching before you press play."</em>
  </p>

  <p>
    <a href="https://flickevo.vercel.app/"><strong>Explore the Live Application »</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
  </p>

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Visual Design & Aesthetic](#-visual-design--aesthetic)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Directory Structure](#-directory-structure)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Authors & Acknowledgments](#-authors--acknowledgments)
- [License](#-license)

---

## 🌟 Overview

**Flickevo** is a full-stack, community-centric movie and television discovery platform built for cinephiles. Drawing inspiration from editorial cinema hubs like *The Criterion Channel*, *Letterboxd*, and *A24*, Flickevo pairs real-time catalog data from TMDB with an interactive social forum where users discuss releases, share insights, manage personal watchlists, and explore curated cinematic movements.

Instead of generic, neon-saturated layouts, Flickevo adopts a **warm 35mm film aesthetic** with deep charcoal backgrounds, warm amber accents, and editorial typography.

---

## ✨ Key Features

### 🎞️ Movie & TV Discovery
* **Trending & Popular**: Real-time trending feeds, now playing in theaters, top-rated classics, and airing-today TV broadcasts.
* **Instant Search Autocomplete**: Header search bar with debounced live suggestions, media poster previews, ratings, and dedicated search result pages with pagination.
* **Rich Content Pages**: Detailed synopsis, release years, runtimes, certifications, seasons/episodes, genres, and production companies.
* **Official YouTube Trailers**: Direct in-app trailer playback via an immersive modal player.

### 💬 Cinephile Community Discussions
* **Community Forum**: Browse active discussions or create new threads directly linked to specific movies or TV series.
* **Discussion Threads**: Rich text discussions with nested comments, timestamps, and author badges.
* **Interactive Media Linking**: Search and attach any movie or show from TMDB when initiating a discussion.

### 📌 Curated Personal Watchlist
* **Persistent Sync**: Save films and series to a personal watchlist backed by MongoDB.
* **Compact Responsive Grid**: Native 3-column mobile layout and auto-fill desktop grid with proportional poster sizing.
* **Filter Tabs**: Instant client-side switching between **All**, **Movies**, and **TV Shows** with live title counts.
* **One-Click Removal**: Effortlessly manage and prune your saved catalog.

### 🎭 Curated Genre Archive
* **Film Movement Showcase**: Browse genres through curated editorial profiles (e.g., *Film Noir*, *Cyberpunk*, *French New Wave*, *Psychological Thriller*).
* **Dynamic Genre Results**: Instant filtering of movies and shows with full pagination.

### 👥 Cast & Crew Filmographies
* **Person Details**: Actor and director profiles with biographies, birthplaces, and department badges.
* **Filmography Tabs**: Tabbed breakdown of acting, directing, and production credits with poster cards and rating scores.

### 🔐 Secure Authentication & Profile Customization
* **Username-Only Auth**: Fast, friction-free login and registration using case-insensitive unique usernames (no email requirement).
* **Dual JWT Persistence**: Secure short-lived access tokens and refresh tokens with auto-renewal and cold-start session preservation on page reloads.
* **Profile Customization**: Update bio, custom profile pictures via cloud image storage, and view discussion history and account statistics.

### 📱 100% Mobile Responsive
* **Adaptive Navigation**: Viewport-anchored floating dropdown menu on mobile and tablets.
* **Overlay Search**: Collapsible search overlay that prevents horizontal clipping down to 320px viewport widths.

---

## 🎨 Visual Design & Aesthetic

Flickevo avoids synthetic, AI-generated neon palettes in favor of human-crafted film aesthetics:

| Token | Color Code | Purpose |
| :--- | :--- | :--- |
| **Film Charcoal (Bg)** | `#0d0e12` | Deep cinema backdrop, reduces eye strain |
| **Surface Elevation** | `#15171e` / `#1c1e27` | Layered cards, dropdowns, and modal dialogs |
| **Projector Amber** | `#f3b236` | Warm 35mm projector light accent |
| **Amber Glow** | `rgba(243, 178, 54, 0.14)` | Soft interactive glows and badge fills |
| **Bone Off-White** | `#f5f3ee` | High-contrast, editorial body typography |
| **Muted Slate** | `#9ea2ad` | Secondary metadata, dates, and runtimes |

**Typography**:
- **Display**: [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) — Cinematic headlines and poster titles.
- **Body**: [Inter](https://fonts.google.com/specimen/Inter) — Clean, highly readable interface copy.
- **Monospace**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — Ratings, badges, timestamps, and metadata.

---

## 🛠️ Tech Stack

### Frontend
- **Core**: React 19, JavaScript (ESNext), HTML5
- **Build Tool**: Vite 8 (Ultra-fast HMR and optimized production bundles)
- **Styling**: TailwindCSS 3 + Modular Vanilla CSS Design System
- **Icons**: React Icons (`react-icons/fa`) & FontAwesome
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with global interceptors

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), bcryptjs password hashing
- **File Uploads**: ImageKit SDK / Cloud storage
- **Security & Utilities**: CORS, cookie-parser, dotenv

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       Client (Vite + React)                 │
│  - React Router DOM   - Context Providers (Auth, Watchlist) │
│  - TMDB Discovery UI  - Discussion Forum & Profile Pages    │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
        Direct Data Fetch                Authenticated REST API
               │                               │
               ▼                               ▼
     ┌───────────────────┐          ┌──────────────────────┐
     │     TMDB API      │          │   Express Backend    │
     │  (Movies, Shows,  │          │   - Auth Controller  │
     │   Credits, Cast)  │          │   - Watchlist Engine │
     └───────────────────┘          │   - Forum / Comments │
                                    └──────────┬───────────┘
                                               │
                                    ┌──────────┴───────────┐
                                    ▼                      ▼
                           ┌─────────────────┐   ┌───────────────────┐
                           │ MongoDB Atlas   │   │   ImageKit Cloud  │
                           │  - Users        │   │  (Avatar Uploads) │
                           │  - Discussions  │   └───────────────────┘
                           │  - Comments     │
                           │  - Watchlists   │
                           └─────────────────┘
```

---

## 📂 Directory Structure

```text
Flickevo/
├── Flickevo-client/               # Frontend React Application
│   ├── public/                    # Static public assets
│   ├── src/
│   │   ├── components/            # Reusable UI components (PosterSlider, etc.)
│   │   ├── context/               # React Contexts (AuthContext, WatchlistContext)
│   │   ├── helpers/               # Client-side utility functions
│   │   ├── layout/                # Global Header, Footer, Layout shells
│   │   ├── pages/                 # Route pages (Home, Movies, Shows, WatchList,
│   │   │                          #  Genres, ContentPage, Discussions, Profile, etc.)
│   │   ├── services/              # API clients (TMDB client, backend client)
│   │   ├── styles/                # Component & page stylesheets
│   │   ├── App.jsx                # Route definitions & application wrapper
│   │   ├── index.css              # Design system tokens & Tailwind imports
│   │   └── main.jsx               # Application entry point
│   ├── tailwind.config.js         # Tailwind theme & color extensions
│   ├── vite.config.js             # Vite configuration
│   └── package.json
│
├── Flickevo-Backend/              # REST API Backend
│   ├── src/
│   │   ├── config/                # Database & ImageKit configurations
│   │   ├── controllers/           # Request controllers (auth, user, watchlist, etc.)
│   │   ├── middlewares/           # Auth verification & error handlers
│   │   ├── models/                # Mongoose database schemas
│   │   ├── routers/               # Express route definitions
│   │   ├── services/              # Business logic & 3rd-party services
│   │   └── app.js                 # Express application setup & middleware stack
│   ├── server.js                  # Server entry point
│   └── package.json
│
└── README.md
```

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new account with unique username | No |
| `POST` | `/api/auth/login` | Login with username and password | No |
| `POST` | `/api/auth/refresh` | Renew access token using refresh token | No |
| `POST` | `/api/auth/logout` | Invalidate active session | Yes |

### User Profile (`/api/user`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Get current logged-in user profile | Yes |
| `PUT` | `/api/user/profile` | Update profile bio, avatar image, or info | Yes |

### Watchlist (`/api/watchlist`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/watchlist` | Retrieve all items saved in user's watchlist | Yes |
| `POST` | `/api/watchlist/toggle` | Add or remove a title from watchlist | Yes |

### Discussions & Comments (`/api/discussion`, `/api/comments`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/discussion` | List recent discussions with pagination | No |
| `GET` | `/api/discussion/:id` | Get discussion details and associated media | No |
| `POST` | `/api/discussion` | Create a new movie/show discussion topic | Yes |
| `GET` | `/api/comments/:discussionId`| Fetch all comments for a discussion | No |
| `POST` | `/api/comments` | Post a new comment on a discussion | Yes |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- [TMDB Account](https://www.themoviedb.org/) (To generate a free API Read Access Token)

---

### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd Flickevo-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `Flickevo-Backend/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/flickevo?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/
   CORS_ORIGIN=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm start
   # or with nodemon:
   node server.js
   ```
   *The backend will boot up on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a new terminal tab and navigate to the client folder:
   ```bash
   cd Flickevo-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `Flickevo-client/`:
   ```env
   VITE_TMDB_API=https://api.themoviedb.org/3
   VITE_HEADER=Bearer YOUR_TMDB_READ_ACCESS_TOKEN
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will be running at `http://localhost:5173`.*

---

## 🔑 Environment Variables Reference

### Backend (`Flickevo-Backend/.env`)
| Variable | Required | Description |
| :--- | :--- | :--- |
| `PORT` | No | Server port (defaults to `5000`) |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Secret key for signing short-lived access tokens |
| `JWT_REFRESH_SECRET` | **Yes** | Secret key for signing refresh tokens |
| `IMAGEKIT_PUBLIC_KEY` | No | ImageKit public key for avatar image uploads |
| `IMAGEKIT_PRIVATE_KEY` | No | ImageKit private key for secure uploads |
| `IMAGEKIT_URL_ENDPOINT` | No | ImageKit URL endpoint |
| `CORS_ORIGIN` | No | Allowed frontend origin (e.g. `http://localhost:5173`) |

### Frontend (`Flickevo-client/.env`)
| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_TMDB_API` | **Yes** | Base URL for TMDB API (`https://api.themoviedb.org/3`) |
| `VITE_HEADER` | **Yes** | Bearer authorization header with your TMDB API token |
| `VITE_BACKEND_URL` | **Yes** | URL pointing to your backend server instance |

---

## 👨‍💻 Authors & Acknowledgments

- **Vedant Gayake** — [GitHub Profile](https://github.com/vedantgayake07)

**Special Thanks & Acknowledgments**:
- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing access to movie, TV, and cast catalog data.
- Design inspiration from [The Criterion Channel](https://www.criterionchannel.com/), [Letterboxd](https://letterboxd.com/), and [A24](https://a24films.com/).

---

## 📄 License

This project is open-source and created for educational and portfolio purposes.

> **Disclaimer**: *Flickevo is not affiliated with, endorsed by, or sponsored by TMDB. Movie and TV media assets, images, and metadata are the property of their respective copyright holders.*
