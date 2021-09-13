const mongoose = require("mongoose");

const turninSchema = new mongoose.Schema({
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
  assignmentcode: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  marks: {
    type: String,
    required: true,
  },
  messagename: {
    type: String,
    required: true,
  },
  returnedmarks: {
    type: String,
    required: false,
    default: "",
  },
  status: {
    type: String,
    required: false,
    default: "",
  },
});

const Turnin = mongoose.model("Turnin", turninSchema);
module.exports = Turnin;
