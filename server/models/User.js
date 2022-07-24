const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    default: "Instagram User",
  },
  avatar: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/intagram-dev-e7bc3.appspot.com/o/logo.png?alt=media&token=8c2a763a-6311-425f-841d-126d499715a7",
  },
  bio: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("users", UserSchema);
