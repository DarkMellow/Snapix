const mongoose = require("mongoose");

async function connectDatabase() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("- - - DATABASE CONNECTED SUCCESSFULLY - - -");
};

module.exports = connectDatabase;