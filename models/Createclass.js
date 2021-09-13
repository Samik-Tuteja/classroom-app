const mongoose = require("mongoose");

const createSchema = new mongoose.Schema({
  teachername: {
    type: String,
    required: true,
  },
  classname: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  skool: {
    type: String,
    required: true,
  },
  classn: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Createclass = mongoose.model("Createclass", createSchema);
module.exports = Createclass;
