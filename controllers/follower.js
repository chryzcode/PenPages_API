import Follower from "../models/follower.js";
import User from "../models/user.js";
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const followUnfollowUser = async (req, res) => {
  const followerId = req.user.userId;
  const { userId } = req.params;
  const follower = await User.findOne({ _id: followerId });
  if (!follower) {
    throw new NotFoundError(`user/ follower with ${followerId} does not exist`);
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`user/ author with ${userId} does not exist`);
  }
  if (follower.id == user.id) {
    throw new BadRequestError("You can not follow/ unfollow yourself");
  }
  req.body.user = userId;
  req.body.follower = followerId;
  const followerObj = await Follower.findOne({ user: userId, follower: followerId });
  if (followerObj) {
    await Follower.deleteOne({ user: userId, follower: followerId });
  } else {
    await Follower.create({ ...req.body });
  }
  const followersCount = (await Follower.find({ user: userId })).length;
  res.status(StatusCodes.OK).send();
};
