const express = require("express");
const carerRouter = express.Router();
const {
  sendCarerInvite, addCarer
} = require("../controllers/carerController");

const { private } = require("../middleware/authMiddleware");

// Sends invitation email to carer
// @param :id(Id of the patient) {email}
carerRouter.route("/invite/:id").post(private, sendCarerInvite)

// Takes in emailed token and adds carer to the patient
// @param :token(containsID of the patient/ID of the carer) 
carerRouter.route("/add/:token").post(addCarer)


module.exports = carerRouter;