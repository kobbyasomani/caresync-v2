const express = require("express");
const carerRouter = express.Router();
const {
  sendCarerInvite, addCarer, removeCarer
} = require("../controllers/carerController");

const { protect } = require("../middleware/authMiddleware");

// Sends invitation email to carer
// @param :id(Id of the patient) {email}
carerRouter.route("/invite/:id").post(protect, sendCarerInvite)

// Takes in emailed token and adds carer to the patient's team
// @param :token(containsID of the patient/ID of the carer) 
carerRouter.route("/add/:token").post(addCarer)

// Removes a carer from a patient's team
// @param :patientID and :carerID 
carerRouter.route("/remove/:patientID/:carerID").delete(protect, removeCarer)


module.exports = carerRouter;