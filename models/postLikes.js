import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User field is required"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "User field is required"],
  },
});


export const Likes =  mongoose.model('Likes', likesSchema)