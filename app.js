import "dotenv/config";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import commentRouter from "./routes/comment.js";
import postRouter from "./routes/post.js";
import tagRouter from "./routes/tag.js";
import authRouter from "./routes/user.js";
import followerRouter from "./routes/follower.js";
import notificationRouter from "./routes/notification.js";

// error handler
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);

const whitelist = ["http://localhost:3000", "https://penpages.netlify.app"];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 2000, // Adjust the limit if needed
  })
);

app.get("/", (req, res) => {
  res.send(
    `Penpages API. <p>Checkout the <a href="https://documenter.getpostman.com/view/31014226/2sA2xnxpqp">PenPages API Documentation</a></p>`
  );
});

app.use("/api/v1/user", authRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/follower", followerRouter);
app.use("/api/v1/notification", notificationRouter);

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
