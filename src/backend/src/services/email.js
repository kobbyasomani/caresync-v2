var dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
})



module.exports = {
    verifyUserEmail: async function verifyUserEmail(name, email, token) {
        try{
            let info = await transporter.sendMail({
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: `Hello ${name}, please verify your email by clicking the link`,
                html: process.env.BASE_URL + "/emailVerification"+`?${token}`
            })
        } catch (error) {
            console.log(error)
        }
    }, 
    addCarerEmail: async function addCarerEmail(name, email, patientName, token) {
        try{
            let info = await transporter.sendMail({
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: `Hello ${name}, you have been invited to be a carer for ${patientName}`,
                html: process.env.BASE_URL + `/addCarer?${token}`
            })
        } catch (error) {
            console.log(error)
        }
    },
}