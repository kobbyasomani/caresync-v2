const mongoose = require("mongoose");

const shiftSchema = mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  coordinatorNotes: {
    type: String,
  },
  carer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please add carer to shift"],
  },
  shiftStartTime: {
    type: Date,
    required: [true, "Please add shift start time"],
  },
  shiftEndTime: {
    type: Date,
    required: [true, "Please add shift end time"],
  },
  shiftNotes: {
    type: String,
  },
  handoverNotes: {
    type: String,
  },
  incidentReports: [{
     type: String,
  }]
},
{
  timestamps: true,
});

module.exports = mongoose.model("Shifts", shiftSchema);
