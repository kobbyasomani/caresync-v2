const express = require("express");
require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;


// connectDB()

const app = express();

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

cloudinary.config({
  secure: true
});

const corsOptions = {
  // Valid front-end server origins
  origin: process.env.ORIGIN_URL,
  credentials: true
}
app.use(cors(corsOptions));

app.use('/user', require('./routes/userRoutes'));
app.use('/session', require('./routes/sessionRoutes'));
app.use('/client', require('./routes/clientRoutes'));
app.use('/carer', require('./routes/carerRoutes'));
app.use('/shift', require('./routes/shiftRoutes'));
// TODO: Add a Session model and the API routes for updating it to the backend server

app.use(errorHandler);



module.exports = app
