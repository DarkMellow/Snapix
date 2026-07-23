const express = require("express");
const router = express.Router();

const commentControllers = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/:postId/comment", authMiddleware.checkTokenExists, commentControllers.addTopLevelComment);
router.post("/:postId/reply/:commentId", authMiddleware.checkTokenExists, commentControllers.addReplyComment);

module.exports = router;