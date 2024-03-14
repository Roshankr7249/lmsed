const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  prerequisites: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
