const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  description: String,
  videoUrl: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  discussions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }],
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;
