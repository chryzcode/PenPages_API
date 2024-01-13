import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name field is compulsory"],
		maxlength: 70,
	},
});

export default mongoose.model("Tag", tagSchema);
