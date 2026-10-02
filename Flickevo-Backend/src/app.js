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

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://flickevo.vercel.app",
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true)

        const isAllowed =
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app")

        if (isAllowed) {
            return callback(null, true)
        }

        return callback(null, false)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}))

app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/tmdb", tmdbRoutes)
app.use("/api/watchlist", watchlistRoutes)
app.use("/api/discussions", discussionRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/users", userRoutes)

module.exports = app