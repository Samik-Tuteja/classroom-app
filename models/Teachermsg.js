const mongoose = require("mongoose");

const teachermsgSchema = new mongoose.Schema({
  classcode: {
    type: String,
    required: true,
  },
  teachername: {
    type: String,
    required: true,
  },
  messagename: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: false,
    default: "",
  },
  file: {
    type: String,
    required: false,
    default: "",
  },
  duedate: {
    type: String,
    require: false,
    default: "",
  },
  type: {
    type: String,
    required: false,
    default: "",
  },
  marks: {
    type: String,
    require: false,
    default: "",
  },
  date: {
    type: String,
    required: true,
  },
});

const Teachermsg = mongoose.model("Teachermsg", teachermsgSchema);
module.exports = Teachermsg;
