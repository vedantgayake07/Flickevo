const axios = require("axios")

const fetchTmdb = async (endpoint) => {
    const response = await axios.get(
        `${process.env.TMDB_API}${endpoint}`,
        {
            headers: {
                Authorization: process.env.TMDB_HEADER,
                accept: "application/json"
            }
        }
    )

    return response.data
}


// ==================== MOVIES ====================

const getTrending = async () => {
    return await fetchTmdb("/trending/all/day")
}

const getTopRatedMovies = async () => {
    return await fetchTmdb(
        "/movie/top_rated?language=en-IN&region=IN"
    )
}

const getPopularMovies = async () => {
    return await fetchTmdb(
        "/movie/now_playing?language=en-IN&region=IN"
    )
}

const getUpcomingMovies = async () => {
    return await fetchTmdb(
        "/discover/movie?language=en-IN&with_origin_country=IN&sort_by=popularity.desc"
    )
}


// ==================== TV SHOWS ====================

const getCurrentShows = async () => {
    return await fetchTmdb("/tv/airing_today")
}

const getTrendingShows = async () => {
    return await fetchTmdb(
        "/trending/tv/day?language=en-US"
    )
}

const getTopRatedShows = async () => {
    return await fetchTmdb(
        "/tv/top_rated?language=en-IN&page=1"
    )
}

const getPopularShows = async () => {
    return await fetchTmdb(
        "/tv/popular?language=en-IN&with_origin_country=IN"
    )
}


// ==================== SEARCH ====================

const searchContent = async (query) => {
    return await fetchTmdb(
        `/search/multi?query=${encodeURIComponent(query)}`
    )
}


// ==================== DETAILS ====================

const getContentById = async (id, type) => {
    return await fetchTmdb(
        `/${type}/${id}?append_to_response=credits,watch/providers,videos`
    )
}


// ==================== GENRES ====================

const getMovieGenres = async () => {
    return await fetchTmdb(
        "/genre/movie/list?language=en"
    )
}

const getTvGenres = async () => {
    return await fetchTmdb(
        "/genre/tv/list?language=en"
    )
}


module.exports = {
    getTrending,
    getTopRatedMovies,
    getPopularMovies,
    getUpcomingMovies,

    getCurrentShows,
    getTrendingShows,
    getTopRatedShows,
    getPopularShows,

    searchContent,
    getContentById,

    getMovieGenres,
    getTvGenres
}