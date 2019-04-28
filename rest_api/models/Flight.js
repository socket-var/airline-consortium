const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const flightSchema = new mongoose.Schema({
  // _id: flightId
  airline: { type: ObjectId, required: true, ref: "Airline" },
  flightName: { type: String, required: true },
  capacity: { type: Number, required: true },
  numSeatsRemaining: { type: Number, required: true },
  // list of passenger IDs
  passengers: [
    {
      type: ObjectId
    }
  ]
});

module.exports = mongoose.model("Flight", flightSchema);
