const express = require("express");
const airlineRouter = express.Router();
const Airline = require("../models/Airline");
const Flight = require("../models/Flight");

// called when signup post request is made
/**
 *
 *  find airline by id if found
 *  add new flight to Flight
 *  add new flight id to Airline
 *
 */
async function addFlight(req, res, next) {
  const { airlineId, flightName, numSeats } = req.body;

  // check if the user exists
  let matchedDoc;
  try {
    matchedDoc = await Airline.findOne({ _id: airlineId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error, try again" });
  }

  if (matchedDoc) {
    try {
      const newFlight = new Flight({
        airlineId,
        flightName,
        capacity: numSeats,
        numSeatsRemaining: numSeats
      });
      savedFlight = await newFlight.save();
      console.debug(savedFlight);
      updatedAirline = await Airline.findByIdAndUpdate(airlineId, {
        $push: { flights: savedFlight._id }
      });

      res
        .status(200)
        .json({ message: "New Flight added!", flight: savedFlight });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Adding failed. Try again" });
    }
  } else {
    res.status(401).json({ message: "Airline doesn't exist" });
  }
}

async function listFlights(req, res, next) {
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

airlineRouter.route("/add-flight").post(addFlight);
airlineRouter.route("/list-flights").post(listFlights);

module.exports = airlineRouter;
