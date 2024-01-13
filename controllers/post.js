import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import Post from "../models/post";

export const createPost = async (req, res) => {
	req.body.author = req.user.userId;
	const post = await Post.create({ ...req.body });
	res.status(StatusCodes.CREATED).json({ post });
};

export const getAllPosts = async (req, res) => {
	const allPosts = await Post.find({}).sort("createdAt");
	res.status(StatusCodes.OK).json({ allPosts });
};

export const getUserPosts = async (req, res) => {
	const userPosts = await Post.find({ author: req.user.userId }).sort("createdAt");
	res.status(StatusCodes.OK).json({ userPosts });
};
