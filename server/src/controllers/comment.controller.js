const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");

// NOTE - ADDING TOP-LEVEL COMMENT
async function addTopLevelComment(req, res) {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post doesn't exist with that id"
      });
    }

    const newComment = await commentModel.create({
      userId: req.decoded.id,
      postId,
      comment,
    });

    await newComment.populate("userId", "username displayName profilePic");

    res.status(200).json({
      message: "Comment added successfully",
      newComment,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some Error Occured",
      err,
    });
  }
}

// NOTE - ADDING REPLY TO A COMMENT
async function addReplyComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    const { comment } = req.body;

    const parentComment = await commentModel.findById(commentId);
    if (!parentComment || parentComment.parentId !== null) {
      return res.status(404).json({
        message: "Comment doesn't exist with that id or is already a comment"
      });
    }

    const newComment = await commentModel.create({
      userId: req.decoded.id,
      postId,
      comment,
      parentId: commentId,
    });

    await newComment.populate("userId", "username displayName profilePic");

    res.status(200).json({
      message: "Reply added successfully",
      newComment,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Some Error Occured",
      err,
    });
  }
}

module.exports = { addTopLevelComment, addReplyComment }