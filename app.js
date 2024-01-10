require("dotenv").config();
const express = require("express");



const userRoute = require('./routes/user')



const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi");
});

app.use("/api/v1/user", userRoute);

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
