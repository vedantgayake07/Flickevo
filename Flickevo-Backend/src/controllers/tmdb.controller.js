const tmdbService = require("../services/tmdb.service")


async function getTrending(req, res) {

    try {

        const data = await tmdbService.getTrending()

        res.status(200).json(data)

    } catch (error) {

        res.status(500).json({
            message: "failed to fetch trending content"
        })
    }
}


async function getMovies(req, res) {

    try {

        const type = req.query.type

        let data

        if (type === "top-rated") {
            data = await tmdbService.getTopRatedMovies()
        }

        else if (type === "upcoming") {
            data = await tmdbService.getUpcomingMovies()
        }

        else {
            data = await tmdbService.getPopularMovies()
        }

        res.status(200).json(data)

    } catch (error) {

        res.status(500).json({
            message: "failed to fetch movies"
        })
    }
}


async function getTvShows(req, res) {

    try {

        const type = req.query.type

        let data

        if (type === "current") {
            data = await tmdbService.getCurrentShows()
        }

        else if (type === "trending") {
            data = await tmdbService.getTrendingShows()
        }

        else if (type === "top-rated") {
            data = await tmdbService.getTopRatedShows()
        }

        else {
            data = await tmdbService.getPopularShows()
        }

        res.status(200).json(data)

    } catch (error) {

        res.status(500).json({
            message: "failed to fetch tv shows"
        })
    }
}


async function searchContent(req, res) {

    try {

        const query = req.query.query
        const page = req.query.page || 1

        if (!query) {
            return res.status(400).json({
                message: "search query is required"
            })
        }

        const data =
            await tmdbService.searchContent(query, page)

        res.status(200).json(data)

    } catch (error) {

        res.status(500).json({
            message: "search failed"
        })
    }
}


async function getContent(req, res) {

    try {

        const { type, id } = req.params

        if (type !== "movie" && type !== "tv") {
            return res.status(400).json({
                message: "invalid content type"
            })
        }

        const data =
            await tmdbService.getContentById(type, id)

        res.status(200).json(data)

    } catch (error) {

        res.status(500).json({
            message: "failed to fetch content"
        })
    }
}


async function getGenres(req, res) {

    try {

        const type = req.params.type

        let data

        if (type === "movie") {
            data = await tmdbService.getMovieGenres()
        }

        else if (type === "tv") {
            data = await tmdbService.getTvGenres()
        }

        else {
            return res.status(400).json({
                message: "invalid genre type"
            })
        }

        res.status(200).json(data)

    } catch (error) {

        res.status(500).json({
            message: "failed to fetch genres"
        })
    }
}

async function discoverByGenre(req, res) {

    try {

        const { type } = req.params
        const { genreId, page } = req.query

        if(type !== "movie" && type !== "tv") {
            return res.status(400).json({
                message: "invalid content type"
            })
        }

        if(!genreId) {
            return res.status(400).json({
                message: "genreId is required"
            })
        }

        const data = await tmdbService.discoverByGenre(type, genreId, page || 1)

        res.status(200).json(data)

    } catch(error) {

        res.status(500).json({
            message: "failed to discover content"
        })
    }
}

async function getPerson(req, res) {
    try {
        const { id } = req.params
        const data = await tmdbService.getPersonById(id)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            message: "failed to fetch person details"
        })
    }
}


module.exports = {
    getTrending,
    getMovies,
    getTvShows,
    searchContent,
    getContent,
    getGenres,
    discoverByGenre,
    getPerson
}