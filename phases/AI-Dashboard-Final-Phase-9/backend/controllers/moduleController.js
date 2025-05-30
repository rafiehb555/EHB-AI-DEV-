const Module = require('../../models/Module');

exports.getAllModules = async (req, res) => {
  const modules = await Module.find().sort({ createdAt: -1 });
  res.json({ modules });
};

exports.createModule = async (req, res) => {
  const { name, description, url, status } = req.body;
  const module = new Module({ name, description, url, status });
  await module.save();
  res.json({ message: '✅ Module added to dashboard', module });
};
