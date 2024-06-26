import express from "express";
import {
  createComment,
  createReplyComment,
  getCommentsReplies,
  unlikeAReplyComment,
  unlikePostComment,
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
router.route("/reply/:commentId").post(authenticateUser, createReplyComment).get(getCommentsReplies);
router.route("/:commentId").put(authenticateUser, updateComment).delete(authenticateUser, deleteComment);
router
  .route("/reply/:replyCommentId")
  .put(authenticateUser, updateReplyComment)
  .delete(authenticateUser, deleteReplyComment);
router.route("/like/:commentId").post(authenticateUser, likePostComment).get(getACommentLikes);
router.route("/unlike/:commentId").post(authenticateUser, unlikePostComment);
router.route("/unlike/reply/:replyCommentId").post(authenticateUser, unlikeAReplyComment);
router.route("/like/reply/:replyCommentId").post(authenticateUser, likeAReplyComment).get(getAReplyCommentLikes);

export default router;
