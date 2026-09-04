const {Router} = require("express")
const authController = require("../controllers/auth.controller")
const AuthMiddleware = require("../middlewares/auth.middleware")

const router = Router()

router.post("/register" , authController.userRegisterController)

router.post("/login" , authController.userLoginController)

router.post("/refresh-token" , authController.refreshToken)

router.post("/logout" , authController.userLogoutController)


router.get("/me", AuthMiddleware.authMiddleware, (req, res) => {
    res.status(200).json({
        user: req.user
    })
})

module.exports = router;