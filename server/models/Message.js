const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "conversations",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("messages", MessageSchema);
