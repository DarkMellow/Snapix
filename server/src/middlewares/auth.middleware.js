const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")


//NOTE - Checking if user have registered before or not
async function checkUserRegister(req, res, next){
  try {
    const { username, email } = req.body;
    
    const userExist = await userModel.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    if (userExist){
      if (userExist.username === username) {
        return res.status(403).json({ message: "Username already exists" });
      }
      return res.status(403).json({ message: "Email already exists" });
    }

    next();
  } catch(err) {
    console.log(err);
    res.status(409).json({
      message: "Some Error Occured",
      err,
    });
  }
}


//NOTE - Checking User Already exists for login or not
async function checkUserLogin(req, res, next) {
  try {
    let { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const userExist = await userModel.findOne({ username });

    if (!userExist) {
      return res.status(403).json({ message: "User not found, register first" });
    }

    req.userExist = userExist;
    next();
    
  } catch (err) {
    console.log(err);
    res.status(409).json({
      message: "Some Error Occured",
      err,
    });
  }
}


//NOTE - Checking if the request sent has a token or not and then sending decoded items that were kept in the token while creation
async function checkTokenExists(req, res, next){
  const token = req.cookies.token;
  if(!token){
    return res.status(403).json({message: "Unauthorized request"});
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.decoded = decoded;
  next();
}

module.exports = { checkUserRegister, checkUserLogin, checkTokenExists };