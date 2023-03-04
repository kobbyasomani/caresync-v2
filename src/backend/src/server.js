const express = require("express");
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;


// connectDB()

const app = express();

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

cloudinary.config({
  secure: true
});

const corsOptions = {
  // Valid front-end server origins
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}
app.use(cors(corsOptions));

app.use('/user', require('./routes/userRoutes'))
app.use('/patient', require('./routes/patientRoutes'))
app.use('/carer', require('./routes/carerRoutes'))
app.use('/shift', require('./routes/shiftRoutes'))

app.use(errorHandler)



module.exports = app
 