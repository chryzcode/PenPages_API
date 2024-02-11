import mongoose, { Schema } from "mongoose";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is compulsory"],
    maxlength: 70,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user field is required"],
  },
});

export default mongoose.model("Tag", tagSchema);
