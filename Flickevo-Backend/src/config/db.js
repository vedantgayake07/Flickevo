const mongoose = require("mongoose")

require("dns").setServers(["0.0.0.0", "8.8.8.8"])

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        console.log("Your Flickevo db is connected")
    } catch (error) {
        console.log("MongoDB connection failed:", error)

        throw error
    }
}

module.exports = connectDb