const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const User = require("../models/userModel");
const Patient = require("../models/patientModel");
const Shift = require("../models/shiftModel");
const emails = require("../services/email");
const { request } = require("express");

//----NEW ROUTE----//
// @desc Get shifts for current user
// @route GET /
// @access private
const getUserShifts = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  //Find all shifts for the current logged in user
  const userShifts = await Shift.find({ carer: user.id });

  res.status(200).json(userShifts);
});

//----NEW ROUTE----//
// @desc Get shifts for specified patient
// @route GET /shifts/:patientID
// @access private
const getPatientShifts = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);
  // Search for patient with URL variable
  const patient = await Patient.findById(req.params.patientID);

  // User Check
  if (!patient) {
    res.status(400);
    throw new Error("Patient not found");
  }

  // Make sure logged in user matches the coordinator or carer
  if (
    patient.coordinator.toString() !== user.id &&
    !patient.carers.toString().includes(user.id)
  ) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  //Find all shifts for the current logged in user/ order them from oldest to newest
  const patientShifts = await Shift.aggregate([
    {
      $match: {
        patient: patient._id,
      },
    },
    { $sort: { shiftStartTime: 1 } },
  ]);
  res.status(200).json(patientShifts);
});

const createShift = asyncHandler(async (req, res) => {
  const { carerID, shiftStartTime, shiftEndTime, coordinatorNotes } = req.body;

  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Search for patient with URL variable
  const patient = await Patient.findById(req.params.patientID);

  // Patient Check
  if (!patient) {
    res.status(400);
    throw new Error("Patient not found");
  }

  // Search for patient with URL variable
  const carer = await User.findById(carerID);

  // Patient Check
  if (!carer) {
    res.status(400);
    throw new Error("Carer not found");
  }

  // Make sure logged in user matches the coordinator
  if (patient.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Create shift
  const shift = await Shift.create({
    patient: patient._id,
    coordinator: user.id,
    coordinatorNotes,
    carer: carer.id,
    shiftStartTime: shiftStartTime,
    shiftEndTime: shiftEndTime,
  });

  // Return shift info
  if (shift) {
    res.status(201).json({
      _id: shift.id,
      patient: patient._id,
      coordinator: user.id,
      coordinatorNotes,
      carer: carer.id,
      shiftStartTime: shiftStartTime,
      shiftEndTime: shiftEndTime,
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const updateShift = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Find shift
  const shift = await Shift.findById(req.params.shiftID);

  // Make sure logged in user matches the coordinator
  if (shift.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  const updatedShift = await Shift.findByIdAndUpdate(
    req.params.shiftID,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedShift);
});

const deleteShift = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Find shift
  const shift = await Shift.findById(req.params.shiftID);

  // Make sure logged in user matches the coordinator
  if (shift.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Delete shift
  await shift.remove();
  res.status(200).json({ message: `Deleted shift ${req.params.shiftID}` });
});

module.exports = {
  getUserShifts,
  getPatientShifts,
  createShift,
  updateShift,
  deleteShift,
};
