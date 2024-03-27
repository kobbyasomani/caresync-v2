const Router = require("express");
const {
    createSession,
    readSession,
    updateSession,
    deleteSession
} = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");

const sessionRouter = Router();

// CRUD a user session
// @param User's id will be retrieved from the JWT stored in the HttpOnly cookie for session creation.
// Subsequent calls to get, put, or delete sessions will retrieve the sessionId from the JWT token.
sessionRouter.route("/")
    .post(protect, createSession)
    .get(protect, readSession)
    .put(protect, updateSession)
    .delete(protect, deleteSession)

module.exports = sessionRouter;