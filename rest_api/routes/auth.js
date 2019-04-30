const express = require("express");
const authRouter = express.Router();
const Passenger = require("../models/Passenger");
const Airline = require("../models/Airline");
const bcrypt = require("bcryptjs");

// called when signup post request is made
async function signupFunction(req, res, next) {
  const { name, accountAddress, email, password, userType } = req.body;

  // check if the user exists
  let matchedDoc;
  try {
    if (userType == "passenger") {
      matchedDoc = await Passenger.findOne({ email });
    } else if (userType == "airline") {
      matchedDoc = await Airline.findOne({ email });
    } else {
      return res.status(401).json({ message: "Illegal user type" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Network error, try again" });
  }

  if (!matchedDoc) {
    let hash;
    try {
      const salt = await bcrypt.genSalt(14);

      hash = await bcrypt.hash(password, salt);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "Signup failed. Malformed password. Try again." });
    }

    try {
      let savedUser, newUser;

      if (userType == "passenger") {
        newUser = new Passenger({
          name,
          email,
          password: hash,
          accountAddress
        });
      } else if (userType == "airline") {
        newUser = new Airline({
          name,
          email,
          password: hash,
          accountAddress: accountAddress
        });
      } else {
        return res.status(401).json({ message: "Illegal user type" });
      }

      savedUser = await newUser.save();

      res
        .status(200)
        .json({ message: "Signup success!", user: savedUser, userType });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Signup failed. Try again" });
    }
  } else {
    res.status(401).json({ message: "Account with this email already exists" });
  }
}

// called when login post request
async function loginFunction(req, res, next) {
  const { email, password, userType } = req.body;

  let userDoc;
  try {
    if (userType == "passenger") {
      userDoc = await Passenger.findOne({ email });
    } else if (userType == "airline") {
      userDoc = await Airline.findOne({ email });
    } else {
      return res.status(401).json({ message: "Invalid user type" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error. Try again." });
  }

  if (userDoc) {
    const result = await bcrypt.compare(password, userDoc.password);

    if (result) {
      return res
        .status(200)
        .json({ message: "Login Success", user: userDoc, userType });
    }
    res.status(401).json({ message: "Email or password is incorrect" });
  } else {
    res.status(401).json({
      message: "The account with the given type does not exist, please register"
    });
  }
}

authRouter.route("/signup").post(signupFunction);

authRouter.route("/login").post(loginFunction);

module.exports = authRouter;
