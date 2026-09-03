const express = require("express")
const cors = require("cors")
const authRoutes = require("./routers/auth.routes")
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

module.exports = app