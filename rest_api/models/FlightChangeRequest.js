const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const flightChangeSchema = new mongoose.Schema({
  // _id: requestId
  requestType: { type: String, required: true },
  ticket: { type: ObjectId, required: true, ref: "Ticket" },
  srcAirline: { type: ObjectId, required: true, ref: "Airline" },
  destFlight: { type: ObjectId, required: true, ref: "Flight" },
  // init, approvedBySrcAirline, rejectedBySrcAirline, rejectedByDestAirline, closed
  status: { type: String, required: true },
  childRequest: { type: ObjectId, ref: "FlightChangeRequest" }
});

module.exports = mongoose.model("FlightChangeRequest", flightChangeSchema);
