const mongoose = require("mongoose");

const joinSchema = new mongoose.Schema({
  studentname: {
    type: String,
    required: true,
  },
  teachername: {
    type: String,
    required: true,
  },
  classcode: {
    type: String,
    required: true,
  },
  classname: {
    type: String,
    required: true,
  },
  classn: {
    type: String,
    required: true,
  },
  skool: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Joiningclass = mongoose.model("Joiningclass", joinSchema);
module.exports = Joiningclass;
