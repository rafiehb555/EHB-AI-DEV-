const TestRecord = require('../../models/TestRecord');
const User = require('../../models/User');
const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.submitTest = async (req, res) => {
  const { answer } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const status = answer.trim() === '10' ? 'Pass' : 'Fail';
  if (status === 'Pass') user.sqlBadge = 'VIP';
  await user.save();

  await new TestRecord({ user: user._id, status }).save();
  res.json({ message: status === 'Pass' ? '✅ Test Passed' : '❌ Test Failed' });
};

exports.getHistory = async (req, res) => {
  const history = await TestRecord.find({ user: req.user.id }).sort({ date: -1 });
  res.json(history);
};

exports.generateCertificate = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || user.sqlBadge !== 'VIP') return res.status(403).json({ error: 'Not eligible for certificate' });

  const doc = new PDFDocument();
  const filename = `certificate-${user._id}.pdf`;
  const filePath = `./public/${filename}`;
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(25).text('Certificate of Excellence', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(`Awarded to: ${user.email}`, { align: 'center' });
  doc.text(`Badge Level: ${user.sqlBadge}`, { align: 'center' });
  doc.end();

  res.json({ url: `/public/${filename}` });
};
