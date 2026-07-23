const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// New User Registering API Endpoint
router.post("/register", 
  upload.single("profilePic"), 
  authMiddleware.checkUserRegister, 
  authController.registerUser
);

// User Login API Endpoint
router.post("/login", 
  authMiddleware.checkUserLogin, 
  authController.loginUser
);

// Verify active token session
router.get("/me", 
  authMiddleware.checkTokenExists, 
  authController.getMe
);

// User logout session endpoint
router.post("/logout", authController.logoutUser);

module.exports = router;