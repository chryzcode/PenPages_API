const Post = require("../models/post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createPost = async (req, res) => {
  console.log(req.body);
  const post = await Post.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({post});
};

const getUserPosts = async (req, res) => {
    console.log(req)
    // const userPosts = await Post.find({ author: req.User });
}

module.exports = {
  createPost,
  getUserPosts,
};
