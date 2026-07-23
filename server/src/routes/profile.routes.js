const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// NOTE - Fetching user details, bio, and their specific array of posts for profile view
router.get("/profile/:username", 
  authMiddleware.checkTokenExists, 
  profileController.fetchUserProfile
);

// NOTE - Updating the details of the user like bio and profile picture
router.put("/update", 
  authMiddleware.checkTokenExists, 
  upload.single("profilePic"), 
  profileController.updateUserDetails
);

module.exports = router;