const express = require("express");
const airlineRouter = express.Router();
const Airline = require("../models/Airline");
const Flight = require("../models/Flight");
const Passenger = require("../models/Passenger");
const Ticket = require("../models/Ticket");
const FlightChangeRequest = require("../models/FlightChangeRequest");

// called when signup post request is made
/**
 *
 *  get all flights with num seats greater than zero
 *
 *
 *
 */
async function getAvailableFlights(req, res, next) {
  const { userId } = req.body;

  // check if the user exists
  let matchedDoc;
  try {
    matchedDoc = await Passenger.findOne({ _id: userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error, try again" });
  }

  if (matchedDoc) {
    try {
      const flights = await Flight.find({})
        .where("numSeatsRemaining")
        .gt(0)
        .populate("airline", "name");

      console.debug(flights.length);
      res.status(200).json({ message: "Listing flights successful", flights });
    } catch (err) {
      console.error(err);
      return res
        .status(401)
        .json({ message: "Listing flights failed. Try again" });
    }
  } else {
    res.status(401).json({ message: "User does not exist" });
  }
}

async function bookTicket(req, res, next) {
  const { airlineId } = req.body;

  // check if the user exists
  let matchedDoc;
  try {
    matchedDoc = await Airline.findOne({ _id: airlineId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error, try again" });
  }

  if (matchedDoc) {
    console.log(matchedDoc);
    const { flights } = matchedDoc;

    try {
      const matchedFlights = await Flight.find({ _id: { $in: flights } });
      console.debug(matchedFlights);

      res.status(200).json({
        message: "Listing flights succeeded",
        flights: matchedFlights
      });
    } catch (err) {
      console.error(err);
      return res
        .status(401)
        .json({ message: "Listing flights failed. Try again" });
    }
  } else {
    res.status(401).json({ message: "Airline doesn't exist" });
  }
}

airlineRouter.route("/get-available-flights").post(getAvailableFlights);
airlineRouter.route("/book-ticket").post(bookTicket);

module.exports = airlineRouter;
