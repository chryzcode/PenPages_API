const mongoose = require("mongoose");
const { userSchema } = require("./user");

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
    body: {
      type: String,
      required: [true, "Body field is compulsory"],
      maxlength: 70,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userSchema,
      required: [true, "Author field is compulsory"],
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: tagSchema,
      required: ["true", "Tag firld is required"],
    },
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
      ref: postSchema,
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

const replycommentSchema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.ObjectId,
      ref: commentSchema,
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

// module.exports = mongoose.model(
//   'Tag', tagSchema,
//   'Comment', commentSchema,
//   'Post', postSchema,
// );
