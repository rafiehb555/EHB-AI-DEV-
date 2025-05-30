const Referral = require('../../models/Referral');

exports.registerReferral = async (req, res) => {
  const { refCode } = req.body;
  const userId = req.user.id;

  await Referral.create({
    user: userId,
    referredBy: refCode
  });

  res.json({ message: '✅ Referral registered successfully!' });
};

exports.getReferrals = async (req, res) => {
  const userId = req.user.id;
  const referrals = await Referral.find({ referredBy: userId }).populate('user');
  res.json({ referrals });
};
