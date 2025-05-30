
const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function askOpenAI(prompt, model = "gpt-4") {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not found. Please add it in Replit Secrets as OPENAI_API_KEY");
  }

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].message.content.trim();
}

module.exports = { askOpenAI };
