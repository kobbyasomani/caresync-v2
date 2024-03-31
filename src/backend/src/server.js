const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;


// connectDB()
const app = express();
const store = new MongoDBStore(
  {
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  },
  function (error) {
    if (error) {
      console.log("Error:", error);
    }
  }
);

store.on('error', function (error) {
  console.log("Error:", error);
});

const corsOptions = {
  // Valid front-end server origins
  origin: process.env.ORIGIN_URL,
  credentials: true
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: false }))
// app.use(express.raw({ type: 'application/octet-stream' }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week (in ms)
  },
  store: store,
  resave: false,
  saveUninitialized: false
}));

cloudinary.config({
  secure: true
});

app.use('/user', require('./routes/userRoutes'));
app.use('/session', require('./routes/sessionRoutes'));
app.use('/client', require('./routes/clientRoutes'));
app.use('/carer', require('./routes/carerRoutes'));
app.use('/shift', require('./routes/shiftRoutes'));

app.use(errorHandler);



module.exports = app
