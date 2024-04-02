const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { encryptionKey } = require("../utils/crypto.utils");

//----NEW ROUTE----//
// @desc Create a new user session
// @route POST /session
// @access private
const updateSession = asyncHandler(async (req, res) => {
    const session = req.session;
    const user = User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    if (session) {
        session.clientStore = req.body.sessionData;
        session.userID = req.user.id;
        res.status(200)
            .json({ message: "The user's session was updated." });
    } else {
        res.status(500);
        throw new Error("The user's session could not be updated at this time.");
    }
});

//----NEW ROUTE----//
// @desc Retrieve the current user session
// @route GET /session
// @access private
const readSession = asyncHandler(async (req, res) => {
    const session = req.session;
    if (session.userID === req.user.id) {
        try {
            res.status(200)
                .json({ sessionData: session.clientStore });
        } catch (error) {
            res.status(500);
            throw new Error(error);
        }
    } else {
        res.status(202)
            .json({ message: "Started a new user session." });
    }
});

//----NEW ROUTE----//
// @desc Delete the current user session
// @route DELETE /session
// @access public
const deleteSession = asyncHandler(async (req, res) => {
    const session = req.session;
    if (session) {
        session.destroy(function (error) {
            if (error) {
                res.status(500);
                throw new Error("The user session could not be ended at this time.");
            }
            res.status(200)
                .json({ message: `The user's session was ended.` });
        });
    }
});

module.exports = {
    readSession,
    updateSession,
    deleteSession
}