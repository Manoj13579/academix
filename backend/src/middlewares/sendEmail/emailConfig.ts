import nodemailer from 'nodemailer';
import 'dotenv/config';//when used inside folder need to import




export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SEND_EMAIL,
    pass: process.env.SEND_EMAIL_PASSWORD,
  },
});