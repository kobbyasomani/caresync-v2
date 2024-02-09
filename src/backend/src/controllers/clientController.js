const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Client = require("../models/clientModel");

//----- New Route Function------//
// @desc Create client
// @route POST /client
// @access private
const createClient = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
  const coordinator = req.user.id;

  // Ensure all fields are filled out
  if (!firstName || !lastName) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Create Client
  const client = await Client.create({
    firstName,
    lastName,
    coordinator,
  });

  // Return client info
  if (client) {
    res.status(201).json({
      _id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      coordinator: client.coordinator,
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

//----- New Route Function------//
// @desc Update client
// @route PUT /client/:id
// @access private
const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  // Client Check
  if (!client) {
    res.status(400);
    throw new Error("Client not found");
  }

  const user = await User.findById(req.user.id);

 

  // Make sure logged in user matches the coordinator user
  if (client.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  const updatedClient = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedClient);
});

//----- New Route Function------//
// @desc Delete client
// @route DELETE /client/:id
// @access private
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  // Client Check
  if (!client) {
    res.status(400);
    throw new Error("Client not found");
  }

  const user = await User.findById(req.user.id);

  // Make sure logged in user matches the coordinator user
  if (client.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  await client.remove();
  res.status(200).json({ message: `Deleted client ${req.params.id}` });
});


//----- New Route Function------//
// @desc Get client
// @route GET /client/:id
// @access private
const getClientInfo = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id)
    .select("-shifts")
    .lean();

  // Client Check
  if (!client) {
    res.status(400);
    throw new Error("Client not found");
  }

  // Find user by id
  const user = await User.findById(req.user.id);

  // Make sure logged in user matches the coordinator or carer
  if (
    client.coordinator.toString() !== user.id &&
    !client.carers.toString().includes(user.id)
  ) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Create and set a value for isCoordinator for use in setting state on the front end
  if (client.coordinator.toString() == user.id) {
    client["isCoordinator"] = true;
  } else {
    client["isCoordinator"] = false;
  }

  // If there are carers, find there first and last name and stick them in the client object for display
  if (client.carers) {
    const carers = await User.find()
      .where("_id")
      .in(client.carers)
      .select("firstName")
      .select("lastName");
    client.carers = carers;
  }
  // Find coordinator first and last name and stick them in the client object for display
  const coordinator = await User.find({ _id: client.coordinator })
    .select("firstName")
    .select("lastName");
  client.coordinator = coordinator[0];

  res.status(200).json({ client });
});

module.exports = {
  createClient,
  updateClient,
  deleteClient,
  getClientInfo,
};
