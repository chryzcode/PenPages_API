require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./db/connect");

app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi");
});

const port = process.env.PORT || 3000;
const url = process.env.MONGO_URI;

const start = async () => {
  try {
    await connectDB(url);
    app.listen(port, () => console.log(`server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
