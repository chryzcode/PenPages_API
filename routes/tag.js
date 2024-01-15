import express from "express";
import { createTag, getAllTags, getTag, updateTag, deleteTag } from "../controllers/tag.js";

const router = express.Router();

router.route("/").post(createTag).get(getAllTags);
router.route("/:tagId").get(getTag).put(updateTag).delete(deleteTag);

export default router;
