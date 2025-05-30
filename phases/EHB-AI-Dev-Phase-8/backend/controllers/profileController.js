const User = require('../../models/User');
const path = require('path');

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

exports.uploadAvatar = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (req.file) {
    user.avatar = `/public/avatars/${req.file.filename}`;
    await user.save();
  }
  res.json({ message: 'Avatar updated' });
};
