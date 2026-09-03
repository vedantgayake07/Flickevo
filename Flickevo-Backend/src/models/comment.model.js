const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        discussion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "discussion",
            required: true
        },

        content: {
            type: String,
            required: [true, "comment content is required"],
            trim: true
        }
    },
    {
        timestamps: true
    }
)

const commentModel = mongoose.model("comment", commentSchema)

module.exports = commentModel