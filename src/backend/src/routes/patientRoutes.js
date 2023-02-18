const express = require("express");
const patientRouter = express.Router();
const {
  createPatient, deletePatient, updatePatient
} = require("../controllers/patientController");

const { protect } = require("../middleware/authMiddleware");


// Creates patient
// @param {firstName, lastName}
patientRouter.route("/").post(protect, createPatient);

// Updates/deletes patient
// @param :id(Id of the patient). Id of the patient
patientRouter.route("/:id").put(protect, updatePatient).delete(protect, deletePatient);



module.exports = patientRouter;