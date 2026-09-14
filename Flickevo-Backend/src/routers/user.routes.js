const express = require("express")

const router = express.Router()

const {
    getProfile,
    updateProfile,
    getImageKitAuth
} = require("../controllers/user.controller")

const {
    authMiddleware
} = require("../middlewares/auth.middleware")


router.get(
    "/me",
    authMiddleware,
    getProfile
)

router.put(
    "/me",
    authMiddleware,
    updateProfile
)

router.get(
    "/imagekit-auth",
    authMiddleware,
    getImageKitAuth
)


module.exports = router