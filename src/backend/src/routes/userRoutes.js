const express = require("express");
const userRouter = express.Router();
const {
  registerUser,
  loginUser,
  getUserClients,
  emailVerification,
  resendVerification,
  getUserName
  // authUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");


// Creates user and sends verification email
// @param {firstName, lastName, email, password}
userRouter.post("/register", registerUser);

// Resend a verification email to the user
// @param {email, password}
userRouter.post("/resend-verification", resendVerification);

// Sets "isConfirmed" to true. 
// @param :token variable.  Needs to be sliced from the url on the front end.  Example: const confirmation = window.location.search.slice(1);
userRouter.post("/verification/:token", emailVerification);

// Logs in user and returns JWT token
// @param {email, password}
userRouter.post("/login", loginUser);

// Finds all user clients (both coordinator and carer)
// @param none  (pulls user id from jwt token)
userRouter.get("/", protect, getUserClients);

// Get the human-readable name (first and last) of a user with a given id
// @param {id}
userRouter.post("/name", getUserName);

// Authenticates the user when accessing protected client-side routes
// @param none (pulls user id from jwt token)
// @queryParam set logout to true to log out the user
// userRouter.get("/auth", protect, authUser);


module.exports = userRouter;
