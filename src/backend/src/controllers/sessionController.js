const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const Session = require("../models/sessionModel");

//----NEW ROUTE----//
// @desc Create a new user session
// @route POST /session
// @access private
const createSession = asyncHandler(async (req, res) => {
    const user = User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    const userId = user.id;
    const sessionId = uuidv4();
    const sessionData = req.body;

    const newSession = await Session.create({
        sessionId,
        userId,
        sessionData
    });

    if (newSession) {
        res.status(200)
            .json({ message: "Session created successfully." });
    }
});

//----NEW ROUTE----//
// @desc Retrieve the current user session
// @route GET /session
// @access private
const readSession = asyncHandler(async (req, res) => {

});

//----NEW ROUTE----//
// @desc Update the current user session
// @route PUT /session
// @access private
const updateSession = asyncHandler(async (req, res) => {

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