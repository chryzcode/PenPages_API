const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title field is compulsory"],
      maxlength: 70,
    },
    image: {
      data: Buffer,
      contentType: String,
      //make required true later
      required: [false],
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
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Post", postSchema);
