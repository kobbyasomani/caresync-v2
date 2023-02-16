const express = require('express')
const userRouter=express.Router()
const {registerUser} = require ('../controllers/userController')



userRouter.get("/register", registerUser)


module.exports = userRouter