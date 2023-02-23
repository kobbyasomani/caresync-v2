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
// @param JWT token identity
shiftRouter.route("/").get(protect, getUserShifts)

// Get all shifts for specific patient
// @param {firstName, lastName}
shiftRouter.route("/:patientID").get(protect, getPatientShifts).post(protect, createShift)

// Create a shift 
// @param :patientID variable
shiftRouter.route("/:patientID").post(protect, createShift)

shiftRouter.route("/:shiftID").put(protect, updateShift).delete(protect, deleteShift)







module.exports = shiftRouter;
