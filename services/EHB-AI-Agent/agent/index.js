import { readFileSync, writeFileSync, readdirSync } from 'fs';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

const promptBase = readFileSync('./agent/prompts/systemPrompt.txt', 'utf-8');

async function runAgent() {
  const files = readdirSync('./phases');
  const summaries = [];

  for (const file of files) {
    const filePath = path.join('./phases', file, 'module.js');
    try {
      const content = readFileSync(filePath, 'utf-8');
      summaries.push(`File: ${filePath}\n${content}`);
    } catch (e) {
      // File may not exist
    }
  }

  const completion = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: promptBase },
      { role: 'user', content: summaries.join('\n\n') }
    ]
  });

  const output = completion.data.choices[0].message.content;
  console.log('🧠 Agent Suggestion:\n', output);
}

runAgent();