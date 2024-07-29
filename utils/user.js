import nodemailer from "nodemailer";
import "dotenv/config";
import jwt from "jsonwebtoken";


export const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
});

export const generateToken = uniqueID => {
  const expiry = "20m";
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ id: uniqueID }, secretKey, { expiresIn: expiry });
};
