import { StatusCodes } from "http-status-codes";
import { Comment, replyComment, likeComment } from "../models/comment.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createComment = async (req, res) => {
  const { postId } = req.params;
  req.body.post = postId;
  req.body.user = req.user.userId;
  const comment = await Comment.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ comment });
};

export const createReplyComment = async (req, res) => {
  const { commentId } = req.params;
  req.body.comment = commentId;
  req.body.user = req.user.userId;
  const comment = await replyComment.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ comment });
};

export const getPostAllComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId });
  res.status(StatusCodes.OK).json({ comments });
};

export const getPostAllReplyComments = async (req, res) => {
  const { commentId } = req.params;
  const replycomments = await replyComment.find({ comment: commentId });
  res.status(StatusCodes.OK).json({ replycomments });
};

export const updateComment = async (req, res) => {
  const {
    params: { commentId },
    user: { userId },
  } = req;
  const comment = await Comment.findOneAndUpdate({ _id: commentId, user: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!comment) {
    throw new NotFoundError(`Comment with id ${commentId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ comment });
};

export const updateReplyComment = async (req, res) => {
  const {
    params: { replyCommentId },
    user: { userId },
  } = req;
  const comment = await replyComment.findOneAndUpdate({ _id: replyCommentId, user: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!comment) {
    throw new NotFoundError(`Comment with id ${replyCommentId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ comment });
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.user;
  const comment = await Comment.findOneAndDelete({ _id: commentId, user: userId });
  if (!comment) {
    throw new NotFoundError(`Comment with id ${commentId} does not exist`);
  }
  res.status(StatusCodes.OK).send();
};

export const deleteReplyComment = async (req, res) => {
  const { replyCommentId } = req.params;
  const { userId } = req.user;
  const comment = await replyComment.findOneAndDelete({ _id: replyCommentId, user: userId });
  if (!comment) {
    throw new NotFoundError(`Comment with id ${replyCommentId} does not exist`);
  }
  res.status(StatusCodes.OK).send();
};

export const likeComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.user;
  const liked = await likeComment.findOne({ comment: commentId, user: userId });
  if (liked) {
    await likeComment.findOneAndDelete({ comment: commentId, user: userId });
  } else {
    await likeComment.create({ comment: commentId, user: userId });
  }
  const likes = (await likeComment.find({ comment: commentId })).length;
  res.status(StatusCodes.OK).json({ commentLikesCount: likes });
};
