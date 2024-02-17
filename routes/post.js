import express from "express";
import {
  createPost,
  likePost,
  updatePost,
  getPost,
  getAllPosts,
  deletePost,
  getUserPosts,
} from "../controllers/post.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(authenticateUser, createPost);
router.route("/my-posts").get(authenticateUser, getUserPosts);
router.route("/:postId").get(getPost).put(authenticateUser, updatePost).delete(authenticateUser, deletePost);
router.route("/like/:postId").post(authenticateUser, likePost);

export default router;
