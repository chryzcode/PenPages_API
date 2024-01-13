import express from "express";
import { createTag, getAllTags } from "../controllers/tag";

const router = express.Router();

router.route("/").post(createTag).get(getAllTags);

export default router;
