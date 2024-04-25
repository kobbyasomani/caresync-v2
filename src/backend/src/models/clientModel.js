const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
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
    default: null,
    ref: "User"
  }],
  shifts: [{
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "Shifts",
  }],
  isSample: {
    type: Boolean
  }
});

module.exports = mongoose.model("Client", clientSchema);
