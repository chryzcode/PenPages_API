import express from "express"
import authenticateUser from '../middleware/authentication.js'
import { likePost } from "../controllers/likes.js"

const router = express.Router()

router.route("/:postId").post(authenticateUser, likePost)


export default router
