const express = require('express')
const router = express.Router()
const { createComment, createReplyComment } = require('../controllers/comment')

router.route('/:postId').post(createComment)
router.route("/reply/:commentId").post(createReplyComment);

module.exports  = router