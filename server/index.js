require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

//routes
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const searchUserRouter = require("./routes/searchUser");
const followRouter = require("./routes/follow");
const chatRouter = require("./routes/chat");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.oo4li.mongodb.net/instagram-MERN?retryWrites=true&w=majority`
    );
    console.log("mongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("INSTAGRAM MERN API Welcome");
  res.send("INSTAGRAM MERN API");});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/user", userRouter);
app.use("/api/search", searchUserRouter);
app.use("/api/follow", followRouter);
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
server.listen(3000, () => {
  console.log("listening on *:3000");
});
io.on("connection", (socket) => {
  console.log("a user connected ____ ", socket.id);
  socket.on("message", ({ conversationId }) => {
    console.log(conversationId);
    io.emit("message", { conversationId });
  });
});
io.on("disconnected", (socket) => {
  console.log("a user disconnected");
});
