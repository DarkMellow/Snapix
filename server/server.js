require("dotenv").config();
const app = require("./src/app");
const connectDatabase = require("./src/database/db");
const { initializeSocket } = require("./src/socket/socket");
const http = require("http");

const server = http.createServer(app);
const io = initializeSocket(server);

connectDatabase();
server.listen(3000, () => {
  console.log("- - - Server running on port 3000 - - -");
});

// Now export the 'io' instance so controllers can use it
module.exports = { server, io };