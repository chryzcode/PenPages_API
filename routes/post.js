const express = require('express')
const router = express.Router()
const { createPost, getUserPosts, } = require('../controllers/post')

router.route('/').post(createPost).get(getUserPosts)

module.exports = router