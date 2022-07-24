const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  foods: {
    type: [Object],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["CHƯA XÁC NHẬN", "CHUẨN BỊ", "ĐANG GIAO", "ĐÃ GIAO", "ĐÃ HỦY"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "stores",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("likes", OrderSchema);
