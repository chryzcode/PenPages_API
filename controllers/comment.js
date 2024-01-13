import { StatusCodes } from "http-status-codes";
import { Comment, replyComment } from "../models/comment";
import Post from "../models/post";

export const createComment = async (req, res) => {
	const { postId } = req.params;
	// const post = await Post.find({ _id: postId });
	req.body.post = postId;
	req.body.user = req.user.userId;
	const comment = await Comment.create({ ...req.body });
	res.status(StatusCodes.CREATED).json({ comment });
};

export const createReplyComment = async (req, res) => {
	const { commentId } = req.params;
	req.body.comment = commentId;
	const comment = await replyComment.create({ ...req.body });
	res.status(StatusCodes.CREATED).json({ comment });
};

export const getAllComments = async (req, res) => {
	const comments = await Comment.find({});
	res.status(StatusCodes.OK).json({ comments });
};

export const getAllReplyComments = async (req, res) => {
	const comments = await replyComment.find({});
	res.status(StatusCodes.OK).json({ comments });
};
