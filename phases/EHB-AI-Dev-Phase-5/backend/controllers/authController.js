const jwt = require('jsonwebtoken');
const User = require('../../models/User');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, password });
    await user.save();
  }
  if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate('referrals', 'email');
  res.json(user);
};
