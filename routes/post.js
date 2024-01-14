import express from "express";
import { createPost, getUserPosts, updatePost, getPost, getAllPosts } from "../controllers/post.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(authenticateUser, createPost);
router.route("/:postId").get(getPost).put(authenticateUser, updatePost);

export default router;
