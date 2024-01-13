import express from "express";
import { getAllUsers, login, register } from "../controllers/user";

const router = express.Router();

router.route("/auth/register").post(register);
router.route("/auth/login").post(login);
router.route("/all-users").get(getAllUsers);

export default router;
