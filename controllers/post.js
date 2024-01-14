import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Post from "../models/post.js";

export const createPost = async (req, res) => {
  req.body.author = req.user.userId;
  const post = await Post.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ post });
};

export const getAllPosts = async (req, res) => {
  const allPosts = await Post.find({}).sort("createdAt");
  res.status(StatusCodes.OK).json({ allPosts });
};

export const getPost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  console.log(post);
  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ post });
};

export const getUserPosts = async (req, res) => {
  const userPosts = await Post.find({ author: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ userPosts });
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  const post = await Post.findOneAndUpdate({ _id: postId, author: userId }, req.body, { runValidators: true });
  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ post });
};
