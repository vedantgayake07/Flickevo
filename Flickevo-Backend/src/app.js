const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const authRoutes = require("./routers/auth.routes")
const tmdbRoutes = require("./routers/tmdb.routes")
const watchlistRoutes = require("./routers/watchlist.routes")
const discussionRoutes = require("./routers/discussion.routes")
const commentRoutes = require("./routers/comments.routes")
const userRoutes = require("./routers/user.routes")

const app = express()

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/tmdb", tmdbRoutes)
app.use("/api/watchlist", watchlistRoutes)
app.use("/api/discussions", discussionRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/users", userRoutes)

module.exports = app