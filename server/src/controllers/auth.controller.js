const authServices = require("../services/auth.service");
const storageServices = require("../services/storage.service"); 
const userModel = require("../models/user.model");

// ---------------- USER REGISTERING API CONTROLLER -------------- //
async function registerUser(req, res) {
  try {
    const { username, password, displayName, email } = req.body;
    
    let uploadedPic = null;
    if (req.file){
      uploadedPic = await storageServices.uploadPhoto(req.file.buffer);
    }

    const { user, token } = await authServices.createUserData({
      username,
      password,
      displayName,
      email,
      profilePic: uploadedPic?.url
    });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
    res.status(201).json({
      message: "User Registered Successfully",
      user,
      token
    });

  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "Some Error Occured",
      err,
    });
  }
}

// -------------- USER LOGIN API CONTROLLER ------------- //
async function loginUser(req, res) {
  try {
    const { password } = req.body;
    
    const token = await authServices.validateUserData(
      password,
      req.userExist,
    );

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

    const user = {
      _id: req.userExist._id,
      username: req.userExist.username,
      displayName: req.userExist.displayName,
      email: req.userExist.email,
      profilePic: req.userExist.profilePic,
      bio: req.userExist.bio,
    };

    res.status(200).json({
      message: "User Logged In Successfully",
      user,
      token,
    });

  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: err.message,
    });
  }
}

// ------------- USER LOGOUT API CONTROLLER -------------- //
async function logoutUser(req, res) {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
  res.status(200).json({
    message: "User logged out successfully",
  });
}

// ------------- VERIFY SESSION GETME CONTROLLER ---------- //
async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some Error Occured",
      err,
    });
  }
}

module.exports = { registerUser, loginUser, logoutUser, getMe };
