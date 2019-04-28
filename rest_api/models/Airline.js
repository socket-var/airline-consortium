const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const airlineSchema = new mongoose.Schema({
  // _id: airlineId
  // list of flight IDs
  accountAddress: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  flights: [
    {
      type: ObjectId
    }
  ],
  // list of flight change requests
  flightChangeRequests: [
    {
      type: ObjectId
    }
  ]
});

module.exports = mongoose.model("Airline", airlineSchema);
