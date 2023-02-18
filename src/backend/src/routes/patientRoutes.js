const express = require("express");
const patientRouter = express.Router();
const {
  createPatient, deletePatient, updatePatient
} = require("../controllers/patientController");

const { private } = require("../middleware/authMiddleware");


// Creates patient
// @param {firstName, lastName}
patientRouter.route("/").post(private, createPatient);

// Updates/deletes patient
// @param :id(Id of the patient). Id of the patient
patientRouter.route("/:id").put(private, updatePatient).delete(private, deletePatient);



module.exports = patientRouter;