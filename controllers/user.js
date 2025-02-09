import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index.js";
import User from "../models/user.js";
import { generateToken, sendEmail } from "../utils/user.js";
import { v4 as uuidv4 } from "uuid";
import { uploadToCloudinary } from "../utils/cloudinaryConfig.js";

const uniqueID = uuidv4();
const BACKEND_DOMAIN = process.env.DOMAIN || "http://127.0.0.1:8000";
const FRONTEND_DOMAIN = process.env.FRONTEND || "http://localhost:3000";

const linkVerificationtoken = generateToken(uniqueID);

export const logout = async (req, res) => {
  const { userId } = req.user;
  req.body.token = "";
  res.clearCookie("accessToken");
  await User.findOneAndUpdate({ _id: userId }, req.body);
  res.status(StatusCodes.OK).send();
};

export const currentUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new UnauthenticatedError("No account is currently logged in or User does not exist");
  }
  res.status(StatusCodes.OK).json({ user });
};

export const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Check if email already exists in the database
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email is already registered" });
  }

  try {
    // Proceed with user registration if the email doesn't exist
    const user = await User.create({ ...req.body });

    // Create a verification token (you should generate your token here)
    const linkVerificationToken = generateToken(user.id);

    // Construct the email data
    const mailData = {
      from: `The Product Conclave ${process.env.EMAIL_USER}`,
      to: user.email,
      subject: `${user.firstName}, verify your account`,
      html: `<p>Hi ${user.firstName},</p><p>Please use the following <a href="${BACKEND_DOMAIN}/auth/verify-account?userId=${user.id}&token=${encodeURIComponent(linkVerificationToken)}">link</a> to verify your account. Link expires in 20 minutes.</p><p>Best regards,<br>The Product Conclave Team</p>`,
    };

    // Send the verification email
    await sendEmail(user.email, `${user.firstName}, verify your account`, mailData.html);

    // Create a JWT token for the user and send it in the response
    const token = user.createJWT();
    res.status(201).json({
      user: { firstName: user.firstName, lastName: user.lastName },
      token,
      success: "Check your email for account verification",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
};


export const verifyAccount = async (req, res) => {
  const token = req.params.token;
  const userId = req.params.userId;
  const secretKey = process.env.JWT_SECRET;
  try {
    jwt.verify(token, secretKey);
    const user = await User.findOneAndUpdate({ _id: userId }, { verified: true }, { new: true, runValidators: true });
    res.status(StatusCodes.FOUND).redirect(`${FRONTEND_DOMAIN}/sign-in`);
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid or expired token" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Put in your email/username and password");
  }

  // Check for user by email or username
  const userByEmail = await User.findOne({ email: email });
  const userByUsername = await User.findOne({ username: email });

  const user = userByEmail || userByUsername;
  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  // Validate password
  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new UnauthenticatedError("Invalid password");
  }

  // If the account is not verified, send a verification email
  if (user.verified === false) {
    const linkVerificationToken = generateToken(user.id);  // You may need to adjust this based on how you generate tokens
    const mailData = {
      to: user.email,
      subject: `${user.firstName} verify your account`,
      htmlContent: `<p>Please use the following <a href="${BACKEND_DOMAIN}/auth/verify-account/?userId=${user.id}&token=${encodeURIComponent(linkVerificationToken)}">link</a> to verify your account. Link expires in 10 minutes.</p>`,
    };

    try {
      await sendEmail(mailData.to, mailData.subject, mailData.htmlContent);
      res.status(StatusCodes.OK).json({ message: 'Verification email sent. Check your inbox.' });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'Failed to send verification email' });
    }

    throw new UnauthenticatedError("Account is not verified, kindly check your mail for verification");
  }

  // Generate a JWT token
  let token = user.createJWT();

  // Update user with the new token
  await User.findOneAndUpdate({ _id: user._id }, { token: token });

  // Set the token as a cookie
  res.cookie("accessToken", token, {
    // httpOnly: true, // Enable this if you want the cookie to be only accessible via HTTP requests
    expire: 48 * 60 * 60 * 1000, // Expire in 48 hours
  });

  // Respond with the user data and the token
  res.status(StatusCodes.OK).json({ user, token });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users });
};

export const getUser = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new NotFoundError(`User with username ${username} does not exist`);
  }
  res.status(StatusCodes.OK).json({ user });
};

export const updatePassword = async (req, res) => {
  const { userId } = req.user;

  const { currentPassword, newPassword } = req.body;

  let user = await User.findById(userId);

  // If user not found, throw an error
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exist`);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new BadRequestError("Incorrect current password");
  }

  user.password = newPassword;
  user = await user.save();
  res.status(StatusCodes.OK).json({ success: "Password updated successfully" });
};

export const updateUser = async (req, res) => {
  const { userId } = req.user;

  try {
    // Find the user by userId
    let user = await User.findById(userId);

    // If user not found, throw an error
    if (!user) {
      throw new NotFoundError(`User with id ${userId} does not exist`);
    }

    // Handle image upload if file is present
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      req.body.image = result.secure_url; // Set the Cloudinary URL to the image field
    }

    // Update the user with the new data
    user = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true,
      runValidators: true,
    });
    // Return success response
    res.status(StatusCodes.OK).json({ success: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOneAndUpdate({ _id: userId }, { verified: false }, { new: true, runValidators: true });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ success: "Account disabled successfully" });
};

export const sendForgotPasswordLink = async (req, res) => {
  const { email } = req.body;

  // Validate email input
  if (!email) {
    throw new BadRequestError("Email field is required");
  }

  // Check if the user exists
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  // Generate a verification token (assuming you have a function to generate tokens)
  const linkVerificationToken = generateToken(user.id);  // Adjust based on your token generation logic

  // Prepare the email content
  const mailData = {
    to: user.email,
    subject: `${user.firstName}, you forgot your password`,
    htmlContent: `<p>Please use the following <a href="${FRONTEND_DOMAIN}/reset-password/${user.id}/${encodeURIComponent(linkVerificationToken)}">link</a> to reset your password. Link expires in 30 minutes.</p>`,
  };

  try {
    // Send the email using the sendEmail function
    await sendEmail(mailData.to, mailData.subject, mailData.htmlContent);
    res.status(StatusCodes.OK).json({ success: "Check your email to change your password" });
  } catch (error) {
    // Handle error if sending email fails
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to send reset password email" });
  }
};

export const verifyForgotPasswordToken = async (req, res) => {
  const token = req.params.token;
  const userId = req.params.userId;
  const secretKey = process.env.JWT_SECRET;
  var { password } = req.body;
  try {
    jwt.verify(token, secretKey);
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { password: password, token: token },
      { runValidators: true, new: true }
    );

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid or expired token" });
  }
};
