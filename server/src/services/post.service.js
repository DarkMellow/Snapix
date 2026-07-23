const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const storageServices = require("./storage.service"); 


//NOTE - creating a post
async function createPost(userId, username, caption, buffer) {
  const uploadedImage = await storageServices.uploadPhoto(buffer);

  const newPost = await postModel.create({
    user: userId,
    username,
    imageUrl: uploadedImage.url,
    caption,
  });

  return newPost;
}


//NOTE - fetching posts of user's feed
async function fetchPosts(limit, lastPostId) {
  let query = {};

  if (lastPostId) {
    query._id = { $lt: lastPostId };
  }

  const allPosts = await postModel.find(query)
    .populate("user", "username displayName profilePic")
    .sort({ _id: -1 })
    .limit(limit);

  // Count comments for each post in database
  const postsWithCommentCount = await Promise.all(
    allPosts.map(async (post) => {
      const commentCount = await commentModel.countDocuments({ postId: post._id });
      const postObj = post.toObject();
      postObj.commentCount = commentCount;
      return postObj;
    })
  );

  return postsWithCommentCount;
}

module.exports = { createPost, fetchPosts };