const Tool = require('../../models/Tool');
const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

exports.getTools = async (req, res) => {
  const tools = await Tool.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(tools);
};

exports.createTool = async (req, res) => {
  const { title, promptTemplate } = req.body;
  await Tool.create({ user: req.user.id, title, promptTemplate });
  res.json({ message: 'Tool created' });
};

exports.runTool = async (req, res) => {
  const { toolId, input } = req.body;
  const tool = await Tool.findById(toolId);
  const prompt = tool.promptTemplate.replace('{{input}}', input);

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });

  const result = response.data.choices[0].message.content;
  res.json({ result });
};
