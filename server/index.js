require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//routes
const authRouter = require("./routes/auth");

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

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("INSTAGRAM MERN API"));

app.get("/", (req, res) => res.send("hello world"));
app.use("/api/auth", authRouter);
// app.use("/api/posts", postRouter);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
