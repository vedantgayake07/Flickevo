const discussionModel = require("../models/discussion.model")
const commentModel = require("../models/comment.model")


async function createDiscussion(req, res) {
    try {
        const userId = req.user.id
        const {
            mediaId,
            mediaType,
            mediaTitle,
            mediaPoster,
            title,
            content
        } = req.body

        if (
            !mediaId ||
            !mediaType ||
            !title ||
            !content
        ) {
            return res.status(400).json({
                message: "mediaId, mediaType, title and content are required"
            })
        }

        const discussion = await discussionModel.create({
            author: userId,
            mediaId: Number(mediaId),
            mediaType,
            mediaTitle: mediaTitle || "",
            mediaPoster: mediaPoster || "",
            title: title.trim(),
            content: content.trim()
        })

        const populated = await discussionModel
            .findById(discussion._id)
            .populate("author", "username profilePicture")

        res.status(201).json({
            message: "discussion created",
            discussion: populated
        })
    } catch (error) {
        console.log("CREATE DISCUSSION ERROR:", error)
        return res.status(500).json({
            message: "failed to create discussion",
            error: error.message
        })
    }
}


async function getDiscussions(req, res) {
    try {
        const { mediaId, mediaType, author, search } = req.query
        const filter = {}

        if (mediaId) {
            filter.mediaId = Number(mediaId)
        }
        if (mediaType) {
            filter.mediaType = mediaType
        }
        if (author) {
            filter.author = author
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { mediaTitle: { $regex: search, $options: "i" } }
            ]
        }

        const discussions = await discussionModel
            .find(filter)
            .populate("author", "username profilePicture")
            .sort({ createdAt: -1 })

        // Aggregate comment counts for the found discussions
        const discussionIds = discussions.map(d => d._id)
        const commentCounts = await commentModel.aggregate([
            { $match: { discussion: { $in: discussionIds } } },
            { $group: { _id: "$discussion", count: { $sum: 1 } } }
        ])

        const countsMap = {}
        commentCounts.forEach(item => {
            countsMap[item._id.toString()] = item.count
        })

        const enriched = discussions.map(d => {
            const obj = d.toObject()
            obj.commentsCount = countsMap[d._id.toString()] || 0
            obj.likesCount = Array.isArray(d.likes) ? d.likes.length : 0
            return obj
        })

        res.status(200).json({
            discussions: enriched
        })
    } catch (error) {
        console.error("GET DISCUSSIONS ERROR:", error)
        res.status(500).json({
            message: "failed to get discussions"
        })
    }
}


async function getDiscussion(req, res) {
    try {
        const discussionId = req.params.id

        const discussion = await discussionModel
            .findById(discussionId)
            .populate("author", "username profilePicture")

        if (!discussion) {
            return res.status(404).json({
                message: "discussion not found"
            })
        }

        const commentsCount = await commentModel.countDocuments({ discussion: discussionId })
        const obj = discussion.toObject()
        obj.commentsCount = commentsCount
        obj.likesCount = Array.isArray(discussion.likes) ? discussion.likes.length : 0

        res.status(200).json({
            discussion: obj
        })
    } catch (error) {
        res.status(500).json({
            message: "failed to get discussion"
        })
    }
}


async function deleteDiscussion(req, res) {
    try {
        const discussionId = req.params.id
        const userId = req.user.id

        const discussion = await discussionModel.findOneAndDelete({
            _id: discussionId,
            author: userId
        })

        if (!discussion) {
            return res.status(404).json({
                message: "Discussion not found or you are not the author"
            })
        }

        // Cascade delete associated comments
        await commentModel.deleteMany({ discussion: discussionId })

        res.status(200).json({
            message: "Discussion deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "failed to delete discussion"
        })
    }
}


async function toggleLikeDiscussion(req, res) {
    try {
        const discussionId = req.params.id
        const userId = req.user.id

        const discussion = await discussionModel.findById(discussionId)
        if (!discussion) {
            return res.status(404).json({
                message: "Discussion not found"
            })
        }

        if (!Array.isArray(discussion.likes)) {
            discussion.likes = []
        }

        const hasLiked = discussion.likes.some(id => id.toString() === userId.toString())

        if (hasLiked) {
            discussion.likes = discussion.likes.filter(id => id.toString() !== userId.toString())
        } else {
            discussion.likes.push(userId)
        }

        await discussion.save()

        res.status(200).json({
            message: hasLiked ? "Discussion unliked" : "Discussion liked",
            hasLiked: !hasLiked,
            likesCount: discussion.likes.length
        })
    } catch (error) {
        console.error("TOGGLE LIKE ERROR:", error)
        res.status(500).json({
            message: "Failed to update like status"
        })
    }
}


module.exports = {
    createDiscussion,
    getDiscussions,
    getDiscussion,
    deleteDiscussion,
    toggleLikeDiscussion
}