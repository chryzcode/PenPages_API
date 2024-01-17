import { postLikes } from "../models/postLikes.js";
import { StatusCodes } from "http-status-codes";

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;
  const liked = await postLikes.findOne({ post: postId, user: userId });
  if (liked) {
    await postLikes.findOneAndDelete({ post: postId, user: userId });
  } else {
    await postLikes.create({ post: postId, user: userId });
  }
  const postLikes = (await postLikes.find({ post: postId })).length;
  res.status(StatusCodes.OK).json({ postLikesCount: postLikes });
};

// export const likeComment = async (req, res) => {
//   const { commentId } = req.params
//   const { userId } = req.user
//   const liked = await Likes.findone{}

// }
