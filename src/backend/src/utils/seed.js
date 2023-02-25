const mongoose = require("mongoose");
const User = require("../models/userModel");
const Patient = require("../models/patientModel");
const Shift = require("../models/shiftModel");
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
    password: "$2a$10$dolHmb4kEF9Edp.EEzdvRu2mpuV0f95dD.cL1L4PoCwWZB4bJZHQe",
    isConfirmed: true,
  },
  {
    _id: "63f0b95a0098e28d58f7a25e",
    firstName: "Frank",
    lastName: "Stevens",
    email: "frank@example.com",
    password: "$2a$10$dolHmb4kEF9Edp.EEzdvRu2mpuV0f95dD.cL1L4PoCwWZB4bJZHQe",
    isConfirmed: true,
  },
  {
    _id: "63f0b95a0098e28d58f7a2d5",
    firstName: "Dan",
    lastName: "Jenkins",
    email: "dan@example.com",
    password: "$2a$10$dolHmb4kEF9Edp.EEzdvRu2mpuV0f95dD.cL1L4PoCwWZB4bJZHQe",
    isConfirmed: true,
  },
  {
    _id: "63f0b95a0098e28d58f7a2d1",
    firstName: "David",
    lastName: "Tjomsland",
    email: "david.tjomsland@gmail.com",
    password: "$2a$10$dolHmb4kEF9Edp.EEzdvRu2mpuV0f95dD.cL1L4PoCwWZB4bJZHQe",
    isConfirmed: true,
  },
];

const seedPatients = [
  {
    _id: "63f01efe3b5704fa0aa3ddc2",
    firstName: "Henry",
    lastName: "Donaldson",
    coordinator: "63f0b95a0098e28d58f7a25d",
    carers: ["63f0b95a0098e28d58f7a2d5", "63f0b95a0098e28d58f7a2d1"],
    shifts: ["63f01f0a3b5704fa0aa3ddc9", "63f01f0a3b5704fa0aa3ddc1", "63f01f0a3b5704fa0aa3ddc8", "63f01f0a3b5704fa0aa3ddc7", "63f01f0a3b5704fa0aa3ddc6"]
  },
  {
    _id: "63f01efe3b5704fa0aa3ddc4",
    firstName: "Jerry",
    lastName: "Hendricks",
    coordinator: "63f0b95a0098e28d58f7a25d",
  },
  {
    _id: "63f01f0a3b5704fa0aa3ddc5",
    firstName: "Hank",
    lastName: "Ballard",
    coordinator: "63f0b95a0098e28d58f7a25e",
    carers: ["63f0b95a0098e28d58f7a2d5", "63f0b95a0098e28d58f7a25d"],
  },
  {
    _id: "63f01f0a3b5704fa0aa3ddc3",
    firstName: "Old",
    lastName: "Greg",
    coordinator: "63f0b95a0098e28d58f7a25e",
    carers: ["63f0b95a0098e28d58f7a2d5"],
  },
];

const seedShifts = [
  {
    _id: "63f01f0a3b5704fa0aa3ddc9",
    patient: "63f01efe3b5704fa0aa3ddc2",
    coordinator: "63f0b95a0098e28d58f7a25d",
    coordinatorNotes: "Come wearing cool clothing. You are going to an event at the fairgrounds.  His family will meet you there for a couple hours",
    carer: "63f0b95a0098e28d58f7a2d5",
    shiftStartTime: "2023-02-26T13:00:00Z",
    shiftEndTime: "2023-02-26T19:00:00Z",
  },
  {
    _id: "63f01f0a3b5704fa0aa3ddc1",
    patient: "63f01efe3b5704fa0aa3ddc2",
    coordinator: "63f0b95a0098e28d58f7a25d",
    coordinatorNotes: "There is a pool party today. The party starts at noon. Bring swimming apparel if you want to get in the water.",
    carer: "63f0b95a0098e28d58f7a2d5",
    shiftStartTime: "2023-02-30T09:00:00Z",
    shiftEndTime: "2023-02-30T15:00:00Z",
  },
  {
    _id: "63f01f0a3b5704fa0aa3ddc8",
    patient: "63f01efe3b5704fa0aa3ddc2",
    coordinator: "63f0b95a0098e28d58f7a25d",
    coordinatorNotes: "Psych meeting at 1:00pm today.  Ensure you leave early in case of traffic.",
    carer: "63f0b95a0098e28d58f7a2d1",
    shiftStartTime: "2023-03-01T09:00:00Z",
    shiftEndTime: "2023-03-01T15:00:00Z",
  },
  {
    _id: "63f01f0a3b5704fa0aa3ddd8",
    patient: "63f01f0a3b5704fa0aa3ddc5",
    coordinator: "63f0b95a0098e28d58f7a25e",
    coordinatorNotes: "Psych meeting at 1:00pm today.  Ensure you leave early in case of traffic.",
    carer: "63f0b95a0098e28d58f7a25d",
    shiftStartTime: "2023-02-25T09:00:00Z",
    shiftEndTime: "2023-02-25T15:00:00Z",
  },
  {
    _id: "63f01f0a3b5704fa0aa3ddc7",
    patient: "63f01efe3b5704fa0aa3ddc2",
    coordinator: "63f0b95a0098e28d58f7a25d",
    coordinatorNotes: "Client has been feeling sick over the last few days and may have covid.  Please bring a mask and proceed with caution",
    carer: "63f0b95a0098e28d58f7a2d1",
    shiftStartTime: "2023-01-01T09:00:00Z",
    shiftEndTime: "2023-01-01T15:00:00Z",
    shiftNotes: "Client was irritated throughout the shift.  He kept trying to hurt himself in frustration over his sickness.  He refused to eat due to feeling unwell. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    handoverNotes: "Client took panadol at 5:00pm. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    incidentReports: [{incidentReport: "https://res.cloudinary.com/dydrnv83j/image/upload/v1677300262/CareSync/incidentReports/uptbewflezdlxhw4fi4e.pdf"},{incidentReport: "https://res.cloudinary.com/dydrnv83j/image/upload/v1677300262/CareSync/incidentReports/uptbewflezdlxhw4fi4e.pdf"}]
  },
  {
    _id: "63f01f0a3b5704fa0aa3ddc6",
    patient: "63f01efe3b5704fa0aa3ddc2",
    coordinator: "63f0b95a0098e28d58f7a25d",
    coordinatorNotes: "Client has been feeling sick over the last few days and may have covid.  Please bring a mask and proceed with caution",
    carer: "63f0b95a0098e28d58f7a25d",
    shiftStartTime: "2023-02-25T09:00:00Z",
    shiftEndTime: "2023-02-25T15:00:00Z",
  },
  
];


const seedDB = async () => {
  await User.deleteMany({});
  await User.insertMany(seedUsers);
  await Patient.deleteMany({});
  await Patient.insertMany(seedPatients);
  await Shift.deleteMany({});
  await Shift.insertMany(seedShifts);
  console.log("Seeded DB");
};

seedDB().then(() => {
  mongoose.connection.close();
});

module.exports = seedDB;
