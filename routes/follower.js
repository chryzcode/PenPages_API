import express from "express";

import {
  followUser,
  unfollowUser,
  userFollowersCount,
  userFollowers,
  userFollowingCount,
  userFollowings,
} from "../controllers/follower.js";

import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/follow/:userId").post(authenticateUser, followUser);
router.route("/unfollow/:userId").post(authenticateUser, unfollowUser);
router.route("/count/:userId").get(userFollowersCount);
router.route("/:userId/followers").get(userFollowers);
router.route("/:username/following/count").get(userFollowingCount);
router.route("/:username/followings").get(userFollowings);

export default router;
