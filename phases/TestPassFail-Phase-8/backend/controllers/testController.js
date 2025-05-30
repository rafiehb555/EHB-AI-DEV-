const TestLog = require('../../models/TestLog');

exports.submitTest = async (req, res) => {
  const { score } = req.body;
  const userId = req.user.id;
  let result = 'Fail';

  if (score >= 50) result = 'Pass';

  await TestLog.create({ user: userId, score, result });

  res.json({ result });
};

exports.getResults = async (req, res) => {
  const userId = req.user.id;
  const logs = await TestLog.find({ user: userId }).sort({ createdAt: -1 });
  res.json({ logs });
};
