import express from "express";

import { followUnfollowUser, userFollowersCount, userFollowers, userFollowingCount } from "../controllers/follower.js";

import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/follow-unfollow/:userId").post(authenticateUser, followUnfollowUser);
router.route("/count/:userId").get(userFollowersCount);
router.route("/:userId/followers").get(userFollowers);
router.route("/:userId/following/count").get(userFollowingCount);

export default router;
