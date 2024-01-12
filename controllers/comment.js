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
  const comment = await replyComment.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ comment });
};

const getAllComments = async (req, res) => {
  const comments = await Comment.find({ });
  res.status(StatusCodes.OK).json({ comments });
};


const getAllReplyComments = async (req, res) => {
  const comments = await replyComment.find({});
  res.status(StatusCodes.OK).json({ comments });
};


module.exports = { createComment, createReplyComment, getAllComments, getAllReplyComments };
