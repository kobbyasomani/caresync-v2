const mongoose = require("mongoose");
require('mongoose-type-email');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please add a last name"],
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: [true, "Please add an email"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    isConfirmed: {
      type: Boolean,
      default: false,
      required: true,
    },
    isNewUser: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
