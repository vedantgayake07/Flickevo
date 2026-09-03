const mongoose = require("mongoose")

const discussionSchema = new mongoose.Schema(
    {
        author: {
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
        },

        title: {
            type: String,
            required: [true, "discussion title is required"],
            trim: true
        },

        content: {
            type: String,
            required: [true, "discussion content is required"],
            trim: true
        }
    },
    {
        timestamps: true
    }
)

const discussionModel = mongoose.model("discussion", discussionSchema)

module.exports = discussionModel