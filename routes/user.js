import express from "express";
import {
  getAllUsers,
  login,
  register,
  getUser,
  updateUser,
  deleteUser,
  logout,
  sendForgotPasswordLink,
  verifyForgotPasswordToken,
  verifyAccount,
} from "../controllers/user.js";

import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/auth/register").post(register);
router.route("/auth/login").post(login);
router.route("/all-users").get(getAllUsers);
router.route("/:username").get(getUser);
router.route("/auth/logout").post(authenticateUser, logout);
router.route("/update").put(authenticateUser, updateUser);
router.route("/delete").delete(authenticateUser, deleteUser);
router.route("/send-forgot-password-link").post(sendForgotPasswordLink);
router.route("/auth/forgot-password/:userId/:token").post(verifyForgotPasswordToken);
router.route("/auth/verify-account/:userId/:token").post(verifyAccount);

export default router;
