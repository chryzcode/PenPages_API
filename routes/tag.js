import express from "express";
import { createTag, getAllTags, getTag, updateTag, deleteTag } from "../controllers/tag.js";
import authenticateUser from "../middleware/authentication.js";

const router = express.Router();

router.route("/").post(authenticateUser, createTag).get(getAllTags);
router.route("/:tagId").get(getTag).put(authenticateUser, updateTag).delete(authenticateUser, deleteTag);

export default router;
