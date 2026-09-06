const {Router} = require("express")
const AuthMiddleware = require("../middlewares/auth.middleware")
const DiscussionController = require("../controllers/discussion.controller")

const discussionRoutes = Router()

discussionRoutes.post("/",AuthMiddleware.authMiddleware , DiscussionController.createDiscussion)

discussionRoutes.get("/" , DiscussionController.getAllDiscussion )

discussionRoutes.get("/:id" , DiscussionController.getDiscussion )

module.exports = discussionRoutes