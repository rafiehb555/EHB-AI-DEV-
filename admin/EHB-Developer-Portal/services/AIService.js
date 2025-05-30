/**
 * AI Service for code explanations and other AI-powered features
 * 
 * This service provides methods to interact with AI services like OpenAI or Anthropic
 * for code explanations, suggestions, and other AI-powered features in the application.
 */

// Check if we have access to the OpenAI API key
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);

/**
 * Get a code explanation from the AI service
 * @param {string} code - The code to explain
 * @param {string} language - The programming language of the code
 * @param {string} context - Additional context about the code or what the user is trying to achieve
 * @returns {Promise<string>} - The explanation from the AI
 */
export async function getCodeExplanation(code, language = 'javascript', context = '') {
  try {
    // If we're in the browser, make an API call to our backend endpoint
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/ai/explain-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          context
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.explanation;
    } 
    // If we're on the server, we can call the OpenAI API directly
    else {
      // This is a fallback for server-side rendering or testing
      // In a real implementation, you would make a direct call to the AI service
      // using the appropriate API key
      return "This is a placeholder for the AI explanation that would be generated server-side.";
    }
  } catch (error) {
    console.error('Error getting code explanation:', error);
    return "Sorry, I couldn't generate an explanation for this code right now. Please try again later.";
  }
}

/**
 * Generate code suggestions or improvements
 * @param {string} code - The current code
 * @param {string} prompt - What the user is trying to achieve or fix
 * @param {string} language - The programming language
 * @returns {Promise<string>} - The suggested code improvements
 */
export async function getCodeSuggestions(code, prompt, language = 'javascript') {
  try {
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/ai/suggest-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          prompt,
          language
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.suggestions;
    } else {
      return "This is a placeholder for the AI code suggestions that would be generated server-side.";
    }
  } catch (error) {
    console.error('Error getting code suggestions:', error);
    return "Sorry, I couldn't generate code suggestions right now. Please try again later.";
  }
}

/**
 * Debug code and find potential issues
 * @param {string} code - The code to debug
 * @param {string} error - Any error message the user encountered
 * @param {string} language - The programming language
 * @returns {Promise<object>} - The debugging results with identified issues and suggestions
 */
export async function debugCode(code, error = '', language = 'javascript') {
  try {
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/ai/debug-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          error,
          language
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.debugResults;
    } else {
      return {
        issues: ["This is a placeholder for AI-detected issues"],
        suggestions: ["This is a placeholder for AI debugging suggestions"]
      };
    }
  } catch (error) {
    console.error('Error debugging code:', error);
    return {
      issues: ["Sorry, I couldn't debug this code right now."],
      suggestions: ["Please try again later."]
    };
  }
}

/**
 * Check if the AI service is available and configured
 * @returns {boolean} - Whether the AI service is available
 */
export function isAIServiceAvailable() {
  // In a real implementation, this would check for API keys and service availability
  return hasOpenAIKey || process.env.ANTHROPIC_API_KEY;
}