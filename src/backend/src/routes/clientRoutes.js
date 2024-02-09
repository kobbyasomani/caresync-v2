const express = require("express");
const clientRouter = express.Router();
const {
  createClient,
  deleteClient,
  updateClient,
  getClientInfo,
} = require("../controllers/clientController");

const { protect } = require("../middleware/authMiddleware");

// Creates client
// @param {firstName, lastName}
clientRouter.route("/").post(protect, createClient);

// Updates/deletes/gets info for client
// @param :id(Id of the client). Id of the client
clientRouter
  .route("/:id")
  .put(protect, updateClient)
  .delete(protect, deleteClient)
  .get(protect, getClientInfo);

module.exports = clientRouter;
