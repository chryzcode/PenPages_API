require("dotenv").config();
require("express-async-errors");


const express = require("express");
app = express();


const authRouter = require("./routes/user");
const postRouter = require("./routes/post");
const tagRouter = require("./routes/tag");


// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");


app.use(express.json());


const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");


app.get("/", (req, res) => {
  res.send("Penpages API");
});


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", authenticateUser, postRouter);
app.use("/api/v1/tag", tagRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
