const Post = require("../models/post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createPost = async (req, res) => {
  req.body.author = req.user.userId
  req.body.tag = "65a069f4ebdc0e6b6e76501e";
  const post = await Post.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({post});
};

const getUserPosts = async (req, res) => {
  const userPosts = await Post.find({ author: req.user.userId });
  res.status(StatusCodes.OK).json({ userPosts })
}



module.exports = {
  createPost,
  getUserPosts,
};
