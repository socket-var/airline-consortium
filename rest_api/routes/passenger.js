const express = require("express");
const passengerRouter = express.Router();
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
/**
 * check if seats available - Flight
 * create a ticket - Ticket
 * add ticket to purchases - Passenger
 * decrement number of seats - Flight
 */
async function bookTicket(req, res, next) {
  const { userId, flightId } = req.body;

  // check if the user exists
  let userDoc, flightDoc;
  try {
    userDoc = await Passenger.findOne({ _id: userId });
    flightDoc = await Flight.findOne({ _id: flightId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error, try again" });
  }

  if (userDoc && flightDoc) {
    if (flightDoc.numSeatsRemaining > 0) {
      try {
        const ticket = new Ticket({
          passenger: userId,
          flight: flightId,
          status: "booked"
        });

        flightDoc.numSeatsRemaining -= 1;
        flightDoc.passengers.push(userId);

        await flightDoc.save();
        const newTicket = await ticket.save();
        userDoc.purchases.push(newTicket._id);
        await userDoc.save();

        res.status(200).json({ message: "Booking success!!" });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Server error, booking failed!!" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Sorry!! All seats are now sold out." });
    }
  } else {
    res.status(401).json({ message: "User or flight ID not valid!!" });
  }
}

async function getPurchases(req, res, next) {
  const { userId } = req.body;

  // check if the user exists
  let userDoc;
  try {
    userDoc = await Passenger.findOne({ _id: userId }).populate({
      path: "purchases",
      populate: {
        path: "flight",
        populate: { path: "airline", select: "name" }
      }
    });
    console.debug(userDoc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error, try again" });
  }

  if (userDoc) {
    res.status(200).json({
      message: "Listing flights successful",
      purchases: userDoc.purchases
    });
  } else {
    res.status(401).json({ message: "User does not exist" });
  }
}

passengerRouter.route("/get-available-flights").post(getAvailableFlights);
passengerRouter.route("/book-ticket").post(bookTicket);
passengerRouter.route("/get-purchases").post(getPurchases);

module.exports = passengerRouter;
