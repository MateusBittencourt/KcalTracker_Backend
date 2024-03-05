import { createTransport } from "nodemailer";

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

export const sendToken =  async (userEmail, token) => {
    return await transporter.sendMail({
    from: '"KcalTracker" <kcaltracker.app@gmail.com>',
    to: userEmail,
    subject: "Password Recovery",
    text: `Your token for password retrieval is:\n\n${token}\n\nIt expires in 6 hours.\n\nIf you're not the one who requested the Token, disregard this email.\nNo further action is needed.\n\nKcalTacker team apreciates you. Have a nice day.`
  });
}