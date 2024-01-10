require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connect");
const userRoute = require('./routes/user')

app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi");
});

app.use("/api/v1/user", userRoute);

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
