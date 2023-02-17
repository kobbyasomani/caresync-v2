const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel');
const e = require("express");


// @desc Register User
// @route POST /user/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password} = req.body

    //Ensure all fields are filled out
    if (!firstName || !lastName || !email || !password) {
        res.status(400)
        throw new Error('Please fill out all fields')
    }
    
    // Check if user exists
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error('This email is associated with an account already.')
    }

    // Password encryption
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            email: user.email
        })
    }else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

// @desc Login User
// @route POST /user/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    res.json({
        message: 'Login User'
    })
})

// @desc Get user data
// @route POST /user/me
// @access private
const getUser = asyncHandler(async (req, res) => {
    res.json({
        message: 'User data'
    })
})



module.exports = {
    registerUser,
    loginUser,
    getUser
}