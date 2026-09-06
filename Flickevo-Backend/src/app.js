const express = require("express")
const cors = require("cors")
const authRoutes = require("./routers/auth.routes")
const tmdbroutes = require("./routers/tmdb.routes")
const watchlistRoutes = require("./routers/watchlist.routes")
const discussionRoutes = require("./routers/discussion.routes")
const commentRouter = require("./routers/comments.routes")
const cookieparser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieparser())

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}

app.use(cors(corsOptions))

app.use("/api/auth", authRoutes)
app.use("/api/tmdb" ,  tmdbroutes)
app.use("/api/watchlist" , watchlistRoutes)
app.use("/api/discussion" , discussionRoutes)
app.use("/api/comment" , commentRouter)

module.exports = app