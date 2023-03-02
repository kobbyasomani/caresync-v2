const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Patient = require("../models/patientModel");
const Shift = require("../models/shiftModel");
const { cloudinaryUpload, createPDF } = require("../utils/helper.utils");

//----NEW ROUTE----//
// @desc Get shifts for current user
// @route GET /shift
// @access private
const getUserShifts = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // Find all shifts for the current logged in user
  const userShifts = await Shift.find({ carer: user.id });

  // Return all shifts for current user
  res.status(200).json(userShifts);
});

//----NEW ROUTE----//
// @desc Get shifts for specified patient
// @route GET /shift/:patientID
// @access private
const getPatientShifts = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);
  // Search for patient with URL variable
  const patient = await Patient.findById(req.params.patientID);

  // User Check
  if (!patient) {
    res.status(400);
    throw new Error("Patient not found");
  }

  // Make sure logged in user matches the coordinator or carer
  if (
    patient.coordinator.toString() !== user.id &&
    !patient.carers.toString().includes(user.id)
  ) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Find all shifts for the current patient. Join carer first/last name
  const patientShifts = await Shift.find({patient: patient.id}).populate("carer", "firstName lastName" )
  
  res.status(200).json(patientShifts);
});

//----NEW ROUTE----//
// @desc Create shift for specified patient
// @route Post /shift/:patientID
// @access private
const createShift = asyncHandler(async (req, res) => {
  const { carerID, shiftStartTime, shiftEndTime, coordinatorNotes } = req.body;

  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // Search for patient with URL variable
  const patient = await Patient.findById(req.params.patientID);

  // Patient Check
  if (!patient) {
    res.status(400);
    throw new Error("Patient not found");
  }

  // Search for patient with URL variable
  const carer = await User.findById(carerID);

  // Make sure logged in user matches the coordinator
  if (patient.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Create shift
  const shift = await Shift.create({
    patient: patient._id,
    coordinator: user.id,
    coordinatorNotes,
    carer: carer.id,
    shiftStartTime: shiftStartTime,
    shiftEndTime: shiftEndTime,
  });

  // Return shift info
  if (shift) {
    res.status(201).json({
      _id: shift.id,
      patient: patient._id,
      coordinator: user.id,
      coordinatorNotes,
      carer: carer.id,
      shiftStartTime: shiftStartTime,
      shiftEndTime: shiftEndTime,
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

//----NEW ROUTE----//
// @desc Update shift
// @route PUT /shift/:shiftID
// @access private
const updateShift = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // Find shift
  const shift = await Shift.findById(req.params.shiftID);

  // Make sure logged in user matches the coordinator
  if (shift.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Update shift
  const updatedShift = await Shift.findByIdAndUpdate(
    req.params.shiftID,
    req.body,
    {
      new: true,
    }
  );
  res.status(201).json(updatedShift);
});

//----NEW ROUTE----//
// @desc Update shift
// @route PUT /shift/:shiftID
// @access private
const createHandover = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // Find shift
  const shift = await Shift.findById(req.params.shiftID);

  // Make sure logged in user matches the coordinator
  if (shift.carer.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Update shift
  const updatedShift = await Shift.findByIdAndUpdate(
    req.params.shiftID,
    req.body,
    {
      new: true,
    }
  );
  res.status(201).json(updatedShift);
});

//----NEW ROUTE----//
// @desc Update shift
// @route DELETE /shift/:shiftID
// @access private
const deleteShift = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // Find shift
  const shift = await Shift.findById(req.params.shiftID);

  // Make sure logged in user matches the coordinator
  if (shift.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Delete shift
  await shift.remove();
  res.status(200).json({ message: `Deleted shift ${req.params.shiftID}` });
});

//----NEW ROUTE----//
// @desc Create Shift Notes
// @route POST /shift/notes/:shiftID
// @access private
const createShiftNotes = asyncHandler(async (req, res) => {
  // create variable for entered shift notes
  const shiftNotes = req.body.shiftNotes;

  // Ensure all fields are filled out
  if (!shiftNotes) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // Find shift
  const shift = await Shift.findById(req.params.shiftID);

  // Make sure logged in user matches the carer for the shift
  if (!shift.carer.toString().includes(user.id)) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Get the patient name for the pdf document
  const patient = await Patient.findById(shift.patient)
    .select("firstName")
    .select("lastName");

  // Get the carer name for the pdf document
  const carer = await User.findById(shift.carer)
    .select("firstName")
    .select("lastName");

  // Create a pdf from the entered information
  const notesPDF = await createPDF(
    "Shift Notes",
    patient.firstName,
    patient.lastName,
    carer.firstName,
    carer.lastName,
    req.body.shiftNotes
  );

  // Upload the pdf to Cloudinary and set the results equal to result. Second param specifies folder to upload to
  const result = await cloudinaryUpload(notesPDF, "shiftNotes", shift.patient);

  // Update shift with Cloudinary URL
  const updatedShift = await Shift.findByIdAndUpdate(
    req.params.shiftID,
    {
      shiftNotes: {
        shiftNotesText: shiftNotes,
        shiftNotesPDF: result.secure_url,
      },
    },
    {
      new: true,
    }
  );
  res.status(200).json(updatedShift);
});

//----NEW ROUTE----//
// @desc Create Incident Report
// @route POST /shift/reports/:shiftID
// @access private
const createIncidentReport = asyncHandler(async (req, res) => {
  // create variable for entered shift notes
  const incidentReport = req.body.incidentReport;

  // Ensure all fields are filled out
  if (!incidentReport) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // Find shift
  const shift = await Shift.findById(req.params.shiftID);

  // Make sure logged in user matches the carer for the shift
  if (!shift.carer.toString().includes(user.id)) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Get the patient name for the pdf document
  const patient = await Patient.findById(shift.patient)
    .select("firstName")
    .select("lastName");

  // Get the carer name for the pdf document
  const carer = await User.findById(shift.carer)
    .select("firstName")
    .select("lastName");

  // Create a pdf from the entered information
  const incidentPDF = await createPDF(
    "Incident Report",
    patient.firstName,
    patient.lastName,
    carer.firstName,
    carer.lastName,
    incidentReport
  );

  // Upload the pdf to Cloudinary and set the results equal to result. Second param specifies folder to upload to
  const result = await cloudinaryUpload(
    incidentPDF,
    "incidentReports",
    shift.patient
  );

  // Add new incident report to incident reports array.
  const addIncidentReport = await Shift.findByIdAndUpdate(
    req.params.shiftID,
    {
      $push: {
        incidentReports: {
          incidentReportText: incidentReport,
          incidentReportPDF: result.secure_url,
        },
      },
    },
    {
      new: true,
    }
  );
  res.status(200).json(addIncidentReport);
});

module.exports = {
  getUserShifts,
  getPatientShifts,
  createShift,
  updateShift,
  deleteShift,
  createShiftNotes,
  createIncidentReport,
  createHandover
};
