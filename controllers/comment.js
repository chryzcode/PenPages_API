import { StatusCodes } from "http-status-codes";
import { Comment, replyComment } from "../models/comment.js";


export const createComment = async (req, res) => {
	const { postId } = req.params;
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

export const getPostAllComments = async (req, res) => {
	const {postId} = req.params
	const comments = await Comment.find({ post: postId });
	res.status(StatusCodes.OK).json({ comments });
};

export const getPostAllReplyComments = async (req, res) => {
	const {commentId} = req.params
	const replycomments = await replyComment.find({ comment: commentId });
	res.status(StatusCodes.OK).json({ replycomments });
};
