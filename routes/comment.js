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
  likePostComment,
  likeAReplyComment,
  getAReplyCommentLikes,
  getACommentLikes,
} from "../controllers/comment.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/:postId").post(authenticateUser, createComment).get(getPostAllComments);
router.route("/reply/:commentId").post(authenticateUser, createReplyComment).get(getPostAllReplyComments);
router.route("/:commentId").put(authenticateUser, updateComment).delete(authenticateUser, deleteComment);
router
  .route("/reply/:replyCommentId")
  .put(authenticateUser, updateReplyComment)
  .delete(authenticateUser, deleteReplyComment);
router.route("/like/:commentId").post(authenticateUser, likePostComment).get(getACommentLikes);
router.route("/like/reply/:replyCommentId").post(authenticateUser, likeAReplyComment).get(getAReplyCommentLikes);

export default router;
