var dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer")

// Setting up node mailer information
let transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
})


// Exporting types of mail functions
module.exports = {
    // Email for verifying user
    verifyUserEmail: async function verifyUserEmail(name, email, token) {
        try{
            let info = await transporter.sendMail({
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: `Hello ${name}, please verify your email by clicking the link`,
                html: process.env.BASE_URL + "/emailVerification/"+`${token}`
            })
        } catch (error) {
            console.log(error)
        }
    }, 
    //Email for adding a carer
    addCarerEmail: async function addCarerEmail(name, email, clientName, token) {
        try{
            let info = await transporter.sendMail({
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: `Hello ${name}, you have been invited to be a carer for ${clientName}`,
                html: process.env.BASE_URL + `/addCarer/${token}`
            })
        } catch (error) {
            console.log(error)
        }
    },
}