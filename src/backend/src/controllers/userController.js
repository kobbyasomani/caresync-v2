const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const express = require("express");
const emails = require("../services/email");

//----NEW ROUTE----//
// @desc Register User
// @route POST /user/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  //Ensure all fields are filled out
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("This email is associated with an account already.");
  }

  // Password encryption
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  // Generates JWT token for verification
  const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Sends verification email to user
  emails.verifyUserEmail(firstName, email, emailToken);

  if (user) {
    res.status(201).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

//----NEW ROUTE----//
// @desc Verify Email
// @route POST /user/emailVerification
// @access public
const emailVerification = asyncHandler(async (req, res) => {
  // Extract info from JWT
  const decode = jwt_decode(req.params.token);

  // Search for user with email from JWT
  const user = await User.findOne({ email: decode.email });

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  // Change isConfirmed to true
  const verifyUser = await User.findByIdAndUpdate(user.id, {
    isConfirmed: true,
  });
  res.status(200).json(verifyUser);

  console.log(user.id);
});

//----NEW ROUTE----//
// @desc Login User
// @route POST /user/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Current user ID
  const id = user.id;

  //Ensure all fields are filled out
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Check if the account has been confirmed yet
  if (!user.isConfirmed) {
    res.status(400);
    throw new Error("Please confirm your email");
  }

  // Create a login JWT token
  const loginToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Compare entered password with stored password and return a cookie
  if (user && (await bcrypt.compare(password, user.password))) {
    res.cookie("access_token", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  res.json({
    message: "success",
  });
});

//----NEW ROUTE----//
// @desc Get user data
// @route POST /user/me
// @access private
const getUser = asyncHandler(async (req, res) => {
  res.json({
    message: "User data",
  });
});

// Generates JWT token for login
const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  emailVerification,
};
