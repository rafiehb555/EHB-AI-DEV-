/**
 * LangChain AI Service Integration
 * 
 * This service provides integration with the LangChain AI service for:
 * - Code generation
 * - Code explanation
 * - Code debugging
 * - Web search via SerpAPI
 */

const LANGCHAIN_API_URL = 'http://localhost:5100/api';

/**
 * Generate code based on requirements
 * @param {string} requirements - Description of what the code should do
 * @param {string} language - Programming language to use (default: javascript)
 * @returns {Promise<{code: string, language: string}>}
 */
export async function generateCode(requirements, language = 'javascript') {
  try {
    const response = await fetch(`${LANGCHAIN_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requirements, language }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating code:', error);
    return {
      code: `// Error generating code: ${error.message}\n// This might be due to OpenAI API connectivity issues`,
      language,
    };
  }
}

/**
 * Explain code using AI
 * @param {string} code - Code to explain
 * @param {string} language - Programming language of the code (default: javascript)
 * @returns {Promise<{explanation: string, language: string}>}
 */
export async function explainCode(code, language = 'javascript') {
  try {
    const response = await fetch(`${LANGCHAIN_API_URL}/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to explain code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error explaining code:', error);
    return {
      explanation: `Error explaining code: ${error.message}. This might be due to OpenAI API connectivity issues.`,
      language,
    };
  }
}

/**
 * Debug code using AI
 * @param {string} code - Code to debug
 * @param {string} errorMessage - Error message if available
 * @param {string} language - Programming language of the code (default: javascript)
 * @returns {Promise<{fixes: Array, explanation: string}>}
 */
export async function debugCode(code, errorMessage = '', language = 'javascript') {
  try {
    const response = await fetch(`${LANGCHAIN_API_URL}/debug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, error_message: errorMessage, language }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to debug code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error debugging code:', error);
    return {
      fixes: [],
      explanation: `Error debugging code: ${error.message}. This might be due to OpenAI API connectivity issues.`,
    };
  }
}

/**
 * Search the web using SerpAPI
 * @param {string} query - Search query
 * @returns {Promise<Object>} - Search results
 */
export async function searchWeb(query) {
  try {
    const response = await fetch(`${LANGCHAIN_API_URL}/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search web');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching web:', error);
    return {
      error: `Error searching web: ${error.message}. This might be due to SerpAPI connectivity issues.`,
      organic_results: [],
      answer_box: null,
    };
  }
}

/**
 * Chat with the AI agent
 * @param {string} message - User message
 * @returns {Promise<{output: string, intermediate_steps: Array}>}
 */
export async function chatWithAgent(message) {
  try {
    const response = await fetch(`${LANGCHAIN_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to chat with AI agent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error chatting with AI agent:', error);
    return {
      output: `Error: ${error.message}. This might be due to OpenAI API connectivity issues.`,
      intermediate_steps: [],
    };
  }
}

export default {
  generateCode,
  explainCode,
  debugCode,
  searchWeb,
  chatWithAgent,
};