const {Router} = require("express")
const WatchListController = require("../controllers/watchlist.controller")
const AuthMiddleware = require("../middlewares/auth.middleware")

const watchlistRoutes = Router()

watchlistRoutes.get("/", AuthMiddleware.authMiddleware , WatchListController.getWatchList)

watchlistRoutes.delete("/:id" , AuthMiddleware.authMiddleware , WatchListController.removeFromWatchlist)

watchlistRoutes.post("/" , AuthMiddleware.authMiddleware , WatchListController.addToWatchList)

module.exports = watchlistRoutes