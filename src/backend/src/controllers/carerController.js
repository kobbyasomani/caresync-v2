const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const User = require("../models/userModel");
const Patient = require("../models/patientModel");
const emails = require("../services/email");
const { request } = require("express");

//----- New Route Function------//
// @desc Sends email invitation to carer to add to team
// @route POST
// @access private
const sendCarerInvite = asyncHandler(async (req, res) => {
  // Find patient with ID
  const patient = await Patient.findById(req.params.id);

  // Patient Check
  if (!patient) {
    res.status(400);
    throw new Error("Patient not found");
  }

  // Find carer with email
  const carer = await User.findOne({ email: req.body.email });

  // Carer Check
  if (!carer) {
    res.status(400);
    throw new Error("Carer has not made an account yet");
  }

  // Current user
  const user = await User.findById(req.user.id);

  // Make sure logged in user matches the coordinator user
  if (patient.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Patient full name for email
  const patientFullName = `${patient.firstName} ${patient.lastName}`;

  // ID for carer (email token)
  const carerID = carer.id;

  // ID for patient (email token)
  const patientID = patient.id;

  // Generates JWT token for adding patient
  const emailToken = jwt.sign({ carerID, patientID }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Sends verification email to user
  emails.addCarerEmail(
    carer.firstName,
    req.body.email,
    patientFullName,
    emailToken
  );

  // Confirmation
  res.status(200).json({
    message: "Email Sent",
  });
});

//----- New Route Function------//
// @desc Adds carer to patient from email token
// @route POST
// @access public
const addCarer = asyncHandler(async (req, res) => {
  // Retrieve info from token
  const decode = jwt_decode(req.params.token);

  // Set variables equal to token data
  const { carerID, patientID } = decode;

  // Find patient with ID
  const patient = await Patient.findById(patientID);

  //  Find carer with email
  const carer = await User.findById(carerID);

  // Patient Check
  if (!patient) {
    res.status(400);
    throw new Error("Patient not found");
  }

  // Carer Check
  if (!carer) {
    res.status(400);
    throw new Error("Carer has not made an account yet");
  }

  // Check if the carer has already been added to carers array
  // Add if they have not already been added
  if (!patient.carers.includes(carerID)) {
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientID,
      { $push: { carers: carerID } },
      { new: true }
    );
    res.status(200).json(updatedPatient);
  } else {
    res.status(400);
    throw new Error("Carer already exists");
  }
});

//----- New Route Function------//
// @desc Removes carer from patient
// @route DELETE
// @access private
const removeCarer = asyncHandler(async (req, res) => {
  // Find patient based on patient ID sent in route url
  const patient = await Patient.findById(req.params.patientID);

  // Patient Check
  if (!patient) {
    res.status(400);
    throw new Error("Patient not found");
  }

  // Find current user
  const user = await User.findById(req.user.id);

  // Make sure logged in user matches the coordinator user
  if (patient.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Set carer ID to the carerID sent in route url
  const carerID = req.params.carerID;

  // Check if the carer exists for the patient
  // Remove if they do exist
  if (patient.carers.includes(carerID)) {
    const updatedPatient = await Patient.findByIdAndUpdate(
      patient.id,
      { $pull: { carers: carerID } },
      { new: true }
    );
    res.status(200).json(updatedPatient);
  } else {
    res.status(400);
    throw new Error("Carer does not exist");
  }
});

module.exports = {
  sendCarerInvite,
  addCarer,
  removeCarer,
};
