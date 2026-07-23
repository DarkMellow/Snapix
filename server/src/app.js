const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const profileRoutes = require("./routes/profile.routes");
const commentRoutes = require("./routes/comment.routes");
const dataRoutes = require("./routes/data.routes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/content", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/data", dataRoutes);

module.exports = app;