const watchlistModel = require("../models/watchlist.model")

/**
 * get /api/watchlist
 */
async function getWatchList(req , res) {
    const userId = req.user.id

    const watchlist = await watchlistModel.find({user : userId}).sort({createdAt : -1})

    res.status(200).json({
        message : "watchlist received" ,
        watchlist
    })
}

/**
 * delete /:id
 */

async function removeFromWatchlist(req , res) {
    const userId = req.user.id
    const watchListId = req.params.id

    const deleteItem = await watchlistModel.findOneAndDelete({
        _id : watchListId ,
        user : userId
    })

    if(!deleteItem)
    {
        return res.status(404).json({
            message : "item not found"
        })
    }

    res.status(200).json({
        message : "media removed from ur watchlist"
    })
}

/**
 * post /api/watchlist
 */

async function addToWatchList(req , res) {
    const userId = req.user.id

    const {mediaId , mediaType} = req.body

    if(!mediaId || !mediaType)
    {
        return res.status(404).json({
            message : "mediaid and mediaType missing"
        })
    }

    const existingItem = await watchlistModel.findOne({
        user : userId,
        mediaId ,
        mediaType
    })

    if(existingItem)
    {
        return res.status(400).json({
            message : "media already exist"
        })
    }

    const item = await watchlistModel.create({
        user : userId,
        mediaId ,
        mediaType
    })

    res.status(201).json({
        message : "media added to watchlist",
        item
    })
}

module.exports = {getWatchList , removeFromWatchlist , addToWatchList}