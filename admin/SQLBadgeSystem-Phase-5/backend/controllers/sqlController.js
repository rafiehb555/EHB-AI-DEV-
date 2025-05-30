exports.submitScore = async (req, res) => {
  const { score } = req.body;
  let badge = 'Free';

  if (score >= 90) badge = 'VIP';
  else if (score >= 75) badge = 'High';
  else if (score >= 50) badge = 'Normal';
  else if (score >= 25) badge = 'Basic';

  res.json({ badge });
};
