import axios from "axios";
import "dotenv/config";
import jwt from "jsonwebtoken";


export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email', 
      {
        sender: { email: process.env.BREVO_SENDER_EMAIL, name: "The Product Conclave - PenPages" },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log("Email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};


export const generateToken = uniqueID => {
  const expiry = "20m";
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ id: uniqueID }, secretKey, { expiresIn: expiry });
};
