import mongoose from "mongoose";

const followersSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user field is required"],
  },

  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The follower field is required"],
  },
});

export default mongoose.model("Follower", followersSchema);
