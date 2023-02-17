const express = require("express");
const patientRouter = express.Router();
const {
  createPatient, deletePatient, updatePatient, addCarer
} = require("../controllers/patientController");

const { protect } = require("../middleware/authMiddleware");

patientRouter.route("/").post(protect, createPatient);

patientRouter.route("/:id").put(protect, updatePatient).delete(protect, deletePatient);

patientRouter.route("/carer").post(protect, addCarer)


module.exports = patientRouter;