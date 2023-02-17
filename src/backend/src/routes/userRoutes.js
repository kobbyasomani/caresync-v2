const express = require("express");
const userRouter = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  emailVerification
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/me", protect, getUser);

userRouter.post("/emailVerification/:token", emailVerification);

module.exports = userRouter;
