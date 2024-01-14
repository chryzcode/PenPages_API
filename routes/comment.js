import express from "express";
import {
  createComment,
  createReplyComment,
  getPostAllReplyComments,
  getPostAllComments,
} from "../controllers/comment.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/:postId").post(authenticateUser, createComment).get(getPostAllComments);
router.route("/reply/:commentId").post(authenticateUser, createReplyComment).get(getPostAllReplyComments);

export default router;
