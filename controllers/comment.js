import { StatusCodes } from "http-status-codes";
import { Comment, replyComment, likeComment, likeReplyComment } from "../models/comment.js";
import User from "../models/user.js";
import { Post } from "../models/post.js";
import Notification from "../models/notification.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import "dotenv/config.js";

const DOMAIN = process.env.DOMAIN;

export const createComment = async (req, res) => {
  const { postId } = req.params;
  req.body.post = postId;
  req.body.user = req.user.userId;
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new NotFoundError(`User with id ${req.user.userId} does not exists`);
  }
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exists`);
  }
  const comment = await Comment.create({ ...req.body });
  Notification.create({
    fromUser: user.id,
    toUser: post.author,
    info: `${user.username} just made a comment on ${post.title}`,
    url: `${DOMAIN}/api/v1/post/${post.id}`,
  });
  res.status(StatusCodes.CREATED).json({ comment });
};

export const createReplyComment = async (req, res) => {
  const { commentId } = req.params;
  req.body.comment = commentId;
  req.body.user = req.user.userId;
  const user = await User.findOne({ _id: req.user.userId });
  const comment = (await Comment.findOne({ _id: commentId })) || (await replyComment.findOne({ _id: commentId }));
  if (!user) {
    throw new NotFoundError(`User with does not exists`);
  }
  if (!comment) {
    throw new NotFoundError(`Post with id ${commentId} does not exists`);
  }
  const post = await Post.findOne({ _id: comment.post });
  if (!post) {
    throw new NotFoundError(`Post does not exists`);
  }
  const aComment = await replyComment.create({ ...req.body });
  Notification.create({
    fromUser: user.id,
    toUser: comment.user,
    info: `${user.username} just made a reply to your comment on ${post.title}`,
    url: `${DOMAIN}/api/v1/post/${post.id}`,
  });
  res.status(StatusCodes.CREATED).json({ aComment });
};

export const getPostAllComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId });
  res.status(StatusCodes.OK).json({ comments });
};

export const getCommentsReplies = async (req, res) => {
  const { commentId } = req.params;
  const replycomments = await replyComment
    .find({ comment: commentId })
    .populate("user", "username firstName lastName imageCloudinaryUrl _id");
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
  res.status(StatusCodes.OK).json({ success: "Comment deleted successfully" });
};

export const deleteReplyComment = async (req, res) => {
  const { replyCommentId } = req.params;
  const { userId } = req.user;
  const comment = await replyComment.findOneAndDelete({ _id: replyCommentId, user: userId });
  if (!comment) {
    throw new NotFoundError(`Comment with id ${replyCommentId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ success: "Reply deleted successfully" });
};

export const likePostComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.user;
  const liked = await likeComment.findOne({ comment: commentId, user: userId });
  const comment = await Comment.findOne({ _id: commentId });
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exists`);
  }
  if (!comment) {
    throw new NotFoundError(`Comment with id ${commentId} does not exists`);
  }
  const post = await Post.findOne({ _id: comment.post });
  if (!post) {
    throw new NotFoundError(`Post with id ${post.id} does not exists`);
  }
  if (liked) {
    await likeComment.findOneAndDelete({ comment: commentId, user: userId });
  } else {
    await likeComment.create({ comment: commentId, user: userId });
    Notification.create({
      fromUser: user.id,
      toUser: comment.user,
      info: `${user.username} just liked your comment on ${post.title}`,
      url: `${DOMAIN}/api/v1/post/${post.id}`,
    });
  }
  const likes = (await likeComment.find({ comment: commentId })).length;
  res.status(StatusCodes.OK).json({ commentLikesCount: likes });
};

export const likeAReplyComment = async (req, res) => {
  const { replyCommentId } = req.params;
  const { userId } = req.user;
  const aReplyComment = await replyComment.findOne({ _id: replyCommentId });
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`User with id ${userId} does not exists`);
  }
  if (!aReplyComment) {
    throw new NotFoundError(`Reply Comment with id ${replyCommentId} does not exists`);
  }
  const comment = await Comment.findOne({ _id: aReplyComment.comment });
  if (!comment) {
    throw new NotFoundError(`Comment with id ${comment.id} does not exists`);
  }
  const post = await Post.findOne({ _id: comment.post });
  if (!post) {
    throw new NotFoundError(`Post with id ${post.id} does not exists`);
  }
  const liked = await likeReplyComment.findOne({ replyComment: replyCommentId, user: userId });
  if (liked) {
    await likeReplyComment.findOneAndDelete({ replyComment: replyCommentId, user: userId });
  } else {
    await likeReplyComment.create({ replyComment: replyCommentId, user: userId });
    Notification.create({
      fromUser: user.id,
      toUser: aReplyComment.user,
      info: `${user.username} just liked your reply on a ${post.title} comment`,
      url: `${DOMAIN}/api/v1/post/${post.id}`,
    });
  }
  const likes = (await likeReplyComment.find({ replyComment: replyCommentId })).length;
  res.status(StatusCodes.OK).json({ commentReplyLikesCount: likes });
};

export const getAReplyCommentLikes = async (req, res) => {
  const { replyCommentId } = req.params;
  const aReplyComment = await replyComment.findOne({ _id: replyCommentId });
  if (!aReplyComment) {
    throw new NotFoundError(`Reply Comment does not exists`);
  }
  const replyCommentLikes = await likeReplyComment
    .find({ replyComment: replyCommentId })
    .populate("user", "username firstName lastName imageCloudinaryUrl _id");
  res.status(StatusCodes.OK).json({ replyCommentLikes });
};

export const getACommentLikes = async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new NotFoundError(`Comment does not exists`);
  }
  const commentLikes = await likeComment
    .find({ comment: commentId })
    .populate("user", "username firstName lastName imageCloudinaryUrl _id");
  res.status(StatusCodes.OK).json({ commentLikes });
};
