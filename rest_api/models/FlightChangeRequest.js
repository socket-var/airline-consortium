const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const flightChangeSchema = new mongoose.Schema({
  // _id: requestId
  requestType: { type: String, required: true },
  userId: { type: ObjectId, required: true },
  srcAirlineId: { type: ObjectId, required: true },
  srcFlightId: { type: ObjectId, required: true },
  destAirlineId: { type: ObjectId, required: true },
  destFlightId: { type: ObjectId, required: true }
});

module.exports = mongoose.model("FlightChangeRequest", flightChangeSchema);
