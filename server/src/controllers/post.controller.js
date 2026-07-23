const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const postServices = require("../services/post.service");
const { getIO } = require("../socket/socket");

//NOTE - NEW POST CREATION API CONTROLLER
async function createNewPost(req, res) {
  try {
    const newPost = await postServices.createPost(
      req.decoded.id,
      req.decoded.username,
      req.body.caption,
      req.file.buffer
    );

    await newPost.populate("user", "username displayName profilePic");
    const newPostObj = newPost.toObject();
    newPostObj.commentCount = 0;

    res.status(200).json({
      message: "New post was successfully created",
      newPost: newPostObj,
    });

  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "Some Error Occured",
      err,
    });
  }
}


//NOTE - FETCHING FEED FROM THE DATABASE USING PAGINATION FOR PERFORMANCE
async function fetchFeed(req, res) {
  try {
    const limit = 10;
    const lastPostId = req.query.lastPostId;
    const allPosts = await postServices.fetchPosts(limit, lastPostId);

    res.status(200).json({
      message: "Fetched all posts successfully",
      allPosts,
    });

  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "Some Error Occured",
      err,
    });
  }
}


//NOTE - FETCHING A PARTICULAR POST FOR DETAIL VIEW AND COMMENTS
async function fetchParticularPost(req, res) {
  try {
    const { postId } = req.params;

    const post = await postModel
      .findById(postId)
      .populate("user", "username displayName profilePic");

    if (!post) {
      return res.status(400).json({
        message: "Post doesn't exist with that id"
      })
    }

    const comments = await commentModel.find({ postId })
      .populate("userId", "username displayName profilePic");

    const postObj = post.toObject();
    postObj.commentCount = comments.length;

    res.status(200).json({
      message: "Post Found!",
      post: postObj,
      comments
    })
  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "Some Error Occured",
      err,
    });
  }
}

//NOTE - DELETING A PARTICULAR POST
async function deleteParticularPost(req, res) {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post doesn't exist with that id"
      });
    }

    // Authorization Check
    if (post.user.toString() !== req.decoded.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this post"
      });
    }

    await postModel.findByIdAndDelete(postId);
    await commentModel.deleteMany({ postId });

    res.status(200).json({
      message: "Post & Comments associated, deleted successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "Some Error Occured",
      err,
    });
  }
}


//NOTE - LIKING A PARTICULAR POST
async function configureLikes(req, res) {
  try {
    const { postId } = req.params;
    let post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post doesn't exist with that id"
      });
    }

    const postLikes = post.likes || [];
    if (postLikes.includes(req.decoded.id)) {
      post = await postModel.findByIdAndUpdate(
        postId,
        { $pull: { likes: req.decoded.id } },
        { new: true }
      );
      return res.status(200).json({
        message: "Post unliked successfully",
        post,
      });
    }

    else {
      post = await postModel.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: req.decoded.id } },
        { new: true }
      );

      getIO().to("user_" + post.username).emit("likeNotification", {
        post: post,
        from: req.decoded.id,
        message: "Liked your post",
      });

      res.status(200).json({
        message: "Post liked successfully",
        post,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some Error Occured",
      err,
    });
  }
}

module.exports = { createNewPost, fetchFeed, fetchParticularPost, deleteParticularPost, configureLikes };