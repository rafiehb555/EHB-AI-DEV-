const AILog = require('../../models/AILog');

exports.getLogs = async (req, res) => {
  const logs = await AILog.find().sort({ createdAt: -1 });
  res.json({ logs });
};

exports.addLog = async (req, res) => {
  const { trainingType, summary } = req.body;
  const log = new AILog({
    trainingType,
    summary
  });
  await log.save();
  res.json({ message: '✅ AI training log saved successfully' });
};
