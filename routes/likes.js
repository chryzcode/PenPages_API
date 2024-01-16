import express from "express"
import authenticateUser from '../middleware/authentication.js'
import { like } from "../controllers/likes"

const router = express.Router()

router.route(":/postId").post(authenticateUser, like)


export default router
