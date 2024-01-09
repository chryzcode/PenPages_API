const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is compulsory"],
    maxlength: 70,
  },
});

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Body field is compulsory"],
    },
  },
  {
    timestamps: true,
  }
);

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
    comment: {
      type: Schema.Types.ObjectId,
      ref: "commentSchema",
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tagSchema",
      required: ["true", "Tag firld is required"],
    },
    type: {
      type: String,
      enum: ["article", "poem", "book"],
      default: "article",
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model(
//   'Tag', tagSchema,
//   'Comment', commentSchema,
//   'Post', postSchema,
// );
