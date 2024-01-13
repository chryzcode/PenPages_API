import express from "express";
import { createPost, getUserPosts } from "../controllers/post.js";

const router = express.Router();
router.route("/").post(createPost);

export default router;
