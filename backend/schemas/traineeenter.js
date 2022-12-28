var mongoose = require("mongoose");
var traineeschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  emailid: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  organisation: {
    type: String,
  },
  testid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestPaperModel",
    required: true,
  },
  location: {
    type: String,
  },
});

module.exports = traineeschema;
