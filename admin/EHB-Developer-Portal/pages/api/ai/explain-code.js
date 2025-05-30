/**
 * API Route: /api/ai/explain-code
 * 
 * Endpoint for generating AI explanations of code snippets.
 * This leverages OpenAI's API to provide detailed explanations.
 */

// Import OpenAI SDK
import OpenAI from 'openai';

// Check if we have an OpenAI API key
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);

// Create an instance of the OpenAI client if the API key is available
const openai = hasOpenAIKey
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language, context } = req.body;

    // Validate input
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // If OpenAI is not configured, return a fallback response
    if (!openai) {
      return res.status(200).json({
        explanation: "AI explanation is not available. Please configure OpenAI API key.",
        fallback: true
      });
    }

    // Prepare the prompt for OpenAI
    const prompt = `
      You are an expert programmer and coding instructor tasked with explaining code to someone learning to program.
      
      Please explain the following ${language || 'JavaScript'} code in a clear, concise manner:
      
      \`\`\`${language || 'javascript'}
      ${code}
      \`\`\`
      
      ${context ? `Additional context: ${context}` : ''}
      
      In your explanation:
      1. Start with a high-level overview of what the code does
      2. Break down the key parts or functions
      3. Explain any important concepts or patterns used
      4. Highlight any best practices or potential issues
      
      Keep your explanation friendly and educational, aimed at someone who is learning to code.
    `;

    // Call the OpenAI API
    // Note: the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful coding assistant that explains code clearly and educationally." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    // Extract the explanation from the response
    const explanation = completion.choices[0].message.content;

    // Return the explanation
    return res.status(200).json({ explanation });
  } catch (error) {
    console.error('Error generating code explanation:', error);
    return res.status(500).json({ 
      error: 'Failed to generate explanation',
      message: error.message 
    });
  }
}