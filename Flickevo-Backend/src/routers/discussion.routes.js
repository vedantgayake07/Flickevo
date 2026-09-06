const {Router} = require("express")
const AuthMiddleware = require("../middlewares/auth.middleware")
const DiscussionController = require("../controllers/discussion.controller")
const CommentsController = require("../controllers/comments.controller")

const discussionRoutes = Router()

discussionRoutes.post("/",AuthMiddleware.authMiddleware , DiscussionController.createDiscussion)

discussionRoutes.get("/" , DiscussionController.getAllDiscussion )

discussionRoutes.get("/:id" , DiscussionController.getDiscussion )

discussionRoutes.post("/:id/comment" , AuthMiddleware.authMiddleware , CommentsController.createComment)

discussionRoutes.get("/:id/comments" , CommentsController.getAllComments)



module.exports = discussionRoutes