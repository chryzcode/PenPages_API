import express from "express";
import {
  createComment,
  createReplyComment,
  getPostAllReplyComments,
  getPostAllComments,
  updateComment,
  updateReplyComment,
  deleteComment,
  deleteReplyComment,
} from "../controllers/comment.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/:postId").post(authenticateUser, createComment).get(getPostAllComments);
router.route("/reply/:commentId").post(authenticateUser, createReplyComment).get(getPostAllReplyComments);
router.route("/:commentId").put(authenticateUser, updateComment).delete(authenticateUser, deleteComment);
router.route("/reply/:replyCommentId").put(authenticateUser, updateReplyComment).delete(deleteReplyComment);

export default router;
