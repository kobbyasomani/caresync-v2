const mongoose = require("mongoose");
const User = require("./models/userModel");
const Patient = require("./models/patientModel");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

const seedUsers = [
  {
    _id: "63f0b95a0098e28d58f7a25d",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password",
    isConfirmed: true,
  },
  {
    _id: "63f0b95a0098e28d58f7a25e",
    firstName: "Frank",
    lastName: "Stevens",
    email: "frank@example.com",
    password: "password",
    isConfirmed: true,
  },
  {
    _id: "63f0b95a0098e28d58f7a2d5",
    firstName: "Dan",
    lastName: "Jenkins",
    email: "dan@example.com",
    password: "password",
    isConfirmed: true,
  },
];

const seedPatients = [
  {
    _id: "63f01efe3b5704fa0aa3ddc2",
    firstName: "Henry",
    lastName: "Donaldson",
    coordinator: "63f0b95a0098e28d58f7a25d",
    carers:["63f0b95a0098e28d58f7a2d5"]
  },
  {
    _id: "63f01f0a3b5704fa0aa3ddc5",
    firstName: "Adam",
    lastName: "Ballard",
    coordinator: "63f0b95a0098e28d58f7a25e",
    carers:["63f0b95a0098e28d58f7a2d5", "63f0b95a0098e28d58f7a25d"]
  },
  {
  _id: "63f01f0a3b5704fa0aa3ddc3",
    firstName: "Old",
    lastName: "Greg",
    coordinator: "63f0b95a0098e28d58f7a25e",
    carers:["63f0b95a0098e28d58f7a2d5"]
  },
];

const seedDB = async () => {
  await User.deleteMany({});
  await User.insertMany(seedUsers);
  await Patient.deleteMany({});
  await Patient.insertMany(seedPatients);
};

seedDB().then(() => {
  mongoose.connection.close();
});
