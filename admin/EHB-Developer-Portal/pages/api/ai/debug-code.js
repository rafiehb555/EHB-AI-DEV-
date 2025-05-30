/**
 * API Route: /api/ai/debug-code
 * 
 * Endpoint for AI-powered code debugging assistance.
 * This leverages OpenAI's API to help identify and fix code issues.
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
    const { code, error, language } = req.body;

    // Validate input
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // If OpenAI is not configured, return a fallback response
    if (!openai) {
      return res.status(200).json({
        debugResults: {
          issues: ["AI debugging is not available. Please configure OpenAI API key."],
          suggestions: ["Check the developer documentation for common debugging tips."]
        },
        fallback: true
      });
    }

    // Prepare the prompt for OpenAI
    const promptText = `
      You are an expert programming debugger tasked with finding and fixing issues in code.
      
      Here is the ${language || 'JavaScript'} code that has issues:
      
      \`\`\`${language || 'javascript'}
      ${code}
      \`\`\`
      
      ${error ? `The user encountered the following error:\n${error}` : ''}
      
      Please analyze this code and identify any bugs, issues, or improvements. Respond with:
      
      1. A detailed list of issues found in the code
      2. Specific solutions and code fixes for each issue
      3. Explanation of why these issues occurred and how to avoid them in the future
      
      Format your response as structured JSON with the following format:
      {
        "issues": [
          "Issue 1 description",
          "Issue 2 description",
          ...
        ],
        "fixes": [
          "Fix 1 with code example",
          "Fix 2 with code example",
          ...
        ],
        "explanations": [
          "Explanation 1",
          "Explanation 2",
          ...
        ]
      }
      
      Ensure your response is valid JSON that can be parsed.
    `;

    // Call the OpenAI API
    // Note: the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful coding assistant specializing in debugging code. Always return valid JSON that can be parsed." },
        { role: "user", content: promptText }
      ],
      max_tokens: 1500,
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    // Extract the debug results from the response
    const resultText = completion.choices[0].message.content;
    
    // Parse the JSON response
    let debugResults;
    try {
      debugResults = JSON.parse(resultText);
    } catch (jsonError) {
      console.error('Failed to parse JSON response from OpenAI:', jsonError);
      // Fallback to a simpler format if JSON parsing fails
      debugResults = {
        issues: ["Could not parse the AI response properly. Here's the raw output:"],
        fixes: [resultText],
        explanations: ["Please try again with a clearer code sample."]
      };
    }

    // Return the debug results
    return res.status(200).json({ debugResults });
  } catch (error) {
    console.error('Error debugging code:', error);
    return res.status(500).json({ 
      error: 'Failed to debug code',
      message: error.message 
    });
  }
}