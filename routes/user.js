import express from "express";
import { getAllUsers, login, register, getUser, updateUser, deleteUser } from "../controllers/user.js";

import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/auth/register").post(register);
router.route("/auth/login").post(login);
router.route("/all-users").get(getAllUsers);
router.route("/:username").get(getUser);
router.route("/update").put(authenticateUser, updateUser);
router.route("/delete").put(authenticateUser, deleteUser);

export default router;
