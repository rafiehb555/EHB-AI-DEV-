const User = require('../../models/User');

exports.submitTest = async (req, res) => {
  const { answer } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  if (answer.trim() === '10') {
    user.testScore = 'Pass';
    user.sqlBadge = 'VIP';
    await user.save();
    return res.json({ message: '✅ Test Passed! You are now VIP.' });
  } else {
    user.testScore = 'Fail';
    await user.save();
    return res.json({ message: '❌ Test Failed. Please try again.' });
  }
};
