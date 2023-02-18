const express = require("express");
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;

connectDB()

const app = express();

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/user', require('./routes/userRoutes'))
app.use('/patient', require('./routes/patientRoutes'))
app.use('/carer', require('./routes/carerRoutes'))

app.use(errorHandler)


app.listen(PORT, () => {
  console.log("Server Started");
});
