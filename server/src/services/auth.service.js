const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//NOTE - NEW USER CREATION HANDLER returning TOKEN
async function createUserData({ username, password, displayName, email, profilePic }) {
  const hash = await bcrypt.hash(password, 2);
  const user = await userModel.create({
    username,
    password: hash,
    displayName,
    email,
    profilePic,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username,
    },
    process.env.JWT_SECRET,
  );

  return { user, token };
}

//NOTE - Returning Token For Already Existing User
async function validateUserData( password, userExist ) {
  const passwordValid = await bcrypt.compare(password, userExist.password);
  if (!passwordValid) {
    throw new Error("Invalid Password");
  }

  const token = jwt.sign(
    {
      id: userExist._id,
      username: userExist.username,
    },
    process.env.JWT_SECRET,
  );

  return token;
}

module.exports = { createUserData, validateUserData };