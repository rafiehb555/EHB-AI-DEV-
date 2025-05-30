exports.askAI = async (req, res) => {
  const { question } = req.body;
  const simulatedResponse = "To create a login page, you need a form with username and password fields, and a backend route to validate credentials.";
  res.json({ answer: simulatedResponse });
};
