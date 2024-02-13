import Follower from "../models/follower";
import User from "../models/user";
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const followUnfollowUser = async (req, res) => {
  const userId = req.user.userId;
  const { authorId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`user with ${userId} does not exist`);
  }
  const author = await User.findOne({ _id: authorId });
  if (!author) {
    throw new NotFoundError(`author/ account with ${authorId} does not exist`);
  }
  if (user == author) {
    throw new BadRequestError("You can not follow/ unfolloe yourself");
  }
  req.body.user = authorId;
  req.body.follower = userId;
  const follower = await Follower.create({ ...req.body });
  res.status(StatusCodes.OK).json({ follower });
};
