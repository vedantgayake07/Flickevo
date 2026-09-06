const tmdb = require("../services/tmdb.service")

// ==================== TRENDING ====================

const getTrending = async (req, res) => {
    const data = await tmdb.getTrending()

    res.status(200).json(data)
}


// ==================== MOVIES ====================

const getMovies = async (req, res) => {

    const { type } = req.query

    let data

    if (type === "top-rated") {
        data = await tmdb.getTopRatedMovies()
    }

    else if (type === "popular") {
        data = await tmdb.getPopularMovies()
    }

    else if (type === "upcoming") {
        data = await tmdb.getUpcomingMovies()
    }

    else {
        return res.status(400).json({
            message: "Invalid movie type"
        })
    }

    res.status(200).json(data)
}


// ==================== TV SHOWS ====================

const getShows = async (req, res) => {

    const { type } = req.query

    let data

    if (type === "current") {
        data = await tmdb.getCurrentShows()
    }

    else if (type === "trending") {
        data = await tmdb.getTrendingShows()
    }

    else if (type === "top-rated") {
        data = await tmdb.getTopRatedShows()
    }

    else if (type === "popular") {
        data = await tmdb.getPopularShows()
    }

    else {
        return res.status(400).json({
            message: "Invalid TV show type"
        })
    }

    res.status(200).json(data)
}


// ==================== SEARCH ====================

const searchContent = async (req, res) => {

    const { query } = req.query

    if (!query) {
        return res.status(400).json({
            message: "Search query is required"
        })
    }

    const data = await tmdb.searchContent(query)

    res.status(200).json(data)
}


// ==================== CONTENT DETAILS ====================

const getContentById = async (req, res) => {

    const { id, type } = req.params

    if (!id || !type) {
        return res.status(400).json({
            message: "Content id and type are required"
        })
    }

    if (type !== "movie" && type !== "tv") {
        return res.status(400).json({
            message: "Invalid content type"
        })
    }

    const data = await tmdb.getContentById(id, type)

    res.status(200).json(data)
}


// ==================== GENRES ====================

const getGenres = async (req, res) => {

    const { type } = req.params

    let data

    if (type === "movie") {
        data = await tmdb.getMovieGenres()
    }

    else if (type === "tv") {
        data = await tmdb.getTvGenres()
    }

    else {
        return res.status(400).json({
            message: "Invalid genre type"
        })
    }

    res.status(200).json(data)
}


module.exports = {
    getTrending,
    getMovies,
    getShows,
    searchContent,
    getContentById,
    getGenres
}