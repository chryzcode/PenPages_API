import express from "express";

import { followUnfollowUser } from "../controllers/follower.js";

import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/follow-unfollow/:userId").post(authenticateUser, followUnfollowUser);

export default router;
