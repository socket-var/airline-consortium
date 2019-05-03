const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const transactionSchema = new mongoose.Schema({
  ticket: { type: ObjectId, required: true, ref: "Ticket" },
  payer: { type: ObjectId, required: true, ref: "Airline" },
  payee: { type: ObjectId, required: true, ref: "Airline" },
  amount: { type: Number, required: true },
  status: { type: String, required: true }
});

module.exports = mongoose.model("Transaction", transactionSchema);
