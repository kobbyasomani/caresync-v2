const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { encryptionKey } = require("../utils/crypto.utils");

//----NEW ROUTE----//
// @desc Create a new user session
// @route POST /session
// @access private
const createSession = asyncHandler(async (req, res) => {
    const session = req.session;
    const user = User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }
    if (session) {
        // TODO: Check if session with the same id already exists, if so pass the request to the updateSession route.
        session.clientStore = req.body;
        res.status(200)
            .json({ message: "Session created successfully." });
    } else {
        res.status(500);
        throw new Error("A user session could not be created at this time.");
    }
});

//----NEW ROUTE----//
// @desc Retrieve the current user session
// @route GET /session
// @access private
const readSession = asyncHandler(async (req, res) => {
    const session = req.session;

});

//----NEW ROUTE----//
// @desc Update the current user session
// @route PUT /session
// @access private
const updateSession = asyncHandler(async (req, res) => {
    const session = req.session;

    if (session) {

    }
});

const deleteSession = asyncHandler(async (req, res) => {

});

//----NEW ROUTE----//
// @desc Delete the current user session
// @route DELETE /session
// @access private

module.exports = {
    createSession,
    readSession,
    updateSession,
    deleteSession
}