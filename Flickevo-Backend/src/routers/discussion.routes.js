const express = require("express")

const router = express.Router()

const {
    createDiscussion,
    getDiscussions,
    getDiscussion,
    deleteDiscussion
} = require("../controllers/discussion.controller")

const {
    createComment,
    getComments
} = require("../controllers/comments.controller")

const {
    authMiddleware
} = require("../middlewares/auth.middleware")


router.get(
    "/",
    getDiscussions
)

router.get(
    "/:id",
    getDiscussion
)

router.post(
    "/",
    authMiddleware,
    createDiscussion
)

router.delete(
    "/:id",
    authMiddleware,
    deleteDiscussion
)


// comments belonging to a discussion

router.post(
    "/:id/comments",
    authMiddleware,
    createComment
)

router.get(
    "/:id/comments",
    getComments
)


module.exports = router