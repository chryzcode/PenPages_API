import Follower from "../models/follower.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import "dotenv/config";

const DOMAIN = process.env.DOMAIN;

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
    Notification.create({
      fromUser: followerId,
      toUser: userId,
      info: `${follower.username} just followed you`,
      url: `${DOMAIN}/api/v1/user/profile/${follower.username}`,
    });
  }
  res.status(StatusCodes.OK).send();
};

export const userFollowersCount = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`User does not exist`);
  }
  const followersCount = (await Follower.find({ user: userId })).length;
  res.status(StatusCodes.OK).json({ followersCount });
};

export const userFollowingCount = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new NotFoundError(`User does not exist`);
  }
  const followingCount = (await Follower.find({ follower: user._id })).length;
  res.status(StatusCodes.OK).json({ followingCount });
};

export const userFollowings = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new NotFoundError(`User does not exist`);
  }
  const followings = await Follower.find({ follower: user._id }).populate(
    "follower",
    "username firstName lastName imageCloudinaryUrl _id"
  );
  res.status(StatusCodes.OK).json({ followings });
};

export const userFollowers = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`user/ author with ${userId} does not exist`);
  }
  const followers = await Follower.find({ user: userId });
  let allFollowersId = [];
  let allFollowers = [];
  followers.forEach(aFollower => {
    allFollowersId.push(aFollower.follower);
  });
  for (let i = 0; i < allFollowersId.length; i++) {
    const followersUser = await User.find({ _id: allFollowersId[i] });
    allFollowers = allFollowers.concat(followersUser);
  }
  res.status(StatusCodes.OK).json({ allFollowers });
};
