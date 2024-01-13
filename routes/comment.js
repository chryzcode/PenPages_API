import express from "express";
import { createComment, createReplyComment } from "../controllers/comment";

const router = express.Router();

router.route("/:postId").post(createComment);
router.route("/reply/:commentId").post(createReplyComment);

export default router;
