const ValidatorEarning = require('../../models/ValidatorEarning');

exports.getEarnings = async (req, res) => {
  const userId = req.user.id;
  const earnings = await ValidatorEarning.find({ user: userId });
  res.json({ earnings });
};

exports.addEarning = async (req, res) => {
  const { orderIncome, loyaltyBonus } = req.body;
  const userId = req.user.id;
  const record = new ValidatorEarning({
    user: userId,
    orderIncome,
    loyaltyBonus
  });
  await record.save();
  res.json({ message: '✅ Validator earning recorded successfully.' });
};
