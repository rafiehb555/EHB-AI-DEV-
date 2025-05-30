const Invoice = require('../../models/Invoice');

exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(invoices);
};

exports.createInvoice = async (req, res) => {
  const { amount, status } = req.body;
  await Invoice.create({ user: req.user.id, amount, status });
  res.json({ message: 'Invoice created' });
};
