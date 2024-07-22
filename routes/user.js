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
  currentUser,
  updatePassword,
} from "../controllers/user.js";

import authenticateUser from "../middleware/authentication.js";
import { multerUpload } from "../utils/cloudinaryConfig.js";

const router = express.Router();

router.route("/auth/register").post(register);
router.route("/auth/login").post(login);
router.route("/all-users").get(getAllUsers);
router.route("/profile/:username").get(getUser);
router.route("/current-user").get(authenticateUser, currentUser);
router.route("/auth/logout").post(authenticateUser, logout);
router.route("/update").put(authenticateUser, multerUpload.single("image"), updateUser);
router.route("/update/password").put(authenticateUser, updatePassword);
router.route("/delete").delete(authenticateUser, deleteUser);
router.route("/send-forgot-password-link").post(sendForgotPasswordLink);
router.route("/auth/forgot-password/:userId/:token").post(verifyForgotPasswordToken);
router.route("/auth/verify-account/:userId/:token").get(verifyAccount);

export default router;
