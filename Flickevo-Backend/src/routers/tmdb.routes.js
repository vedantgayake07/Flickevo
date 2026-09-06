const { Router } = require("express")
const tmdbController = require("../controllers/tmdb.controller")

const router = Router()


// Trending
router.get("/trending", tmdbController.getTrending)


// Movies
router.get("/movies", tmdbController.getMovies)


// TV Shows
router.get("/tv", tmdbController.getShows)


// Search
router.get("/search", tmdbController.searchContent)


// Movie / TV Details
router.get("/:type/:id", tmdbController.getContentById)


// Genres
router.get("/genres/:type", tmdbController.getGenres)


module.exports = router