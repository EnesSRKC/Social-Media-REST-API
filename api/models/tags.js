const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  text: { type: String, required: true },
});

module.exports = mongoose.model("Tag", userSchema);
