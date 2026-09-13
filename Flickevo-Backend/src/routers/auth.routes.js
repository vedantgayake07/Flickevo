const express = require("express")

const router = express.Router()

const {
    userRegisterController,
    userLoginController,
    refreshToken,
    userLogoutController
} = require("../controllers/auth.controller")

const {
    authMiddleware
} = require("../middlewares/auth.middleware")


router.post(
    "/register",
    userRegisterController
)

router.post(
    "/login",
    userLoginController
)

router.post(
    "/refresh",
    refreshToken
)

router.post(
    "/logout",
    authMiddleware,
    userLogoutController
)


module.exports = router