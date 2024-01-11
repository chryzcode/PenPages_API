const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is compulsory"],
    maxlength: 70,
  },
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title field is compulsory"],
      maxlength: 70,
    },
    image:{
        data: Buffer,
      contentType: String,
      //make required true later
      required: true,
    },
    body: {
      type: String,
      required: [true, "Body field is compulsory"],
      maxlength: 70,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author field is compulsory"],
    },
    tag: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
      required: ["true", "Tag field is required"],
    }],
    type: {
      type: String,
      enum: ["article", "poem", "book"],
      default: "article",
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

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

const Tag = mongoose.model("Tag", tagSchema);
const Comment = mongoose.model("Comment", commentSchema);
const Post = mongoose.model("Post", postSchema); 
const replyComment = mongoose.model("replyComment", replyCommentSchema);

module.exports = Tag, Comment, Post, replyComment;
