const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ticketSchema = new mongoose.Schema({
  userId: { type: ObjectId, required: true },
  airlineId: { type: ObjectId, required: true },
  flightId: { type: ObjectId, required: true },
  // booked (customer -> src airline), flight change initiated (customer -> src airline), flight change pending (src airline -> dest airline), cancelled due to flight change (dest airline -> customer)
  status: { type: String, required: true }
});

module.exports = mongoose.model("Ticket", ticketSchema);
