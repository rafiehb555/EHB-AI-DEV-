/**
 * API Route: /api/ai/suggest-code
 * 
 * Endpoint for generating AI code suggestions and improvements.
 * This leverages OpenAI's API to provide intelligent coding assistance.
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
    const { code, prompt, language } = req.body;

    // Validate input
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // If OpenAI is not configured, return a fallback response
    if (!openai) {
      return res.status(200).json({
        suggestions: "AI code suggestions are not available. Please configure OpenAI API key.",
        fallback: true
      });
    }

    // Prepare the prompt for OpenAI
    const promptText = `
      You are an expert programmer and coding instructor tasked with suggesting improvements to code.
      
      Here is the ${language || 'JavaScript'} code:
      
      \`\`\`${language || 'javascript'}
      ${code}
      \`\`\`
      
      The user is trying to: ${prompt}
      
      Please provide suggested improvements or solutions to help the user achieve their goal.
      
      In your suggestions:
      1. Explain what you're changing and why
      2. Provide the improved code
      3. Add any relevant tips or best practices
      
      Format your response to be clear and educational, focusing on teaching the concepts while helping the user solve their problem.
    `;

    // Call the OpenAI API
    // Note: the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful coding assistant that provides accurate and educational code suggestions." },
        { role: "user", content: promptText }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    // Extract the suggestions from the response
    const suggestions = completion.choices[0].message.content;

    // Return the suggestions
    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error generating code suggestions:', error);
    return res.status(500).json({ 
      error: 'Failed to generate suggestions',
      message: error.message 
    });
  }
}