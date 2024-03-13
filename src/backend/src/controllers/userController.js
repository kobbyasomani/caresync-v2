const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Client = require("../models/clientModel");
const Shift = require("../models/shiftModel");
const emails = require("../services/email");
const { v4: uuidv4 } = require("uuid");

//----NEW ROUTE----//
// @desc Register User
// @route POST /user/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Ensure all fields are filled out
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Ensure password is at least 8 characters
  if (password.length < 8) {
    res.status(400);
    throw new Error("Passwords must be more than 8 characters long");
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

  // Return new user object without password
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
// @desc Register demo User
// @route GET /user/register-demo
// @access public
const registerDemoUser = asyncHandler(async (req, res) => {
  // Generate demo firstname, lastname, email and password
  const firstName = "Guest";
  const lastName = "User";
  const email = `${uuidv4()}@example.com`;
  const password = `${uuidv4().slice(0, 9)}`;

  // Password encryption
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    isConfirmed: true
  });

  if (!user) {
    res.status(400).json({
      message: "The user could not be created at this time."
    })
  }

  try {
    const id = user.id;

    // Create a login JWT token
    const loginToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Compare entered password with stored password and return a cookie
    if (user && (await bcrypt.compare(password, user.password))) {
      res
        .cookie("access_token", loginToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          domain: process.env.COOKIE_URL,
          sameSite: "none",
        })
        .cookie("authenticated", "true", {
          secure: process.env.NODE_ENV === "production",
          domain: process.env.COOKIE_URL,
          sameSite: "none",
        })
        .status(200).json({
          message: "Logged in Successfully",
          user: {
            firstName: user.firstName,
            _id: user._id,
          },
        });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  }
  catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

//----NEW ROUTE----//
// @desc Resend Verification
// @route POST /user/resendVerification
// @access public
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  //Ensure all fields are filled out
  if (!email) {
    res.status(400);
    throw new Error("Please enter your email address.");
  }

  // Find user by email
  const user = await User.findOne({ email });

  // Current user ID
  if (!user) {
    res.status(404);
    throw new Error("Please check your email address.")
  }

  const id = user.id;
  const firstName = user.firstName;

  // Generates JWT token for verification
  const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Sends verification email to user
  emails.verifyUserEmail(firstName, email, emailToken);

  res.status(200).json({
    message:
      `A verification email has been set to: ${email}. Click the link in the email to verify your account.`
  })

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

  res.status(200).json({ message: "Email successfully confirmed." });
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
  if (!user) {
    res.status(404);
    throw new Error("Please check your email and password.")
  }

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
    res
      .cookie("access_token", loginToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        domain: process.env.COOKIE_URL,
        sameSite: "none",
      })
      .cookie("authenticated", "true", {
        secure: process.env.NODE_ENV === "production",
        domain: process.env.COOKIE_URL,
        sameSite: "none",
      });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }


  res.status(200).json({
    message: "Logged in Successfully",
    user: {
      firstName: user.firstName,
      _id: user._id,
    },
  });
});

//----NEW ROUTE----//
// @desc Get user data
// @route GET /user
// @access private
const getUserClients = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();

  // Gets all clients user is a coordinator for
  const clientCoordinator = await Client.find({})
    .where({ coordinator: user._id })
    .select("-shifts")
    .lean();

  // Gets all clients user is a carer for
  const clientCarer = await Client.find({})
    .where({ carers: user._id })
    .select("-shifts")
    .lean();

  // Loop through all clients the current user is coordinator for
  // Find next shift for that client and return nextShift(date/carer name) added to client object
  const clientCoordinatorShift = await Promise.all(
    clientCoordinator.map(async (client) => {
      const nextCoordinatorShift = await Shift.aggregate([
        {
          $match: {
            client: client._id,
            coordinator: user._id,
            shiftStartTime: { $gte: new Date() },
          },
        },
        { $sort: { shiftStartTime: 1 } },
        { $limit: 1 },
      ]);
      // If there is a shift scheduled for the client, get the information for it
      // Else return next shift as null
      if (nextCoordinatorShift.length > 0) {
        const carerName = await User.find({
          _id: nextCoordinatorShift[0].carer,
        }).select("firstName lastName");
        // If the Carer for the client is the current user, add the next shift with "You" as the carer name
        // Else, add the next shift with the carer name
        if (
          new Object(nextCoordinatorShift[0].carer).toString() ==
          new Object(user._id).toString()
        ) {
          client["nextShift"] = {
            time: nextCoordinatorShift[0].shiftStartTime,
            carerName: "You"
          };
        } else {
          client["nextShift"] = {
            time: nextCoordinatorShift[0].shiftStartTime,
            carerName: `${carerName[0].firstName} ${carerName[0].lastName}`,
          };
        }
      } else {
        client["nextShift"] = null;
      }
      return client;
    })
  );

  // Loop through all clients the current user is carer for
  // Find next shift for that client and return nextShift added to client object
  const clientCarerShift = await Promise.all(
    clientCarer.map(async (client) => {
      const nextCarerShift = await Shift.aggregate([
        {
          $match: {
            client: client._id,
            // carer: user._id,
            shiftStartTime: { $gte: new Date() },
          },
        },
        { $sort: { shiftStartTime: 1 } },
        { $limit: 1 },
      ]);
      if (nextCarerShift.length > 0) {
        const carerName = await User.find({
          _id: nextCarerShift[0].carer,
        }).select("firstName lastName");
        if (
          new Object(nextCarerShift[0].carer).toString() ==
          new Object(user._id).toString()
        ) {
          client["nextShift"] = {
            time: nextCarerShift[0].shiftStartTime,
            carerName: "You",
          };
        } else {
          client["nextShift"] = {
            time: nextCarerShift[0].shiftStartTime,
            carerName: `${carerName[0].firstName} ${carerName[0].lastName}`,
          };
        }
      } else {
        client["nextShift"] = null;
      }
      return client;
    })
  );

  res
    .status(200)
    .json({ coordinator: clientCoordinatorShift, carer: clientCarerShift });
});

//----NEW ROUTE----//
// @desc Get user id, firstName, and lastName
// @route POST /user/name
// @access public
const getUserName = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const user = await User.findOne({ _id: id }).select("_id firstName lastName");

  if (user) {
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } else {
    res.status(404).json({ message: "The user could not be found." })
  }
});

//----NEW ROUTE----//
// @desc Get all user fields except for password
// @route GET /user/my-account/:id
// @access private
const getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // Users can only retrieve all account fields related to their own acount
  if (id !== req.user.id) {
    res.status(401);
    throw new Error("The user is not allowed to access this account.")
  }
  const user = await User.findOne({ _id: id }).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("The user could not be found.");
  }
});

module.exports = {
  registerUser,
  registerDemoUser,
  loginUser,
  getUserClients,
  emailVerification,
  resendVerification,
  getUserName,
  getUser
};
