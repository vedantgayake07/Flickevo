const {Router} = require("express")
const AuthMiddleware = require("../middlewares/auth.middleware")
const CommentsController = require("../controllers/comments.controller")

const commentRouter = Router()

commentRouter.delete("/:id" , AuthMiddleware.authMiddleware, CommentsController.deleteComment)
module.exports = commentRouter
