const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  accountAddress: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true }
  // accountBalance: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
