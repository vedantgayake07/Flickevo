const crypto = require("crypto")
const userModel = require("../models/user.model")


async function getProfile(req, res) {

    try {

        const userId = req.user.id

        const user =
            await userModel
                .findById(userId)
                .select("-password")

        if(!user) {

            return res.status(404).json({
                message: "user not found"
            })
        }

        const userObj = user.toObject()
        userObj.id = user._id
        userObj._id = user._id

        res.status(200).json({
            user: userObj
        })

    } catch(error) {

        res.status(500).json({
            message: "failed to get profile"
        })
    }
}


async function updateProfile(req, res) {

    try {

        const userId = req.user.id

        const {
            username,
            profilePicture
        } = req.body

        const user =
            await userModel.findById(userId)

        if(!user) {

            return res.status(404).json({
                message: "user not found"
            })
        }

        if(username) {
            const trimmedUsername = username.trim()
            if (trimmedUsername.length < 3) {
                return res.status(400).json({
                    message: "Username must be at least 3 characters long"
                })
            }

            const escapedUsername = trimmedUsername.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            const existingUser = await userModel.findOne({
                _id: { $ne: userId },
                username: { $regex: new RegExp(`^${escapedUsername}$`, "i") }
            })

            if (existingUser) {
                return res.status(409).json({
                    message: "Username already taken"
                })
            }

            user.username = trimmedUsername
        }

        if(profilePicture !== undefined) {
            user.profilePicture = profilePicture
        }

        await user.save()

        const userObj = user.toObject()
        userObj.id = user._id
        userObj._id = user._id
        delete userObj.password

        res.status(200).json({
            message: "profile updated",
            user: userObj
        })

    } catch(error) {

        if(error.code === 11000) {

            return res.status(409).json({
                message: "Username already taken"
            })
        }

        res.status(500).json({
            message: "failed to update profile"
        })
    }
}


async function getImageKitAuth(req, res) {
    try {
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
        if (!privateKey) {
            return res.status(500).json({
                message: "ImageKit private key not configured"
            })
        }

        const token = crypto.randomUUID()
        const expire = Math.floor(Date.now() / 1000) + 2400
        const signature = crypto
            .createHmac("sha1", privateKey)
            .update(token + expire)
            .digest("hex")

        res.status(200).json({
            token,
            expire,
            signature,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        })
    } catch (error) {
        res.status(500).json({
            message: "failed to generate ImageKit auth"
        })
    }
}


module.exports = {
    getProfile,
    updateProfile,
    getImageKitAuth
}