const express = require("express")

const router = express.Router()

const {
    getTrending,
    getMovies,
    getTvShows,
    searchContent,
    getContent,
    getGenres,
    discoverByGenre,
    getPerson
} = require("../controllers/tmdb.controller")


router.get("/trending", getTrending)

router.get("/movies", getMovies)

router.get("/tv", getTvShows)

router.get("/search", searchContent)

router.get("/genres/:type", getGenres)

router.get("/discover/:type", discoverByGenre)   

router.get("/person/:id", getPerson)

router.get("/:type/:id", getContent)             


module.exports = router