const { StatusCodes } = require("http-status-codes");
const { Comment, replyComment } = require("../models/comment");
const Post = require("../models/post");

const createComment = async (req, res) => {
  const { postId } = req.params;
  // const post = await Post.find({ _id: postId });
  req.body.post = postId;
  req.body.user = req.user.userId;
  const comment = await Comment.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ comment });
};

const createReplyComment = async (req, res) => {
  const { commentId } = req.params;
  req.body.comment = commentId;
  const replyComment = await replyComment.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ replyComment });
};

module.exports = { createComment,  createReplyComment};
