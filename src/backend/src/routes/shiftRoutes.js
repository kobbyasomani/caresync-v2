const express = require("express");
const shiftRouter = express.Router();
const {
  getUserShifts,
  getClientShifts,
  createShift,
  updateShift,
  deleteShift,
  createShiftNotes,
  createIncidentReport, 
  createHandover

} = require("../controllers/shiftController");

const { protect } = require("../middleware/authMiddleware");

// Get current user shifts
// Creates shift
// @param JWT token identity
shiftRouter.route("/").get(protect, getUserShifts)

// Get all shifts for specific client/create a shift
// @param :clientID url variable
shiftRouter.route("/:clientID").get(protect, getClientShifts).post(protect, createShift)

// Update a shift 
// @param :shiftID url variable + input key(s): carerID, shiftStartTime, shiftEndTime, coordinatorNotes (will update only what you send)
// Delete a shift 
// @param :shiftID url variable
shiftRouter.route("/:shiftID").put(protect, updateShift).delete(protect, deleteShift)


// Create handover notes
// @param :shiftID url variable + {handoverNotes}
shiftRouter.route("/handover/:shiftID").put(protect, createHandover)


// Create shift notes
// @param :shiftID url variable + {shiftNotes}
shiftRouter.route("/notes/:shiftID").post(protect, createShiftNotes)

// Create an incident report
// @param :shiftID url variable + {incidentReport}
shiftRouter.route("/reports/:shiftID").post(protect, createIncidentReport )







module.exports = shiftRouter;
