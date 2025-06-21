var dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer")

// Setting up node mailer information
let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    tls: process.env.NODE_ENV === "production" ? true : false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
})


// Exporting types of mail functions
module.exports = {
    // Email for verifying user
    verifyUserEmail: async function verifyUserEmail(name, email, token) {
        try {
            let info = await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Hello ${name}, please verify your email by clicking the link`,
                html: process.env.ORIGIN_URL + "/emailVerification/" + `${token}`
            })
        } catch (error) {
            console.log(error)
        }
    },
    //Email for adding a carer
    addCarerEmail: async function addCarerEmail(name, email, clientName, token) {
        try {
            const invitationUrl = process.env.ORIGIN_URL + `/addCarer/${token}`;
            let info = await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Hello ${name}, you have been invited to be a carer for ${clientName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; font-size: 16px; width: 100%; text-align: center;">
                        <div style="display: inline-block; width: 100%; max-width: 600px; text-align: left; padding: 20px;">
                            <h2>Care Team Invitation</h2>
                            <p>Hello ${name},</p>
                            <p>You have been invited to join the care team for <strong>${clientName}</strong>.</p>
                            <p>To accept this invitation and join the care team, please click the button below:</p>
                            
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 20px auto;">
                                <tr>
                                    <td style="background-color: #1976d2;">
                                        <a href="${invitationUrl}" style="display: block; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 15px 30px; text-align: center;">
                                            Accept Invitation
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="font-size: 14px; color: #666;">${invitationUrl}</p>
                            
                            <hr style="border: none; border-top: 1px solid #ddd;">
                            
                            <p style="font-size: 12px; color: #666;">
                                This invitation was sent from CareSync. If you did not expect this invitation, you can safely ignore this email.
                            </p>
                        </div>
                    </div>
                `
            })
        } catch (error) {
            console.log(error)
        }
    },
}