import nodemailer from "nodemailer";
import "dotenv/config";

 const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: process.env.Email_User,
    pass: process.env.Email_Password,
  },
  secure: true,
 });


const generateToken =  () => {
  const expiry = '10m',
  const secret_key = process.env.JWT_SECRET
 }


export default transporter

