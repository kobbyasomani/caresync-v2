const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Patient = require("../models/patientModel");
const Shift = require("../models/shiftModel");
const express = require("express");
const emails = require("../services/email");

//----NEW ROUTE----//
// @desc Register User
// @route POST /user/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  //Ensure all fields are filled out
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("This email is associated with an account already.");
  }

  // Password encryption
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  // Generates JWT token for verification
  const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Sends verification email to user
  emails.verifyUserEmail(firstName, email, emailToken);

  if (user) {
    res.status(201).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

//----NEW ROUTE----//
// @desc Verify Email
// @route POST /user/emailVerification
// @access public
const emailVerification = asyncHandler(async (req, res) => {
  // Extract info from JWT
  const decode = jwt_decode(req.params.token);
  console.log(decode);
  // Search for user with email from JWT
  const user = await User.findOne({ email: decode.email });

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  // Change isConfirmed to true
  const verifyUser = await User.findByIdAndUpdate(user.id, {
    isConfirmed: true,
  });
  res.status(200).json(verifyUser);

  console.log(user.id);
});

//----NEW ROUTE----//
// @desc Login User
// @route POST /user/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  

  // Find user by email
  const user = await User.findOne({ email });

  // Current user ID
  const id = user.id;

  //Ensure all fields are filled out
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Check if the account has been confirmed yet
  if (!user.isConfirmed) {
    res.status(400);
    throw new Error("Please confirm your email");
  }

  // Create a login JWT token
  const loginToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Compare entered password with stored password and return a cookie
  if (user && (await bcrypt.compare(password, user.password))) {
    res.cookie("access_token", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  res.json({
    message: "success",
  });
});

//----NEW ROUTE----//
// @desc Get user data
// @route GET /user
// @access private
const getUserPatients = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  // Gets all patients user is a coordinator for
  const patientCoordinator = await Patient.find({})
    .where({ coordinator: user._id })
    .select("-shifts")
    .lean();

  // Gets all patients user is a carer for
  const patientCarer = await Patient.find({})
    .where({ carers: user._id })
    .select("-shifts")
    .lean();


  // Loop through all patients the user is coordinator for
  // Find next shift for that patient and return nextShift(date/carer name) added to patient object
  const patientCoordinatorShift = await Promise.all(
    patientCoordinator.map(async (patient) => {
      const nextCoordinatorShift = await Shift.aggregate([
        {
          $match: {
            patient: patient._id,
            coordinator: user._id,
            shiftStartTime: { $gte: new Date() },
          },
        },
        { $sort: { shiftStartTime: 1 } },
        { $limit: 1 },
      ]);
      
      // If there is a shift scheduled for the patient, get the information for it
      // Else return next shift as null
      if (nextCoordinatorShift.length > 0) {
        const carerName = await User.find({_id : nextCoordinatorShift[0].carer}).select('firstName')
        // If the Carer for the patient is the current user, add the next shift with "You" as the carer name
        // Else, add the next shift with the carer name 
        if(patient.carer == user.id){
        patient["nextShift"] =   [{time: nextCoordinatorShift[0].shiftStartTime, carerName:"You"}]
        }
        else{patient["nextShift"] =  {time: nextCoordinatorShift[0].shiftStartTime, carerName: carerName[0].firstName};}
      } else {
        patient["nextShift"] = null;
      }
      return patient;
    })
  );

  // Loop through all patients the user is carer for
  // Find next shift for that patient and return nextShift added to patient object
  const patientCarerShift = await Promise.all(
    patientCarer.map(async (patient) => {
      const nextCarerShift = await Shift.aggregate([
        {
          $match: {
            patient: patient._id,
            carer: user._id,
            shiftStartTime: { $gte: new Date() },
          },
        },
        { $sort: { shiftStartTime: 1 } },
        { $limit: 1 },
      ]);
      if (nextCarerShift.length > 0) {
        patient["nextShift"] = nextCarerShift[0].shiftStartTime;
      } else {
        patient["nextShift"] = null;
      }
      return patient;
    })
  );
  
  res.status(200).json({ coordinator: patientCoordinatorShift, carer: patientCarerShift });
});

//----NEW ROUTE----//
// @desc Authenticate the user during client-side routing
// @route GET /auth
// @access private
const authUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Clear cookie if the logout flag is set to true
  if (req.query.logout === "true") {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "logged out" });
  } else {
    res
      .status(200)
      .json({ message: "success" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserPatients,
  emailVerification,
  authUser,
};
