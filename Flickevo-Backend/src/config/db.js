const mongoose = require("mongoose")
const dns = require("dns")

dns.setServers(["8.8.8.8"])

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        console.log("MongoDB connected")
    } catch (error) {
        console.log("MongoDB connection failed", error)
        throw error
    }
}

module.exports = connectDB