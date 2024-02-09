const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const User = require("../models/userModel");
const Client = require("../models/clientModel");
const emails = require("../services/email");

//----- New Route Function------//
// @desc Sends email invitation to carer 
// @route POST /invite/:id
// @access private
const sendCarerInvite = asyncHandler(async (req, res) => {
  // Find client with ID
  const client = await Client.findById(req.params.id);

  // Client Check
  if (!client) {
    res.status(400);
    throw new Error("Client not found");
  }

  // Find carer with email
  const carer = await User.findOne({ email: req.body.email });

  // Carer Check
  if (!carer) {
    res.status(400);
    throw new Error("Carer has not made an account yet");
  }

  // Current user
  const user = await User.findById(req.user.id);

  // Make sure logged in user matches the coordinator user
  if (client.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Client full name for email
  const clientFullName = `${client.firstName} ${client.lastName}`;

  // ID for carer (email token)
  const carerID = carer.id;

  // ID for client (email token)
  const clientID = client.id;

  // Generates JWT token for adding client
  const emailToken = jwt.sign({ carerID, clientID }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Sends verification email to user
  emails.addCarerEmail(
    carer.firstName,
    req.body.email,
    clientFullName,
    emailToken
  );

  // Confirmation
  res.status(200).json({
    message: "Email Sent",
  });
});

//----- New Route Function------//
// @desc Adds carer to client from email token
// @route POST /add/:token
// @access public
const addCarer = asyncHandler(async (req, res) => {
  // Retrieve info from token
  const decode = jwt_decode(req.params.token);

  // Set variables equal to token data
  const { carerID, clientID } = decode;

  // Find client with ID
  const client = await Client.findById(clientID);

  //  Find carer with email
  const carer = await User.findById(carerID);

  // Client Check
  if (!client) {
    res.status(400);
    throw new Error("Client not found");
  }

  // Carer Check
  if (!carer) {
    res.status(400);
    throw new Error("Carer has not made an account yet");
  }

  // Check if the carer has already been added to carers array
  // Add if they have not already been added
  if (!client.carers.includes(carerID)) {
    const updatedClient = await Client.findByIdAndUpdate(
      clientID,
      { $push: { carers: carerID } },
      { new: true }
    );
    res.status(200).json(updatedClient);
  } else {
    res.status(400);
    throw new Error("Carer already exists");
  }
});

//----- New Route Function------//
// @desc Removes carer from client
// @route DELETE /remove/:clientID/:carerID
// @access private
const removeCarer = asyncHandler(async (req, res) => {
  // Find client based on client ID sent in route url
  const client = await Client.findById(req.params.clientID);

  // Client Check
  if (!client) {
    res.status(400);
    throw new Error("Client not found");
  }

  // Find current user
  const user = await User.findById(req.user.id);

  // Make sure logged in user matches the coordinator user
  if (client.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Set carer ID to the carerID sent in route url
  const carerID = req.params.carerID;

  // Check if the carer exists for the client
  // Remove if they do exist
  if (client.carers.includes(carerID)) {
    const updatedClient = await Client.findByIdAndUpdate(
      client.id,
      { $pull: { carers: carerID } },
      { new: true }
    );
    res.status(200).json(updatedClient);
  } else {
    res.status(400);
    throw new Error("Carer does not exist");
  }
});

module.exports = {
  sendCarerInvite,
  addCarer,
  removeCarer,
};
