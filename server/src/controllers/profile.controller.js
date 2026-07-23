const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const storageServices = require("../services/storage.service"); 


//NOTE - Fetches user details, bio, and their specific array of posts for profile view;
async function fetchUserProfile(req, res) {
  try {
    const { username } = req.params;
    const userData = await userModel
      .findOne({ username })
      .select("_id username displayName profilePic bio");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const postData = await postModel
      .find({ user: userData._id })
      .select("imageUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      user: userData,
      posts: postData,
    });

  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "Some Error Occured",
      err,
    });
  }
}

//NOTE - Updating profile information like bio and profile picture
async function updateUserDetails(req, res) {
  try {
    const { bio, displayName } = req.body
    const token = req.decoded;

    const updateFields = {};
    if (bio !== undefined) updateFields.bio = bio;
    if (displayName !== undefined) updateFields.displayName = displayName;

    let uploadedImage;
    if (req.file) {
      uploadedImage = await storageServices.uploadPhoto(req.file.buffer);
      updateFields.profilePic = uploadedImage.url;
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: token.id },
      updateFields,
      { new: true }
    ).select("_id username displayName profilePic bio");

    res.status(200).json({
      message: "Profile Updated Successfully",
      user: updatedUser,
    });

  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "Some Error Occured",
      err,
    });
  }
}

module.exports = { fetchUserProfile, updateUserDetails };