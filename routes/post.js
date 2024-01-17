import express from "express";
import {
  createPost,
  getUserPosts,
  likePost,
  updatePost,
  getPost,
  getAllPosts,
  deletePost,
} from "../controllers/post.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(authenticateUser, createPost);
router.route("/:postId").get(getPost).put(authenticateUser, updatePost).delete(authenticateUser, deletePost);
router.route("/like/:postId").post(authenticateUser, likePost);

export default router;
