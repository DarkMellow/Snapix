const express = require("express");
const router = express.Router();

const dataControllers = require("../controllers/data.controller")
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/users", authMiddleware.checkTokenExists, dataControllers.dataFetchUsers);
router.get("/feed", authMiddleware.checkTokenExists, dataControllers.dataFetchUsers);
module.exports = router;