import { Likes } from "../models/likes.js";
import { StatusCodes } from "http-status-codes";

export const like = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;
  const liked = await Likes.find({ post: postId, user: userId });
  if (liked) {
    liked.deleteMany();
  }
  const like = await Likes.create({ post: postId, user: userId });
  const likes = (await Likes.find({ post: postId })).length;
  res.status(StatusCodes.OK).send(likes);
};
