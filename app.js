import "dotenv/config";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";

import { getAllComments, getAllReplyComments } from "./controllers/comment";
import { getAllPosts } from "./controllers/post";
import commentRouter from "./routes/comment";
import postRouter from "./routes/post";
import tagRouter from "./routes/tag";
import authRouter from "./routes/user";

// error handler
import errorHandlerMiddleware from "./middleware/error-handler";
import notFoundMiddleware from "./middleware/not-found";

import authenticateUser from "./middleware/authentication";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Penpages API");
});

app.use("/api/v1/user", authRouter);

app.use("/api/v1/post", postRouter.get("/", getAllPosts));
app.use("/api/v1/post", authenticateUser, postRouter);

app.use("/api/v1/tag", tagRouter);

app.use(
	"/api/v1/comment",
	commentRouter.get("/:postId", getAllComments).get("/reply/:commentId", getAllReplyComments)
);
app.use("/api/v1/comment", authenticateUser, commentRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		app.listen(port, () => console.log(`server is running on port ${port}`));
	} catch (error) {
		console.log(error);
	}
};

start();
