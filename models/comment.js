import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Post field is compulsory"],
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: "Post",
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

const replyCommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post field is compulsory"],
    },
    comment: {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
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


const commentLikesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User field is required"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: [true, "User field is required"],
  },
});

export const Comment = mongoose.model("Comment", commentSchema);
export const replyComment = mongoose.model("replyComment", replyCommentSchema);
export const commentLikes = mongoose.model("commentLikesSchema", commentLikes);
