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
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { firstName: user.firstName, lastName: user.lastName }, token });
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

export const forgotPassword = async (req, res) => {
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
    subject: `${(user.firstName, user.lastName)} Forget your password`,
    text: "That was easy!",
    html: `<p>Please use the following <a href="${domain}/auth/verify/?email=${email}/?token=${encodeURIComponent(linkVerificationtoken)}">link</a> to verify your email. Link expires in 1 hour.</p>`,
  };
  transporter.sendMail(maildata, (error, info) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send();
    }
    console.log(linkVerificationtoken);
    res.status(StatusCodes.OK).send();
  });
};

export const verifyToken = async (req, res) => {
  const token = req.query.linkVerificationtoken;
  const email = req.query.email;
  const secretKey = process.env.JWT_SECRET;
  var { password } = req.body;
  console.log(password);
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Token verified:", decoded);
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(this.password, salt);
    const user = await User.findOneAndUpdate({ email: email }, password, { runValidators: true, new: true });
    res.send("Password changed successfully!");
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid or expired token" });
  }
};
