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
      data: Buffer,
      contentType: String,
      //make required later
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
    likes: [
      {
        type: Number,
        user: "User",
        default: 0,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
