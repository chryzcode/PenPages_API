const Post = require("../models/post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createPost = async (req, res) => {
  console.log(req.body);
  const post = await Post.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({post});
};

const getUserPosts = async (req, res) => {
  const userPosts = await Post.find({ author: req.user.userId });
  res.status(StatusCodes.OK).json({ userPosts })
}

// const create

module.exports = {
  createPost,
  getUserPosts,
};
