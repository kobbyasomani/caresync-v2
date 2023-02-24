const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Patient = require("../models/patientModel");
const Shift = require("../models/shiftModel");
const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

//----NEW ROUTE----//
// @desc Get shifts for current user
// @route GET /shift
// @access private
const getUserShifts = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  //Find all shifts for the current logged in user
  const userShifts = await Shift.find({ carer: user.id });

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

  //Find all shifts for the current logged in user/ order them from oldest to newest
  const patientShifts = await Shift.aggregate([
    {
      $match: {
        patient: patient._id,
      },
    },
    { $sort: { shiftStartTime: 1 } },
  ]);
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

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Search for patient with URL variable
  const patient = await Patient.findById(req.params.patientID);

  // Patient Check
  if (!patient) {
    res.status(400);
    throw new Error("Patient not found");
  }

  // Search for patient with URL variable
  const carer = await User.findById(carerID);

  // Patient Check
  if (!carer) {
    res.status(400);
    throw new Error("Carer not found");
  }

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

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

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
  res.status(200).json(updatedShift);
});

//----NEW ROUTE----//
// @desc Update shift
// @route DELETE /shift/:shiftID
// @access private
const deleteShift = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // User Check
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

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
// @route POST /shift/notes:shiftID
// @access private
const createShiftNotes = asyncHandler(async (req, res) => {
  // Find shift
  const shift = await Shift.findById(req.params.shiftID);

// Get the patient name for the pdf document
  const patientName = await Patient.findById(shift.patient)
    .select("firstName")
    .select("lastName");

// Get the carer name for the pdf document
  const carerName = await User.findById(shift.carer)
    .select("firstName")
    .select("lastName");

  // Retrieve shift notes from form
  const shiftNotes = req.body.shiftNotes;

  //Create a pdf from the entered information
  const pdf = async () => {
    const doc = new PDFDocument();
    doc
      .font("Helvetica")
      .text(`Client: ${patientName.firstName} ${patientName.lastName}`);
    doc
      .font("Helvetica")
      .text(`Carer: ${carerName.firstName} ${carerName.lastName}`);
    doc
      .font("Helvetica")
      .text(`Date: ${new Date().toLocaleString().split(",")[0]}`);
    doc.font("Helvetica").fontSize(25).moveDown(2).text(`Shift Notes`, {
      width: 410,
      align: "center",
    });
    doc.font("Helvetica").fontSize(12).moveDown(1).text(`${shiftNotes}`);
    doc.end();
    return await getStream.buffer(doc);
  };

  // Convert pdf to string
  const pdfBuffer = await pdf();
  const pdfBase64string = pdfBuffer.toString("base64");

  // Update shift
  const updatedShift = await Shift.findByIdAndUpdate(
    req.params.shiftID,
    { shiftNotes: pdfBase64string },
    {
      new: true,
    }
  );
  res.status(200).json(updatedShift);
});

module.exports = {
  getUserShifts,
  getPatientShifts,
  createShift,
  updateShift,
  deleteShift,
  createShiftNotes,
};
