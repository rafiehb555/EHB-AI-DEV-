const mongoose = require('mongoose');
const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  question: String,
  correctAnswer: String,
  badge: String
});
module.exports = mongoose.model('Lesson', LessonSchema);
