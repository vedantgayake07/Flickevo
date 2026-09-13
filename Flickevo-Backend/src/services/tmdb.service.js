const axios = require("axios")

const fetchTmdb = async (endpoint) => {

    const response = await axios.get(
        `${process.env.TMDB_API}${endpoint}`,
        {
            headers: {
                Authorization: process.env.TMDB_HEADER,
                accept: "application/json"
            },

            timeout: 15000,

            family: 4
        }
    )

    return response.data
}


const getTrending = async () => {
    return await fetchTmdb("/trending/all/week")
}


const getPopularMovies = async () => {
    return await fetchTmdb("/movie/popular")
}


const getTopRatedMovies = async () => {
    return await fetchTmdb("/movie/top_rated")
}


const getUpcomingMovies = async () => {
    return await fetchTmdb("/movie/upcoming")
}


const getCurrentShows = async () => {
    return await fetchTmdb("/tv/on_the_air")
}


const getTrendingShows = async () => {
    return await fetchTmdb("/trending/tv/week")
}


const getPopularShows = async () => {
    return await fetchTmdb("/tv/popular")
}


const getTopRatedShows = async () => {
    return await fetchTmdb("/tv/top_rated")
}


const searchContent = async (query) => {

    return await fetchTmdb(
        `/search/multi?query=${encodeURIComponent(query)}`
    )
}


const getContentById = async (type, id) => {

    return await fetchTmdb(
        `/${type}/${id}?append_to_response=credits,videos,watch/providers`
    )
}


const getMovieGenres = async () => {
    return await fetchTmdb("/genre/movie/list")
}


const getTvGenres = async () => {
    return await fetchTmdb("/genre/tv/list")
}


module.exports = {
    getTrending,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getCurrentShows,
    getTrendingShows,
    getPopularShows,
    getTopRatedShows,
    searchContent,
    getContentById,
    getMovieGenres,
    getTvGenres
}