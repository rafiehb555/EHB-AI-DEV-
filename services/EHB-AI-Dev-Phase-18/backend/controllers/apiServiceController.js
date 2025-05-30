const APIService = require('../../models/APIService');
const axios = require('axios');

exports.getAPIs = async (req, res) => {
  const apis = await APIService.find({ user: req.user.id });
  res.json(apis);
};

exports.saveAPI = async (req, res) => {
  const { name, endpoint, key } = req.body;
  await APIService.create({ user: req.user.id, name, endpoint, key });
  res.json({ message: 'API saved' });
};

exports.testAPI = async (req, res) => {
  const api = await APIService.findById(req.body.id);
  try {
    const response = await axios.get(api.endpoint, {
      headers: { Authorization: `Bearer ${api.key}` }
    });
    res.json({ response: JSON.stringify(response.data) });
  } catch (err) {
    res.json({ response: 'API Test Failed' });
  }
};
