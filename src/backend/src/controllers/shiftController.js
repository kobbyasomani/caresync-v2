const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Client = require("../models/clientModel");
const Shift = require("../models/shiftModel");
const { cloudinaryUpload, createPDF, cloudinaryDelete } = require("../utils/pdf.utils");

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
// @desc Get shifts for specified client
// @route GET /shift/:clientID
// @access private
const getClientShifts = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);
  // Search for client with URL variable
  const client = await Client.findById(req.params.clientID);

  // User Check
  if (!client) {
    res.status(400);
    throw new Error("Client not found");
  }

  // Make sure logged in user matches the coordinator or carer
  if (
    client.coordinator.toString() !== user.id &&
    !client.carers.toString().includes(user.id)
  ) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Find all shifts for the current client. Join carer first/last name
  const clientShifts = await Shift.find({ client: client.id }).populate("carer", "firstName lastName").sort({ shiftStartTime: 1 })

  res.status(200).json(clientShifts);
});

//----NEW ROUTE----//
// @desc Create shift for specified client
// @route Post /shift/:clientID
// @access private
const createShift = asyncHandler(async (req, res) => {
  const { carerID, shiftStartTime, shiftEndTime, coordinatorNotes } = req.body;

  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // Search for client with URL variable
  const client = await Client.findById(req.params.clientID);

  // Client Check
  if (!client) {
    res.status(400);
    throw new Error("Client not found");
  }

  // Search for client with URL variable
  const carer = await User.findById(carerID);

  // Make sure logged in user matches the coordinator
  if (client.coordinator.toString() !== user.id) {
    res.status(401);
    throw new Error("User is not authorized");
  }

  // Create shift
  const shift = await Shift.create({
    client: client._id,
    coordinator: user.id,
    coordinatorNotes,
    carer: carer.id,
    shiftStartTime: shiftStartTime,
    shiftEndTime: shiftEndTime,
  });

  await Client.findByIdAndUpdate(client._id,
    { $push: { shifts: shift.id } });

  const updatedShift = await Shift.findById(shift._id)
    .populate("carer", "firstName lastName");

  // Return shift info
  if (shift) {
    res.status(201).json(updatedShift);
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
  try {
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
    ).populate("carer", "firstName lastName");

    // Delete existing shift notes PDF from cloud storage if they are being edited or removed
    if ("shiftNotes" in req.body) {
      const shiftNotesPDF_public_id = shift.shiftNotes.shiftNotesPDF?.match(
        /http.+\/(?<public_id>CareSync.+).pdf/).groups.public_id;

      if (shiftNotesPDF_public_id) {
        cloudinaryDelete([shiftNotesPDF_public_id]);
      };
    }

    //Return updated shift object
    res.status(201).json(updatedShift);
  }
  catch (error) {
    res.status(error.status).json({ message: error.message });
  }

});

//----NEW ROUTE----//
// @desc Create shift handover
// @route PUT /handover/:shiftID
// @access private
const createHandover = asyncHandler(async (req, res) => {
  // Search for user with JWT token ID
  const user = await User.findById(req.user.id);

  // Find shift
  const shift = await Shift.findById(req.params.shiftID);

  // Make sure logged in user matches the carer
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
  ).populate("carer", "firstName lastName");

  if (updatedShift) {
    //Return updated shift object
    res.status(201).json(updatedShift);
  } else {
    res.status(500).json({ message: "The shift handover could not be added at this time. Please try again later." })
  }

});

//----NEW ROUTE----//
// @desc Delete shift
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
  await Client.findByIdAndUpdate(shift.client,
    { $pull: { shifts: shift.id } });

  const shiftNotesPDF_public_id = shift.shiftNotes.shiftNotesPDF?.match(
    /http.+\/(?<public_id>CareSync.+).pdf/).groups.public_id;
  if (shiftNotesPDF_public_id) {
    try {
      cloudinaryDelete([shiftNotesPDF_public_id]);
    } catch (error) {
      console.log(error.message || `Cloudinary: The shift notes PDF could not be deleted (${shift.id}).`);
    }
  };

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

  // Get the client name for the pdf document
  const client = await Client.findById(shift.client)
    .select("firstName")
    .select("lastName");

  // Get the carer name for the pdf document
  const carer = await User.findById(shift.carer)
    .select("firstName")
    .select("lastName");

  // Delete existing shift notes PDF from cloud storage if they are being edited
  const shiftNotesPDF_public_id = shift.shiftNotes.shiftNotesPDF?.match(
    /http.+\/(?<public_id>CareSync.+).pdf/).groups.public_id;

  if (shiftNotesPDF_public_id) {
    cloudinaryDelete([shiftNotesPDF_public_id]);
  };

  let updatedShift;
  let cloudinaryUploadResult = "";
  // Create a pdf from the entered information
  try {
    const notesPDF = await createPDF(
      "Shift Notes",
      client.firstName,
      client.lastName,
      carer.firstName,
      carer.lastName,
      req.body.shiftNotes
    );

    // Upload the pdf to Cloudinary and set the results equal to result. Second param specifies folder to upload to
    cloudinaryUploadResult = await cloudinaryUpload(notesPDF, "shiftNotes", shift.client);
  }
  catch (error) {
    console.log("Error:", error);
  }
  finally {
    // Update shift with Cloudinary URL
    updatedShift = await Shift.findByIdAndUpdate(
      req.params.shiftID,
      {
        shiftNotes: {
          shiftNotesText: shiftNotes,
          shiftNotesPDF: cloudinaryUploadResult.secure_url || ""
        },
      },
      {
        new: true,
      }
    ).populate("carer", "firstName lastName");

    if (updatedShift) {
      //Return updated shift object
      res.status(200).json(updatedShift);
    } else {
      res.status(500).json({ message: "The shift notes could not be added at this time. Please try again later." })
    }
  }
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

  // Get the client name for the pdf document
  const client = await Client.findById(shift.client)
    .select("firstName")
    .select("lastName");

  // Get the carer name for the pdf document
  const carer = await User.findById(shift.carer)
    .select("firstName")
    .select("lastName");

  // Create a pdf from the entered information
  const incidentPDF = await createPDF(
    "Incident Report",
    client.firstName,
    client.lastName,
    carer.firstName,
    carer.lastName,
    incidentReport
  );

  // Upload the pdf to Cloudinary and set the results equal to result. Second param specifies folder to upload to
  const result = await cloudinaryUpload(
    incidentPDF,
    "incidentReports",
    shift.client
  );

  // If the request body contains an incident report ID, update it rather than creating a new incident.
  const incidentId = req.body.incidentId;
  if (incidentId) {
    // Get the index of the incident report object in the list of reports
    const incidentReportIndex = shift.incidentReports.findIndex(report => report.id === incidentId);
    if (incidentReportIndex === -1) {
      res.status(404);
      throw new Error("The index of the incident report could not be found in the shift document.")
    }
    // Delete the incident report from cloudinary
    const incidentReportPDF_public_id = shift.incidentReports[incidentReportIndex]?.incidentReportPDF?.match(
      /http.+\/(?<public_id>CareSync.+).pdf/).groups.public_id;
    if (incidentReportPDF_public_id) {
      try {
        cloudinaryDelete([incidentReportPDF_public_id]);
      }
      catch (error) {
        console.log(error.message || "Cloudinary: This incident report PDF could not be deleted.");
      }
    } else {
      console.log("Cloudinary: Incident report PDF could not be found.");
    };

    // Update the incident report object in the database
    const updateIncidentReport = await Shift.findByIdAndUpdate(
      shift.id,
      {
        $set: {
          "incidentReports.$[elem].incidentReportPDF": result.secure_url || "",
          "incidentReports.$[elem].incidentReportText": incidentReport,
        }
      },
      { new: true, arrayFilters: [{ "elem._id": incidentId }] }
    ).populate("carer", "firstName lastName");
    // Return the updated shift
    if (updateIncidentReport) {
      res.status(200).json(updateIncidentReport);
    }
  } else {
    // Add new incident report to incident reports array.
    const addIncidentReport = await Shift.findByIdAndUpdate(
      req.params.shiftID,
      {
        $push: {
          incidentReports: {
            incidentReportText: incidentReport,
            incidentReportPDF: result.secure_url || "",
          },
        },
      },
      {
        new: true,
      }
    ).populate("carer", "firstName lastName");

    //Return updated shift object
    res.status(200).json(addIncidentReport);
  }
});

//----NEW ROUTE----//
// @desc Delete Incident Report
// @route DELETE /shift/reports/:shiftID
// @access private
const deleteIncidentReport = asyncHandler(async (req, res) => {
  try {
    // Get the incident ID from the request body
    const incidentId = req.body.incidentId;
    if (!incidentId) {
      res.status(400);
      throw new Error("The request body does not contain an incidentId")
    }

    // Search for user with JWT token ID
    const user = await User.findById(req.user.id);

    // Find the shift
    const shift = await Shift.findById(req.params.shiftID);
    if (!shift) {
      res.status(404);
      throw new Error("The shift could not be found.");
    }

    // Make sure logged in user matches the carer for the shift
    if (!shift.carer.toString().includes(user.id)) {
      res.status(401);
      throw new Error("User is not authorized");
    }

    // Make sure the shift has the specific incident report
    const incidentReportShift = await Shift.findById(shift.id, {
      incidentReports: {
        $elemMatch: { _id: incidentId }
      }
    })
    if (!incidentReportShift) {
      res.status(404);
      throw new Error("The incident report could not be found in the given shift.");
    }

    // Get the index of the incident report object in the list of reports
    const incidentReportIndex = shift.incidentReports.findIndex(report => report.id === incidentId);
    if (incidentReportIndex === -1) {
      res.status(404);
      throw new Error("The index of the incident report could not be found in the shift document.")
    }

    // Delete the incident report from the shift in database
    const updatedShift = await Shift.findByIdAndUpdate(
      shift.id,
      { $pull: { incidentReports: { _id: incidentId } } },
      { new: true }
    ).populate("carer", "firstName lastName");

    // Delete the incident report from cloudinary
    const incidentReportPDF_public_id = shift.incidentReports[incidentReportIndex]?.incidentReportPDF?.match(
      /http.+\/(?<public_id>CareSync.+).pdf/).groups.public_id;
    if (incidentReportPDF_public_id) {
      try {
        cloudinaryDelete([incidentReportPDF_public_id]);
      }
      catch (error) {
        console.log(error.message || `The incident report PDF could not be deleted (${incidentId}).`);
      }
    } else {
      console.log("Incident report PDF could not be found.");
    };

    if (updatedShift) {
      res.status(200).json(updatedShift);
    }
  }
  catch (error) {
    res.status(error.status || 500);
    throw new Error(error.message || "The incident could not be deleted at this time.")
  }
});

module.exports = {
  getUserShifts,
  getClientShifts,
  createShift,
  updateShift,
  deleteShift,
  createShiftNotes,
  createIncidentReport,
  deleteIncidentReport,
  createHandover
};
