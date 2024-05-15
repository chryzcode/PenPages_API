import express from "express";
import {
  createPost,
  likePost,
  unlikePost,
  updatePost,
  getPost,
  getAllPosts,
  deletePost,
  getUserPosts,
  getPersonalisedPosts,
  aPostLikes,
  getAUserPosts,
} from "../controllers/post.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(authenticateUser, createPost);
router.route("/my-posts").get(authenticateUser, getUserPosts);
router.route("/:username/posts").get(getAUserPosts);
router.route("/user/personalised/posts").get(authenticateUser, getPersonalisedPosts);
router.route("/:postId").get(getPost).put(authenticateUser, updatePost).delete(authenticateUser, deletePost);
router.route("/like/:postId").post(authenticateUser, likePost).get(aPostLikes);
router.route("/unlike/:postId").post(authenticateUser, unlikePost);

export default router;
