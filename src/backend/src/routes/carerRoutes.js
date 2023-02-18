const express = require("express");
const carerRouter = express.Router();
const {
  sendCarerInvite, addCarer, removeCarer
} = require("../controllers/carerController");

const { protect } = require("../middleware/authMiddleware");

// Sends invitation email to carer
// @param :id(Id of the patient) {email}
carerRouter.route("/invite/:id").post(protect, sendCarerInvite)

// Takes in emailed token and adds carer to the patient
// @param :token(containsID of the patient/ID of the carer) 
carerRouter.route("/add/:token").post(addCarer)

// Takes in emailed token and adds carer to the patient
// @param :token(containsID of the patient/ID of the carer) 
carerRouter.route("/remove/:patientID/:carerID").delete(protect, removeCarer)


module.exports = carerRouter;