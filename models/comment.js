import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post field is compulsory"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Post field is compulsory"],
    },
    body: {
      type: String,
      required: [true, "Body field is compulsory"],
    },
  },
  {
    timestamps: true,
  }
);

const replyCommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post field is compulsory"],
    },
    comment: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
      required: [true, "Comment field is compulsory"],
    },
    body: {
      type: String,
      required: [true, "Body field is compulsory"],
    },
  },
  {
    timestamps: true,
  }
);

const likeCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User field is required"],
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: [true, "Comment field is required"],
  },
});

export const likeReplyCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User field is required"],
  },
  replyComment: {
    type: mongoose.Schema.Types.ObjectId,
    reF: "replyComment",
    required: [true, "Reply comment filed is required"],
  },
});

export const likeReplyComment = mongoose.model("likeReplyCommentSchema", likeReplyComment);
export const Comment = mongoose.model("Comment", commentSchema);
export const replyComment = mongoose.model("replyComment", replyCommentSchema);
export const likeComment = mongoose.model("likeComment", likeCommentSchema);
