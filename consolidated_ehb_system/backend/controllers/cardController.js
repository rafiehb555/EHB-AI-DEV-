const Card = require('../../models/Card');

exports.listCards = async (req, res) => {
  const cards = await Card.find();
  res.json({ cards });
};

exports.createCard = async (req, res) => {
  const { title, description, url, status } = req.body;
  const card = new Card({ title, description, url, status });
  await card.save();
  res.json({ message: '✅ Card created successfully!', card });
};
