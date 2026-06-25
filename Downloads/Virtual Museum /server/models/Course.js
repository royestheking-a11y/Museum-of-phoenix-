const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  id: Number,
  title: String,
  arabic: String,
  duration: String,
  durationAr: String,
  free: Boolean,
  done: Boolean
});

const CourseSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: String,
  arabic: String,
  level: String,
  levelAr: String,
  color: String,
  instructor: String,
  instructorAr: String,
  students: Number,
  rating: Number,
  totalDuration: String,
  totalDurationAr: String,
  free: Boolean,
  progress: Number,
  description: String,
  descriptionAr: String,
  certificate: Boolean,
  lessons: [LessonSchema]
});

module.exports = mongoose.model('Course', CourseSchema);
