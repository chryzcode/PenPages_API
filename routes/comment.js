const express = require('express')
const router = express.Router()
const { createComment, } = require('../controllers/comment')

router.route('/:postId').post(createComment)

module.exports  = route