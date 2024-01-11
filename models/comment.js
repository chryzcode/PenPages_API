const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Post field is compulsory"],
    },
    body: {
      type: String,
      required: [true, "Body field is compulsory"],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const replyCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
      required: [true, "Comment field is compulsory"],
    },
    body: {
      type: String,
      required: [true, "Body field is compulsory"],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
const replyComment = mongoose.model("replyComment", replyCommentSchema);

(module.exports = Comment), replyComment;