const mongoose = require("mongoose")

const watchlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        mediaId: {
            type: Number,
            required: [true, "media id is needed"]
        },

        mediaType: {
            type: String,
            required: [true, "media type is needed"],
            enum: ["movie", "tv"]
        }
    },
    {
        timestamps: true
    }
)

// Prevent duplicate movie/show entries for the same user
watchlistSchema.index(
    {
        user: 1,
        mediaId: 1,
        mediaType: 1
    },
    {
        unique: true
    }
)

const watchlistModel = mongoose.model("watchlist", watchlistSchema)

module.exports = watchlistModel