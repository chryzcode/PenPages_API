import express from "express";
import {
  createPost,
  likePost,
  updatePost,
  getPost,
  getAllPosts,
  deletePost,
  getUserPosts,
  getPersonalisedPosts,
  aPostLikes,
} from "../controllers/post.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(authenticateUser, createPost);
router.route("/my-posts").get(authenticateUser, getUserPosts);
router.route("/personalised/posts").get(authenticateUser, getPersonalisedPosts);
router.route("/:postId").get(getPost).put(authenticateUser, updatePost).delete(authenticateUser, deletePost);
router.route("/like/:postId").post(authenticateUser, likePost).get(aPostLikes);

export default router;
