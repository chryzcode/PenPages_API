const mongoose = require("mongoose");

const connectDB = url => {
  mongoose.connect(url);
};
// console log error and add success message
module.exports = connectDB;
