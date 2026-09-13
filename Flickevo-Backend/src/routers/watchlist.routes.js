const express = require("express")

const router = express.Router()

const {
    addToWatchList,
    getWatchList,
    removeFromWatchlist
} = require("../controllers/watchlist.controller")

const {
    authMiddleware
} = require("../middlewares/auth.middleware")


router.post(
    "/",
    authMiddleware,
    addToWatchList
)

router.get(
    "/",
    authMiddleware,
    getWatchList
)

router.delete(
    "/:id",
    authMiddleware,
    removeFromWatchlist
)


module.exports = router