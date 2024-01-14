import express from "express";
import { createTag, getAllTags, getTag, updateTag, } from "../controllers/tag.js";

const router = express.Router();

router.route("/").post(createTag).get(getAllTags);
router.route("/:tagId").get(getTag).put(updateTag)

export default router;
