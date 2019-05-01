const express = require("express");
const airlineRouter = express.Router();
const Airline = require("../models/Airline");
const Flight = require("../models/Flight");
const Passenger = require("../models/Passenger");
const Ticket = require("../models/Ticket");
const FlightChangeRequest = require("../models/FlightChangeRequest");
const Transaction = require("../models/Transaction");

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
        airline: airlineId,
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

async function getPendingRequests(req, res, next) {
  const { airlineId } = req.body;

  try {
    const airlineDoc = await Airline.findOne({ _id: airlineId });

    if (airlineDoc) {
      // matches airline ID,
      //approvedBySrcAirline and requestType: "airline" or init and requestType: "passenger"
      const requests = await FlightChangeRequest.find({
        $or: [
          {
            status: "init",
            requestType: "passenger",
            srcAirline: airlineDoc._id
          },
          {
            status: "approvedBySrcAirline",
            requestType: "airline",
            destFlight: { $in: airlineDoc.flights }
          }
        ]
      }).populate([
        {
          path: "ticket",
          populate: {
            path: "passenger"
          }
        },
        {
          path: "destFlight",
          populate: {
            path: "airline"
          }
        }
      ]);

      console.debug(requests);

      res.status(200).json({ message: "Listing succeeded", requests });
    } else {
      res.status(404).json({ message: "Not a valid airline ID" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!!" });
  }
}
/**
 *
 * @param {*} requestDoc - P2A request
 *
 *
 * create new A2A request with status approvedBySrcAirline
 * update existing P2A request to approvedBySrcAirline
 * update ticket status to awaiting new ticket
 */
async function approveUserRequest(p2ARequest) {
  let retDoc;
  try {
    ticket = await Ticket.findOne({
      _id: p2ARequest.ticket._id
    });

    passenger = await Passenger.findOne({
      _id: p2ARequest.ticket.passenger._id
    });
    newFlight = await Flight.findOne({
      _id: p2ARequest.destFlight._id
    });
    console.debug(passenger, newFlight);

    if (ticket && passenger && newFlight) {
      // TODO: call request in smart contract

      const newAirlineToAirlineRequest = new FlightChangeRequest({
        ticket: p2ARequest.ticket,
        srcAirline: p2ARequest.srcAirline,
        destFlight: p2ARequest.destFlight,
        status: "approvedBySrcAirline",
        requestType: "airline",
        childRequest: p2ARequest._id
      });

      await newAirlineToAirlineRequest.save();

      p2ARequest.status = "approvedBySrcAirline";

      ticket.status = "Awaiting new ticket for flight change";

      retDoc = await p2ARequest.save();
      console.debug(retDoc);
      await ticket.save();
    }
  } catch (err) {
    console.error(err);
    retDoc = {};
    ticket.status = "Booked. Flight change request rejected by your airline";
    await ticket.save();
  } finally {
    return retDoc;
  }
}
/**
 *
 * @param {*} requestDoc - A2A request
 *
 *
 * decrement destFlight seats
 * increment srcFlight seats
 * update A2A request with status closed
 * update existing P2A request to closed
 * create new ticket for the passenger
 * add ticket id to user purchases list
 * update old ticket to status cancelled due to flight change
 *
 */
async function approveAirlineRequest(a2ARequest) {
  let retDoc;
  console.debug(a2ARequest);
  try {
    const ticket = await Ticket.findOne({
      _id: a2ARequest.ticket._id
    });

    console.debug(ticket);

    const passenger = await Passenger.findOne({
      _id: a2ARequest.ticket.passenger._id
    });

    const srcAirline = await Airline.findOne({ _id: a2ARequest.srcAirline });
    if (
      ticket &&
      passenger &&
      srcAirline &&
      a2ARequest.destFlight.numSeatsRemaining > 0
    ) {
      const srcFlight = await Flight.findOne({ _id: ticket.flight });
      const destFlight = await Flight.findOne({
        _id: a2ARequest.destFlight._id
      });
      const childRequest = await FlightChangeRequest.findOne({
        _id: a2ARequest.childRequest
      });
      const newTicket = new Ticket({
        passenger: ticket.passenger,
        flight: a2ARequest.destFlight._id,
        status: "Booked for flight change"
      });

      passenger.purchases.push(newTicket._id);

      destFlight.numSeatsRemaining -= 1;
      srcFlight.numSeatsRemaining += 1;
      childRequest.status = "closed";
      a2ARequest.status = "closed";

      ticket.status = "Cancelled due to flight change";
      await destFlight.save();
      await srcFlight.save();
      retDoc = await a2ARequest.save();
      await childRequest.save();
      const newTicketDoc = await newTicket.save();

      const tx = new Transaction({
        ticket: newTicketDoc._id,
        payer: srcAirline._id,
        payee: a2ARequest.destFlight.airline,
        // TODO: remove amount hardcoded
        amount: 10
      });
      await tx.save();
      await passenger.save();
      await ticket.save();
    }
  } catch (err) {
    console.error(err);
    retDoc = {};
    ticket.status = "Booked. Flight change request rejected";
    await ticket.save();
  } finally {
    return retDoc;
  }
}

/**
 * if requestType airline call handleAirline else call handleUser
 */

async function approveRequest(req, res, next) {
  const { requestId } = req.body;

  let requestDoc;
  try {
    requestDoc = await FlightChangeRequest.findOne({ _id: requestId }).populate(
      [
        { path: "ticket" },
        { path: "destFlight", populate: { path: "airline" } },
        { path: "srcAirline" }
      ]
    );

    if (requestDoc.status === "init") {
      updatedRequestDoc = await approveUserRequest(requestDoc);
    } else if (requestDoc.status === "approvedBySrcAirline") {
      updatedRequestDoc = await approveAirlineRequest(requestDoc);
    }
    console.debug(updatedRequestDoc);
    if (Object.keys(updatedRequestDoc).length > 0) {
      return res.status(200).json({
        message: "Awaiting new ticket for flight change",
        updatedRequest: updatedRequestDoc
      });
    }

    if (requestDoc.status === "init") {
      requestDoc.status = "rejectedBySrcAirline";
    } else if (requestDoc.status === "approvedBySrcAirline") {
      requestDoc.status = "rejectedByDestAirline";
    }

    updatedRequestDoc = await requestDoc.save();

    res
      .status(200)
      .json({ message: "Request rejected", updatedRequest: updatedRequestDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!!" });
  }
}

/**
 *
 * if reqType passenger check if
 * check if
 * ticket exists
 * passenger exists
 * dest flight exists
 *
 * if reqType airline check if
 * ticket exists
 * passenger exists
 * src airline exists so that it can pay
 * seats available??
 *
 */
async function checkRequest(req, res, next) {
  const { requestId } = req.body;

  let requestDoc;
  try {
    requestDoc = await FlightChangeRequest.findOne({ _id: requestId }).populate(
      [
        { path: "ticket" },
        { path: "destFlight", populate: { path: "airline" } },
        { path: "srcAirline" }
      ]
    );
    let updatedRequestDoc = {};
    if (
      requestDoc &&
      requestDoc.ticket &&
      requestDoc.ticket.passenger &&
      requestDoc.destFlight
    ) {
      if (
        requestDoc.requestType === "passenger" ||
        (requestDoc.requestType === "airline" &&
          requestDoc.srcAirline &&
          requestDoc.srcAirline._id &&
          requestDoc.destFlight.numSeatsRemaining > 0)
      ) {
        return res
          .status(200)
          .json({ message: "Valid request", request: requestDoc });
      }
    }
    if (requestDoc.status === "init") {
      requestDoc.status = "rejectedBySrcAirline";
    } else if (requestDoc.status === "approvedBySrcAirline") {
      requestDoc.status = "rejectedByDestAirline";
    }

    // update ticket to booked but rejected
    ticket.status = "Booked. Flight change request rejected by chosen airline";
    await ticket.save();

    updatedRequestDoc = await requestDoc.save();

    res
      .status(200)
      .json({ message: "Request rejected", request: updatedRequestDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!!" });
  }
}

async function getPendingTxs(req, res, next) {
  const { airlineId } = req.body;

  let txDocs;
  try {
    txDocs = await Transaction.find({
      $or: [{ payer: airlineId }, { payee: airlineId }]
    }).populate("ticket payer payee");

    res.status(200).json({
      message: "Pending transactions retrieved",
      transactions: txDocs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!!" });
  }
}

airlineRouter.route("/add-flight").post(addFlight);
airlineRouter.route("/list-flights").post(listFlights);
airlineRouter.route("/get-pending-requests").post(getPendingRequests);
airlineRouter.route("/check-request").post(checkRequest);
airlineRouter.route("/approve-request").post(approveRequest);
airlineRouter.route("/get-pending-txns").post(getPendingTxs);

module.exports = airlineRouter;
