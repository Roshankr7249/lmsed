const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'instructor', 'student'] },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  progress: {
    type: Number,
    default: 0,
  },
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
  discussionsParticipated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
