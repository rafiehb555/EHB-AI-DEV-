const Lesson = require('../../models/Lesson');
const UserBadge = require('../../models/UserBadge');

exports.getLessons = async (req, res) => {
  const lessons = await Lesson.find();
  res.json(lessons);
};

exports.submitAnswer = async (req, res) => {
  const { lessonId, answer } = req.body;
  const lesson = await Lesson.findById(lessonId);
  if (lesson.correctAnswer.toLowerCase() === answer.toLowerCase()) {
    await UserBadge.create({ user: req.user.id, badge: lesson.badge });
    return res.json({ badge: lesson.badge });
  }
  res.json({ badge: null });
};
