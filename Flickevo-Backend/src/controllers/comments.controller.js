const commentModel = require("../models/comment.model")
const discussionModel = require("../models/discussion.model")

async function createComment(req , res) {
    const userId = req.user.id
    const discussionId = req.params.id
    const content = req.body.content

    //console.log(userId , discussionId , content)

    if(!userId || !discussionId || !content)
    {
        return res.status(400).json({
            message : "userid , discussionid and content is missing"
        })
    }

    const discussion = await discussionModel.findById(discussionId)

    if(!discussion)
    {
        return res.status(404).json({
            message : "discussion not exist"
        })
    }

    const comment = await commentModel.create({
        author : userId ,
        discussion : discussionId ,
        content
    })

    res.status(201).json({
        message : "comment is created" ,
        comment
    })

}

async function getAllComments(req , res) {
    const discussionId = req.params.id

    if(!discussionId)
    {
        return res.status(400).json({
            message : "missing discussion id"
        })
    }

    const discussion = await discussionModel.findById(discussionId).populate("author")

    if(!discussion)
    {
        return res.status(404).json({
            message : "no discussion exist"
        })
    }

    const comments = await commentModel.find({discussion : discussionId})

    res.status(200).json({
        message : "comments received",
        comments
    })
}

async function deleteComment(req , res) {
    
    const userId = req.user.id
    const commentId = req.params.id

    if(!userId || !commentId)
    {
        return res.status(400).json({
            message : "userid and commentid is missing"
        })
    }

    const deletedComment = await commentModel.findOneAndDelete({
        _id : commentId,
        author : userId
    })

    if(!deletedComment)
    {
        return res.status(404).json({
            message : "Comment not found or you are not the author"
        })
    }

    res.status(200).json({
        message : "comment deleted",
        deletedComment
    })
    
}

module.exports = {createComment , getAllComments , deleteComment}