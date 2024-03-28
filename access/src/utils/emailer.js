import { createTransport } from "nodemailer";

// Create a transporter object
const transporter = createTransport({
    service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kcaltracker.app@gmail.com",
    pass: process.env.EMAIL_PWD,
  },
});

/**
 * Send a token to the user.
 * 
 * @param {string} userEmail - The email of the user.
 * @param {string} token - The token for the user to change their password.
 * @returns {boolean} True if the token is sent.
 */
export const sendToken =  async (userEmail, token) => {
    return await transporter.sendMail({
    from: '"KcalTracker" <kcaltracker.app@gmail.com>',
    to: userEmail,
    subject: "Password Recovery",
    text: `Your token for password retrieval is:\n\n${token}\n\nIt expires in 6 hours.\n\nIf you're not the one who requested the Token, disregard this email.\nNo further action is needed.\n\nKcalTacker team apreciates you. Have a nice day.`
  });
}