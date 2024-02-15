import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The from user field is required"],
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The to user field is required"],
    },
    info: {
      type: String,
      required: [true, "The info field is required"],
    },
    url: {
      type: String,
      required: [true, "The url field is required"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);
