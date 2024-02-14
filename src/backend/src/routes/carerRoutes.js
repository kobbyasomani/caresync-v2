const express = require("express");
const carerRouter = express.Router();
const {
  sendCarerInvite, addCarer, addCoordinatorAsCarer, removeCarer,
} = require("../controllers/carerController");

const { protect } = require("../middleware/authMiddleware");

// Sends invitation email to carer
// @param :id(Id of the client) {email}
carerRouter.route("/invite/:id").post(protect, sendCarerInvite)

// Takes in emailed token and adds carer to the client's team
// @param :token(containsID of the client/ID of the carer) 
carerRouter.route("/add/:token").post(addCarer)

// Add the coordinator as the carer for the selected client
carerRouter.route("/add-coordinator-as-carer").post(addCoordinatorAsCarer)

// Removes a carer from a client's team
// @param :clientID and :carerID 
carerRouter.route("/remove/:clientID/:carerID").delete(protect, removeCarer)


module.exports = carerRouter;