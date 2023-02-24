const express = require("express");
const shiftRouter = express.Router();
const {
  getUserShifts,
  getPatientShifts,
  createShift,
  updateShift,
  deleteShift,
  createShiftNotes

} = require("../controllers/shiftController");

const { protect } = require("../middleware/authMiddleware");

// Get current user shifts
// Creates shift
// @param JWT token identity
shiftRouter.route("/").get(protect, getUserShifts)

// Get all shifts for specific patient/create a shift
// @param :patientID url variable
shiftRouter.route("/:patientID").get(protect, getPatientShifts).post(protect, createShift)

// Update a shift 
// @param :shiftID url variable + input key(s): carerID, shiftStartTime, shiftEndTime, coordinatorNotes (will update only what you send)
// Delete a shift 
// @param :shiftID url variable
shiftRouter.route("/:shiftID").put(protect, updateShift).delete(protect, deleteShift)


// Delete a shift 
// @param :shiftID url variable
shiftRouter.route("/notes/:shiftID").post(protect, createShiftNotes)







module.exports = shiftRouter;
