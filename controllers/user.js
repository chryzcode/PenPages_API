import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index.js";
import User from "../models/user.js";
import { transporter, generateToken } from "../utils/user.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
import path from "path";

const uniqueID = uuidv4();
const domain = process.env.DOMAIN || "http://127.0.0.1:8000";

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
  const user = await User.create({ ...req.body });
  const fromEmail = process.env.Email_User;
  const maildata = {
    from: `The Product Conclave ${fromEmail}`,
    to: user.email,
    subject: `${user.firstName} verify your account`,
    html: `<p>Please use the following <a href="${domain}/auth/verify-account/?userId=${
      user.id
    }/?token=${encodeURIComponent(
      linkVerificationtoken
    )}">link</a> to verify your account. Link expires in 10 mins.</p>`,
  };
  transporter.sendMail(maildata, (error, info) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send();
    }
    res.status(StatusCodes.OK).send();
  });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: { firstName: user.firstName, lastName: user.lastName },
    token,
    success: "check your mail for account verification",
  });
};

export const verifyAccount = async (req, res) => {
  const token = req.params.token;
  const userId = req.params.userId;
  const secretKey = process.env.JWT_SECRET;
  try {
    jwt.verify(token, secretKey);
    const user = await User.findOneAndUpdate({ _id: userId }, { verified: true }, { new: true, runValidators: true });
    res.status(StatusCodes.OK).send();
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

  var userByEmail = await User.findOne({ email: email });
  var userByUsername = await User.findOne({ username: email });

  var user = userByEmail || userByUsername;
  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new UnauthenticatedError("Invalid password");
  }
  if (user.verified == false) {
    const maildata = {
      from: process.env.Email_User,
      to: user.email,
      subject: `${user.firstName} verify your account`,
      html: `<p>Please use the following <a href="${domain}/auth/verify-account/?userId=${
        user.id
      }/?token=${encodeURIComponent(
        linkVerificationtoken
      )}">link</a> to verify your account. Link expires in 10 mins.</p>`,
    };
    transporter.sendMail(maildata, (error, info) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).send();
      }
      res.status(StatusCodes.OK).send();
    });
    throw new UnauthenticatedError("Account is not verified, kindly check your mail for verfication");
  }
  var token = user.createJWT();
  await User.findOneAndUpdate({ token: token });
  token = user.token;

  res.cookie("accessToken", token, {
    // httpOnly: true,
    expire: 48 * 60 * 60 * 1000, //after 2 days (48 hrs)
    // Other cookie options such as expiration, secure, domain, etc.
  });

  res.status(StatusCodes.OK).json({ user: { firstName: user.firstName }, token });
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

export const updateUser = async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  // Find the user by userId
  const user = await User.findById(userId);

  // If user not found, throw an error
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exist`);
  }

  // Validate the current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new BadRequestError("Incorrect current password");
  }

  // If the current password is correct, update the user's password
  user.password = newPassword; // Assuming newPassword is already hashed

  // Save the updated user
  await user.save();

  // Return success response
  res.status(StatusCodes.OK).json({ success: "Profile updated successfully" });
};

export const deleteUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOneAndUpdate({ _id: userId }, { verified: false }, { new: true, runValidators: true });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).send("Your account has been disabled");
};

export const sendForgotPasswordLink = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Email field is required");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new NotFoundError("User does not exists");
  }
  const maildata = {
    from: process.env.Email_User,
    to: user.email,
    subject: `${user.firstName} you forgot your password`,
    html: `<p>Please use the following <a href="${domain}/verify/forgot-password/?userId=${
      user.id
    }/?token=${encodeURIComponent(linkVerificationtoken)}">link</a> for verification. Link expires in 30 mins.</p>`,
  };
  transporter.sendMail(maildata, (error, info) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send();
    }
    res.status(StatusCodes.OK).send("Check you email to change your password");
  });
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
