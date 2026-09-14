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

        res.status(200).json({
            user
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
            email,
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
            user.username = username
        }

        if(email) {
            user.email = email
        }

        if(profilePicture !== undefined) {
            user.profilePicture =
                profilePicture
        }

        await user.save()

        res.status(200).json({
            message: "profile updated",
            user
        })

    } catch(error) {

        if(error.code === 11000) {

            return res.status(409).json({
                message:
                    "username or email already exists"
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