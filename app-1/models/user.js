const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    bio: {
      type: String,
      required: false,
    },
    githubUrl: {
      type: String,
      required: false,
    },
    websiteUrl: {
      type: String,
      required: false,
    },
    dribbleUrl: {
      type: String,
      required: false,
    },
    twitterUrl: {
      type: String,
      required: false,
    },
    linkedinUrl: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
