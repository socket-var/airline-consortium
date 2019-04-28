const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const passengerSchema = new mongoose.Schema({
  // _id: userId
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  // contains ticket IDs
  purchases: [
    {
      type: ObjectId,
      ref: "Ticket"
    }
  ]
});

module.exports = mongoose.model("Passenger", passengerSchema);
