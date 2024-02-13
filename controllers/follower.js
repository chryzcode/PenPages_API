import follower from "../models/follower";
import User from "../models/user";
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index.js";

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
};
