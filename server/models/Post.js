const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  caption: {
    type: String,
  },
  picture: {
    type: String,
  },
  like: {
    type: Array,
    default: [],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("Posts", PostSchema);
