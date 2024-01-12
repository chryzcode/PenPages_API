const { StatusCodes } = require('http-status-codes')
const Comment = require('../models/comment')
const Post = require('../models/post')


const createComment = async (req, res) => {
    const {postId} = req.params 
    // const post = await Post.find({ _id: postId });
    req.body.post = postId
    req.body.user = req.user.userId
    const comment = await Comment.create({...req.body})
    res.status(StatusCodes.CREATED).json({comment})
}

module.exports = {createComment, }