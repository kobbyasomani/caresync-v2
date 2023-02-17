const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please add a last name"],
  },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  carers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
}],
  shifts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Shifts", 
    start_date: dateTime, 
    end_date: dateTime 
}]
});

module.exports = mongoose.model("Patient", patientSchema);
