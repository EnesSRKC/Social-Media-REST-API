const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  from: { type: String, required: true },
  to: { type: String, required: true },
  messages: { type: Array, default: [] },
});

module.exports = mongoose.model("Message", messageSchema);
