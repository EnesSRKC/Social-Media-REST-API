const mongoose = require("mongoose");

const organizationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  header: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: Object, required: true },
  date: { type: Date, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  announcements: { type: Array },
});

module.exports = mongoose.model("Organization", organizationSchema);
