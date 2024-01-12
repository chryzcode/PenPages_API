const Post = require("../models/post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createPost = async (req, res) => {
  req.body.author = req.user.userId
  const post = await Post.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({post});
};

const getAllPosts = async (req, res) => {
  const allPosts = await Post.find({}).sort("createdAt");
  res.status(StatusCodes.OK).json({ allPosts });
};

const getUserPosts = async (req, res) => {
  const userPosts = await Post.find({ author: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ userPosts })
}





module.exports = {
  createPost,
  getUserPosts,
  getAllPosts,
};
