const express = require("express");
const patientRouter = express.Router();
const {
  createPatient, deletePatient, updatePatient, addCarer
} = require("../controllers/patientController");

const { protect } = require("../middleware/authMiddleware");


// Creates patient
// @param {firstName, lastName}
patientRouter.route("/").post(protect, createPatient);

// Updates/deletes patient
// @param :id(Id of the patient). Id of the patient
patientRouter.route("/:id").put(protect, updatePatient).delete(protect, deletePatient);


// Sends invitation email to carer
// @param :id(Id of the patient) {email}
patientRouter.route("/:id/carer").post(protect, addCarer)


module.exports = patientRouter;