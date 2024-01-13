import express from "express";
import { getAllUsers, login, register, getUser} from "../controllers/user.js";

const router = express.Router();

router.route("/auth/register").post(register);
router.route("/auth/login").post(login);
router.route("/all-users").get(getAllUsers);
router.route("/:username").get(getUser);


export default router;
