import axios from "axios";

const api = import.meta.env.VITE_BACKEND_URL;

const fetchApi = async (endpoint) => {
  try {
    const response = await axios.get(`${api}/tmdb${endpoint}`);
    return response;
  } catch (error) {
    console.log("API Error:", error);
    throw error;
  }
};


// ================= MOVIES =================

export const getTrending = async () => {
  const response = await fetchApi("/trending");
  return response.data;
};

export const getToprated = async () => {
  const response = await fetchApi("/movies?type=top-rated");
  return response.data;
};

export const getPopular = async () => {
  const response = await fetchApi("/movies?type=popular");
  return response.data;
};

export const getUpcoming = async () => {
  const response = await fetchApi("/movies?type=upcoming");
  return response.data;
};


// ================= TV SHOWS =================

export const getCurrentShows = async () => {
  const response = await fetchApi("/tv?type=current");
  return response.data;
};

export const getTrendingShows = async () => {
  const response = await fetchApi("/tv?type=trending");
  return response.data;
};

export const getTopratedShows = async () => {
  const response = await fetchApi("/tv?type=top-rated");
  return response.data;
};

export const getPopularShows = async () => {
  const response = await fetchApi("/tv?type=popular");
  return response.data;
};


// ================= SEARCH =================

export const searchMovie = async (query, page = 1) => {
  return await fetchApi(`/search?query=${encodeURIComponent(query)}&page=${page}`);
};


// ================= DETAILS =================

export const getContentById = async (id, type) => {
  const response = await fetchApi(`/${type}/${id}`);
  return response.data;
};


// ================= GENRES =================

export const getMovieGenres = async () => {
  const response = await fetchApi("/genres/movie");
  return response.data; // { genres: [{ id, name }, ...] }
};

export const getTvGenres = async () => {
  const response = await fetchApi("/genres/tv");
  return response.data;
};

export const discoverByGenre = async (type, genreId, page = 1) => {
  const response = await fetchApi(`/discover/${type}?genreId=${genreId}&page=${page}`);
  return response.data;
};