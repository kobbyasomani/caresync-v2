const express = require("express");
const userRouter = express.Router();
const {
  registerUser,
  registerDemoUser,
  loginUser,
  logoutUser,
  getUserClients,
  emailVerification,
  resendVerification,
  getUserName,
  getUser,
  updateUser
  // authUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");


// Creates user and sends verification email
// @param {firstName, lastName, email, password}
userRouter.post("/register", registerUser);

// Set up a temporary demo account
// @param none (demo credentials will be created by the server)
userRouter.get("/register-demo", registerDemoUser);

// Resend a verification email to the user
// @param {email, password}
userRouter.post("/resend-verification", resendVerification);

// Sets "isConfirmed" to true. 
// @param :token variable.  Needs to be sliced from the url on the front end.  Example: const confirmation = window.location.search.slice(1);
userRouter.post("/verification/:token", emailVerification);

// Logs in user and returns JWT token
// @param {email, password}
userRouter.post("/login", loginUser);

// Logs out the user and destroys their session
// @param none
userRouter.get("/logout", logoutUser);

// Finds all user clients (both coordinator and carer)
// @param none  (pulls user id from jwt token)
userRouter.get("/", protect, getUserClients);

// Get the human-readable name (first and last) of a user with a given id
// @param {id}
userRouter.post("/name", protect, getUserName);

// Get all user fields excluding the password
// @param :id
// Update the given user fields
// @param {firstName, lastName, email, password}
userRouter.route("/my-account").get(protect, getUser).put(protect, updateUser);

// Authenticates the user when accessing protected client-side routes
// @param none (pulls user id from jwt token)
// @queryParam set logout to true to log out the user
// userRouter.get("/auth", protect, authUser);


module.exports = userRouter;
