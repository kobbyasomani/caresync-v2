const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Client = require("../models/clientModel");
const Shift = require("../models/shiftModel");
const emails = require("../services/email");
const { v4: uuidv4 } = require("uuid");
const { deleteSession } = require("../controllers/sessionController");

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
  const firstName = "Demo";
  const lastName = "User";
  const email = `${uuidv4().slice(0, 9)}@example.com`;
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
    const userId = user.id;

    // Create a login JWT token
    const loginToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Compare entered password with stored password and
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create sample client
      const sampleClient = await Client.create({
        firstName: "Alex",
        lastName: "Doe",
        coordinator: userId,
        carers: [userId]
      });

      // Create sample shift
      shiftStartTime = new Date(new Date().setMinutes(0, 0, 0));
      shiftEndTime = new Date(shiftStartTime);
      shiftEndTime.setHours(shiftStartTime.getHours() + 8);
      const sampleShift = await Shift.create({
        client: sampleClient.id,
        coordinator: userId,
        coordinatorNotes: "These are some sample Coordinator Notes.\n\n\
As a client's coordinator, you can use these notes to provide tips, \
reminders, or any other useful information that the carer should know \
during the shift.\n\n\
Example: Please ensure that Alex's room is kept tidy and organised, and that all of their \
personal belongings are in their designated places when you finish up your shift.",
        carer: userId,
        shiftStartTime,
        shiftEndTime,
        shiftNotes: {
          shiftNotesText: "These are some sample Shift Notes.\n\n\
Use Shift Notes to give an overview of the main events of the care shift \
for later reference. Shift Notes can be uploaded to the cloud and \
downloaded as PDF.\n\n\
Example: Today's shift with Alex, was a pleasant experience. \
I arrived at the scheduled time and was warmly greeted by Alex. We spent some \
time chatting about their day and any concerns they had. I helped them tidy up \
their living room and kitchen, and we prepared a light evening meal together."
        },
        incidentReports: [
          {
            incidentReportText: "This is a sample Incident Report.\n\n\
Create Incident Reports to document events during the shift that impact \
a client's health, safety, or general wellbeing. Incident reports can be \
uploaded to the cloud and downloaded as a PDF.\n\n\
Incident Reports might include documentation of accidents or injuries, observed behaviour and \
emotional state, environmental factors, or any other daily living or quality of life issues \
that need to be recorded for later reference.\n\n\
Example: During mealtime, Alex spilled some hot soup on themselves. \
I quickly helped clean it up, checked that they weren't burned, and helped changed them into a fresh \
shirt. They were a bit flustered, but otherwise ok."
          }
        ],
        handoverNotes: "These are some sample Handover Notes.\n\n\Use Handover Notes to \
provide information that will be useful for the client's next care shift. This might \
include things to follow up on during the next shift, or tips to improve the quality of care.\n\n\
Handover Notes from a shift will appear in a card at the top of the subsequent shift's Shift Details Panel, \
below the Coordinator Notes if any are present.\n\n\
Example: For the next shift, please make sure to remind Alex of their scheduled appointments for \
the day and assist them in preparing for them. They are also enjoying reading a couple of \
new books, so if they ask for any, you can find them on the shelf next to their bed."
      });

      // Add sample shift to sample client shifts
      await Client.findByIdAndUpdate(sampleClient.id,
        { $push: { shifts: sampleShift._id } });

      // Return cookies
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
    res.status(error.status);
    throw new Error(error.message);
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
// @desc Log out User
// @route GET /user/logout
// @access public
const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("authenticated");
    res.clearCookie("access_token");
    res.clearCookie("connect.sid");
    deleteSession(req, res);
  }
  catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
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
// @access private
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
// @route GET /user/my-account
// @access private
const getUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user) {
    res.status(200).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isConfirmed: user.isConfirmed,
      createdAt: user.createdAt
    });
  } else {
    res.status(404);
    throw new Error("The user could not be found.");
  }
});

//----NEW ROUTE----//
// @desc Update the given user fields
// @route PUT /user/my-account
// @access private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const formFields = { ...req.body };

  if (!user) {
    res.status(404);
    throw new Error("The user could not be found.");
  }

  // Check that fields are valid for update, exist, and prevent them from being left blank/nullified
  const validFields = ["firstName", "lastName", "email", "password"];
  const updateFields = {};
  for (const field in formFields) {
    if (validFields.includes(field) && formFields[field] !== "") {
      updateFields[field] = formFields[field];
    }
  }

  // If the password has been updated, salt and hash the new password before setting it
  if ("password" in formFields && formFields.password) {
    const samePassword = await bcrypt.compare(formFields.password, user.password);
    if (samePassword) {
      res.status(400);
      throw new Error("The new password you have entered is the same as your existing one.");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(formFields.password, salt);
    updateFields.password = hashedPassword;

    const hashSuccessful = await bcrypt.compare(formFields.password, updateFields.password);
    if (!hashSuccessful) {
      res.status(500);
      throw new Error("The password could not be updated at this time. Please try again.");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(user.id,
    { $set: updateFields },
    { new: true }).select("_id firstName lastName email isConfirmed createdAt").lean();

  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(500);
    throw new Error("The account could not be updated at this time. Please try again.");
  }
});

//----NEW ROUTE----//
// @desc Delete the given user
// @route DELETE /user/my-account
// @access private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("The user could not be found.");
  }

  try {
    await User.findByIdAndDelete(user.id);
    res.status(200)
      .json({ message: "The user account has been deleted." });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  registerUser,
  registerDemoUser,
  loginUser,
  logoutUser,
  getUserClients,
  emailVerification,
  resendVerification,
  getUserName,
  getUser,
  updateUser,
  deleteUser
};
