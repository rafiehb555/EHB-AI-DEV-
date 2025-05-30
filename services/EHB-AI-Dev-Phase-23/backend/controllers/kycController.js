const KYC = require('../../models/KYC');

exports.uploadKYC = async (req, res) => {
  const filePath = req.file.path;
  await KYC.create({
    user: req.user.id,
    documentPath: filePath
  });
  res.json({ message: 'KYC Document Submitted Successfully' });
};

exports.getAllKYC = async (req, res) => {
  const records = await KYC.find().populate('user');
  res.json(records);
};

exports.updateKYCStatus = async (req, res) => {
  const { id, status } = req.body;
  await KYC.findByIdAndUpdate(id, { status });
  res.json({ message: 'Status Updated' });
};
