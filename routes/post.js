const express = require('express')
const router = express.Router()
const { createPost, getAllPosts, getUserPosts } = require("../controllers/post");

router.route("/").post(createPost);

module.exports = router