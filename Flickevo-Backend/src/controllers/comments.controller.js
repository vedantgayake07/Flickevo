const commentModel =
    require("../models/comment.model")

const discussionModel =
    require("../models/discussion.model")


async function createComment(req, res) {

    try {

        const userId = req.user.id
        const discussionId = req.params.id
        const content = req.body.content

        if(!userId || !discussionId || !content) {

            return res.status(400).json({
                message:
                    "userid, discussionid and comment are required"
            })
        }

        const discussion =
            await discussionModel.findById(
                discussionId
            )

        if(!discussion) {

            return res.status(404).json({
                message:
                    "discussion does not exist"
            })
        }

        const comment =
            await commentModel.create({
                author: userId,
                discussion: discussionId,
                content
            })

        res.status(201).json({
            message: "comment is created",
            comment
        })

    } catch(error) {

        res.status(500).json({
            message: "failed to create comment"
        })
    }
}


async function getComments(req, res) {

    try {

        const discussionId = req.params.id

        const discussion =
            await discussionModel.findById(
                discussionId
            )

        if(!discussion) {

            return res.status(404).json({
                message:
                    "discussion does not exist"
            })
        }

        const comments =
            await commentModel
                .find({
                    discussion: discussionId
                })
                .populate(
                    "author",
                    "username profilePicture"
                )
                .sort({
                    createdAt: 1
                })

        res.status(200).json({
            comments
        })

    } catch(error) {

        res.status(500).json({
            message: "failed to get comments"
        })
    }
}


async function deleteComment(req, res) {

    try {

        const commentId = req.params.id
        const userId = req.user.id

        const comment =
            await commentModel
                .findOneAndDelete({
                    _id: commentId,
                    author: userId
                })

        if(!comment) {

            return res.status(404).json({
                message:
                    "Comment not found or you are not the author"
            })
        }

        res.status(200).json({
            message:
                "Comment deleted successfully"
        })

    } catch(error) {

        res.status(500).json({
            message:
                "failed to delete comment"
        })
    }
}


module.exports = {
    createComment,
    getComments,
    deleteComment
}