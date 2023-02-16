const mongoose = require("mongoose");

const shiftSchema = mongoose.Schema({
  carer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  shiftNotes: {
    type: String,
    required: [true, "Please add shift notes"],
  },
  handoverNotes: {
    type: String,
    required: [true, "Please add handover notes"],
  },
  incidentReports: [{
     type: String,
  }]
});

module.exports = mongoose.model("Shifts", shiftSchema);
