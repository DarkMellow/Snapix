const userModel = require("../models/user.model");
const postModel = require("../models/post.model");

//NOTE - FETCHING ALL THE USERS AVAILABLE
async function dataFetchUsers(req, res){
  const userData = await userModel.find();
  res.status(200).json({
    userData
  })
}

module.exports = { dataFetchUsers };