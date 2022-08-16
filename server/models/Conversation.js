const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: "users" }],
  lastMessage: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("conversations", ConversationSchema);
