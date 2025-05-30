const User = require('../../models/User');

exports.addReferral = async (req, res) => {
  const { email, refEmail } = req.body;
  const user = await User.findOne({ email });
  const referral = await User.findOne({ email: refEmail });
  if (!user || !referral) return res.status(404).json({ message: 'User or Referral not found' });

  user.referrals.push(referral._id);
  user.lockedCoins += 1;
  await user.save();

  res.json({ message: `Referral ${refEmail} added to ${email}` });
};
