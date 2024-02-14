import express from "express";

import { followUnfollowUser, userFollowersCount } from "../controllers/follower.js";

import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/follow-unfollow/:userId").post(authenticateUser, followUnfollowUser);
router.route("/count/:userId").get(userFollowersCount);

export default router;
