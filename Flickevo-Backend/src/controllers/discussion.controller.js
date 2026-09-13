const discussionModel =
    require("../models/discussion.model")


async function createDiscussion(req, res) {

    try {

        const userId = req.user.id

        const {
            mediaId,
            mediaType,
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
                message:
                    "mediaId, mediaType, title and content are required"
            })
        }

        const discussion =
            await discussionModel.create({
                author: userId,
                mediaId,
                mediaType,
                title,
                content
            })

        res.status(201).json({
            message: "discussion created",
            discussion
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

        const discussions =
            await discussionModel
                .find()
                .populate("author", "username")
                .sort({
                    createdAt: -1
                })

        res.status(200).json({
            discussions
        })

    } catch (error) {

        res.status(500).json({
            message: "failed to get discussions"
        })
    }
}


async function getDiscussion(req, res) {

    try {

        const discussionId = req.params.id

        const discussion =
            await discussionModel
                .findById(discussionId)
                .populate("author", "username")

        if (!discussion) {

            return res.status(404).json({
                message: "discussion not found"
            })
        }

        res.status(200).json({
            discussion
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

        const discussion =
            await discussionModel
                .findOneAndDelete({
                    _id: discussionId,
                    author: userId
                })

        if (!discussion) {

            return res.status(404).json({
                message:
                    "Discussion not found or you are not the author"
            })
        }

        res.status(200).json({
            message:
                "Discussion deleted successfully"
        })

    } catch (error) {

        res.status(500).json({
            message:
                "failed to delete discussion"
        })
    }
}


module.exports = {
    createDiscussion,
    getDiscussions,
    getDiscussion,
    deleteDiscussion
}