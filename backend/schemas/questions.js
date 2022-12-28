var mongoose = require("mongoose");
var UserModel = require("../models/user");

var questionschema = new mongoose.Schema(
  {
    body: {
      required: true,
      type: String,
    },
    weightage: {
      type: Number,
      default: 1,
    },
    anscount: {
      type: Number,
      default: 1,
    },
    isMcq: {
      type: Boolean,
      default: true,
    },
    customAnswer: {
      type: String,
    },
    options: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Options",
      },
    ],
    explanation: {
      type: String,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectModel",
      required: true,
    },
    quesimg: {
      required: false,
      default: null,
      type: String,
    },
    difficulty: {
      default: 0,
      type: String,
    },
    level: {
      required: true,
      type: String,
    },
    school:{
      required: false,
      type: String,
    },
    year:{
      required: false,
      type: String,
    },
    topic:{
      required: false,
      type: String,
    },
    component:{
      required: false,
      type: String,
    },
    exam:{
      required: false,
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    status: {
      type: Boolean,
      default: 1,
      required: true,
    },
  },

  { timestamps: {} }
);

module.exports = questionschema;
