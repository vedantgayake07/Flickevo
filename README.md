# 🎬 Flickevo

> A modern movie and TV series discovery platform built with React and the TMDB API.

Flickevo is a responsive movie and web-series discovery application that allows users to explore trending and popular content, search for movies and shows, and view detailed information about them.

The project focuses on building a clean, responsive frontend while working with a real-world REST API.

---

## ✨ Features

* 🎥 Browse trending movies and TV shows
* 🔥 Explore popular content
* 🔎 Search for movies and web series
* 📄 View detailed information about titles
* 🖼️ Display movie/show posters and backdrops
* 📱 Responsive UI for different screen sizes
* ⚡ Fast development and build using Vite
* 🧭 Client-side routing with React Router
* 🌐 REST API integration using Axios

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **HTML5**
* **CSS3**

### Libraries

* **React Router** — Application routing
* **Axios** — API requests
* **React Icons / Font Awesome** — Icons

### API

* **TMDB API** — Movie and TV show data

### Deployment

* **Vercel**

---

## 📂 Project Structure

```text
Flickevo-client/
│
├── public/
│
├── src/
│   ├── components/
│   │   └── Reusable UI components
│   │
│   ├── helpers/
│   │   └── Utility/helper functions
│   │
│   ├── layout/
│   │   └── Layout components
│   │
│   ├── pages/
│   │   └── Application pages
│   │
│   ├── services/
│   │   └── API and external service logic
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── package.json
├── vercel.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vedantgayake07/Flickevo.git
```

### 2. Navigate to the frontend

```bash
cd Flickevo/Flickevo-client
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `Flickevo-client` directory:

```env
VITE_TMDB_API=your_tmdb_api_url
VITE_HEADER=your_tmdb_bearer_token
```

> **Important:** Never commit your `.env` file or expose private API credentials in the repository.

### 5. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL shown in your terminal.

---

## 🔑 Environment Variables

| Variable        | Description                                       |
| --------------- | ------------------------------------------------- |
| `VITE_TMDB_API` | TMDB API base URL                                 |
| `VITE_HEADER`   | Authorization header/token used for TMDB requests |

For deployment, configure these variables through your hosting provider's environment-variable settings.

---

## 🔄 How It Works

Flickevo follows a simple frontend architecture:

```text
User
  ↓
React UI
  ↓
React Router
  ↓
Page Components
  ↓
Reusable Components
  ↓
API Service Layer
  ↓
Axios
  ↓
TMDB API
  ↓
Movie / TV Data
  ↓
React UI
```

The API-related logic is kept inside the `services` directory instead of placing API calls directly throughout the UI components.


---

## 🌐 Live Demo

**Live Website:** https://flickevo.vercel.app/

---

## 🔮 Future Improvements

Some features planned for future versions:

* [ ] Advanced movie and TV filters
* [ ] Genre-based browsing
* [ ] Movie trailers
* [ ] Cast and crew information
* [ ] User authentication
* [ ] Watchlist functionality
* [ ] Favorites
* [ ] User ratings and reviews
* [ ] Personalized recommendations
* [ ] Improved loading states and skeleton screens
* [ ] Dark/light theme support

---

## 🧠 What I Learned

Building Flickevo helped me practice:

* React component architecture
* React Hooks and state management
* React Router
* REST API integration
* Axios
* Working with external APIs
* Environment variables
* Responsive frontend development
* Error handling and loading states
* Deploying a React application with Vercel

---

## 👨‍💻 Author

**Vedant Gayake**

GitHub:
https://github.com/vedantgayake07

---

## 📄 License

This project is created for learning and portfolio purposes.

Movie and TV show data is provided by **TMDB**.

Flickevo is not affiliated with or endorsed by TMDB.
