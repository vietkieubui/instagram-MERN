const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  //   image: {
  //     type: String,
  //   },
});

module.exports = mongoose.model("comments", CommentSchema);
