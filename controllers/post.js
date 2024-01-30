import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { Post, postLikes } from "../models/post.js";
import cloudinary from "cloudinary";

const options = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};

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
  const imagePath = req.body.image;
  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    console.log(result.public_id);
  } catch (error) {
    console.error(error);
  }
  req.body.imageCloudinaryId = result.public_id;
  const post = await Post.findOneAndUpdate({ _id: postId, author: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ post });
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  const post = await Post.findOneAndDelete({ _id: postId, author: userId });
  if (!post) {
    throw new NotFoundError(`Post with id ${postId} does not exist`);
  }
  res.status(StatusCodes.OK).send();
};

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;
  const liked = await postLikes.findOne({ post: postId, user: userId });
  if (liked) {
    await postLikes.findOneAndDelete({ post: postId, user: userId });
  } else {
    await postLikes.create({ post: postId, user: userId });
  }
  const likes = (await postLikes.find({ post: postId })).length;
  res.status(StatusCodes.OK).json({ postLikesCount: likes });
};
