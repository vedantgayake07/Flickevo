const discussionModel = require("../models/discussion.model")

async function createDiscussion(req , res) {
    const userId = req.user.id

    const { mediaId , mediaType , title , content } = req.body

    if(!mediaId || !mediaType || !title ||!content)
    {
        return res.status(400).json({
            message : "mediaId , mediaType , title , content missing"
        })
    }

    const discussion = await discussionModel.create({
        author : userId,
        mediaId ,
        mediaType ,
        title ,
        content
    })

    res.status(201).json({
        message : "discussion created",
        discussion
    })
    
}

async function getAllDiscussion(req , res) {

    const discussions = await discussionModel.find().populate("author" , "username")

    res.status(200).json({
        message : "discussion received",
        discussions
    })
}

async function getDiscussion(req , res) {
    const id = req.params.id

    const discussion = await discussionModel.findOne({_id:id}).populate("author" , "username")

    if(!discussion)
    {
        return res.status(400).json({
            message : "Discussion Not Found"
        })
    }

    res.status(200).json({
        message : "found discussion",
        discussion
    })
}

async function deleteDiscussion(req , res) {

    const userId = req.user.id
    const discussionId = req.params.id

    const discussion = await discussionModel.
    findOneAndDelete({
        _id : discussionId})

    if(!discussion)
    {
        return res.status(400).json({
            message : "discussion not found"
        })
    }

    res.status(200).json({
        message : "discussion delete successfully"
    })
    
}
module.exports = {createDiscussion , getAllDiscussion , getDiscussion}