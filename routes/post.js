import express from "express";
import { createPost, getUserPosts, updatePost } from "../controllers/post.js";

const router = express.Router();

router.route("/").post(createPost);
router.route("/:postId").put(updatePost);

export default router;
