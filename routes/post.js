import express from "express";
import { createPost, getUserPosts, updatePost } from "../controllers/post.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/").post(authenticateUser, createPost);
router.route("/:postId").put(authenticateUser, updatePost);

export default router;
