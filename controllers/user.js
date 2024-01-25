import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index.js";
import User from "../models/user.js";
import { transporter, generateToken } from "../utils/user.js";
import { v4 as uuidv4 } from "uuid";

const uniqueID = uuidv4();
const domain = process.env.DOMAIN || "http://127.0.0.1:8000";

const linkVerificationtoken = generateToken(uniqueID);

export const register = async (req, res) => {
  const user = await User.create({ ...req.body });
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
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { firstName: user.firstName, lastName: user.lastName }, token });
};

export const verifyAccount = async (req, res) => {
  const token = req.params.token;
  const userId = req.params.userId;
  const secretKey = process.env.JWT_SECRET;
  try {
    jwt.verify(token, secretKey);
    const user = User.findByIdAndUpdate({ _id: userId }, { verified: true }, { new: true, runValidators: true });
    res.status(StatusCodes.OK).json({ success: "account verified successfully" });
    const token = user.createJWT();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid or expired token" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Put in your email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("User does not exist");
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
  res.status(StatusCodes.OK).json({ user: { firstName: user.firstName, lastName: user.lastName }, token });
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
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true, runValidators: true });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ user });
};

export const deleteUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).send();
};

export const logout = async (req, res) => {
  const { userId } = req.user;
  req.body.token = "";
  await User.findOneAndUpdate({ _id: userId }, req.body);
  res.status(StatusCodes.OK).send();
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
    // text: "That was easy!",
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
