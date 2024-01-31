import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title field is compulsory"],
      minlength: 5,
      maxlength: 70,
    },
    image: {
      type: String,
      required: [true, "Image field is required"],
    },
    imageCloudinaryUrl: {
      type: String,
    },
    body: {
      type: String,
      required: [true, "Body field is compulsory"],
      minlength: 5,
      maxlength: 70,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author field is compulsory"],
    },
    tag: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: ["true", "Tag field is required"],
      },
    ],
    type: {
      type: String,
      enum: ["article", "poem", "book"],
      default: "article",
    },
  },
  { timestamps: true }
);

const postLikesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User field is required"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Post field is required"],
  },
});

export const postLikes = mongoose.model("postLikes", postLikesSchema);
export const Post = mongoose.model("Post", postSchema);
