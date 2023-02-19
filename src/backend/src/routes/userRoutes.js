const express = require("express");
const userRouter = express.Router();
const {
  registerUser,
  loginUser,
  getUserPatients,
  emailVerification
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");


// Creates user and sends verification email
// @param {firstName, lastName, email, password}
userRouter.post("/register", registerUser);

// Sets "isConfirmed" to true. 
// @param :token variable.  Needs to be sliced from the url on the front end.  Example: const confirmation = window.location.search.slice(1);
userRouter.post("/verification/:token", emailVerification);

// Logs in user and returns JWT token
// @param {email, password}
userRouter.post("/login", loginUser);

// Finds all user patients (both coordinator and carer)
// @param none  (pulls user id from jwt token)
userRouter.get("/", protect, getUserPatients); 



module.exports = userRouter;
