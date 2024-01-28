import "dotenv/config";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";

import helmet from "helmet";
import cors from "cors";
// import "xxs-clean"
import rateLimit from "express-rate-limit";

import commentRouter from "./routes/comment.js";
import postRouter from "./routes/post.js";
import tagRouter from "./routes/tag.js";
import authRouter from "./routes/user.js";

// error handler
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";

const app = express();
const port = process.env.PORT || 5000;

app.set('trust proxy', 1)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, //15 mins
  max: 100, //limit each ip to 100 requests per windowsMs
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
//xss
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Penpages API");
});

app.use("/api/v1/user", authRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/comment", commentRouter);

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
