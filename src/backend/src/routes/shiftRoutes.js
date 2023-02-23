const express = require("express");
const shiftRouter = express.Router();
const {
  getUserShifts,
  getPatientShifts,
  createShift,
  updateShift,
  deleteShift
} = require("../controllers/shiftController");

const { protect } = require("../middleware/authMiddleware");

// Get current user shifts
// Creates shift
// @param {firstName, lastName}
shiftRouter.route("/").get(protect, getUserShifts)

// Get all shifts for specific patient
// @param {firstName, lastName}
shiftRouter.route("/:patientID").get(protect, getPatientShifts).post(protect, createShift)

shiftRouter.route("/:patientID/:carerID").post(protect, createShift)





module.exports = shiftRouter;
