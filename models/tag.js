const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is compulsory"],
    maxlength: 70,
  },
});


module.exports = mongoose.model("Tag", tagSchema);