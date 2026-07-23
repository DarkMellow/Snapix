const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const postControllers = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/feed", authMiddleware.checkTokenExists, postControllers.fetchFeed);
router.post("/post", authMiddleware.checkTokenExists, upload.single("image"), postControllers.createNewPost);
router.get("/:postId", authMiddleware.checkTokenExists, postControllers.fetchParticularPost);
router.delete("/:postId", authMiddleware.checkTokenExists, postControllers.deleteParticularPost);
router.post("/:postId/like", authMiddleware.checkTokenExists, postControllers.configureLikes);

module.exports = router;