const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    maxlength: 50,
    required: true,
  },
  batch: {
    type: String,
    maxlength: 50,
    required: true,
  },
  phone: {
    type: Number,
    maxlength: 10,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 100,
    required: true,
  },
  role: {
    type: Number,
    default: 0
  },
  addedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Users", userSchema)
