/**
 * Gemini AI Helper
 * 
 * This utility provides a comprehensive interface to Google's Gemini AI models
 * with support for multimodal inputs (text, images, audio) and various output formats.
 * 
 * Version: 1.0.0
 * Date: May 12, 2025
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

// Configuration constants
const LANGCHAIN_SERVICE_URL = process.env.LANGCHAIN_SERVICE_URL || 'http://localhost:5100';

/**
 * Ask Gemini a text-based question
 * @param {string} prompt - The text prompt to send to Gemini
 * @param {Object} options - Optional parameters
 * @param {string} options.model - Model to use (defaults to gemini-pro)
 * @param {number} options.maxTokens - Maximum tokens in response
 * @param {number} options.temperature - Temperature for response randomness (0.0-1.0)
 * @param {boolean} options.streamResponse - Whether to stream the response
 * @returns {Promise<Object>} - Gemini API response
 */
async function askGemini(prompt, options = {}) {
  try {
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const model = options.model || 'gemini-pro';
    const maxTokens = options.maxTokens || 1024;
    const temperature = options.temperature || 0.4;

    const response = await axios.post(`${LANGCHAIN_SERVICE_URL}/api/gemini`, {
      prompt,
      model,
      temperature,
      maxTokens
    });

    return response.data;
  } catch (error) {
    console.error('Error in askGemini:', error.message);
    
    if (error.response && error.response.data) {
      throw new Error(`Gemini API error: ${JSON.stringify(error.response.data)}`);
    } else {
      throw error;
    }
  }
}

/**
 * Process an image with Gemini Vision
 * @param {string|Buffer} image - Image path or buffer
 * @param {string} prompt - The text prompt to guide image analysis
 * @param {Object} options - Optional parameters
 * @returns {Promise<Object>} - Gemini API response
 */
async function processImageWithGemini(image, prompt, options = {}) {
  try {
    if (!image) {
      throw new Error('Image is required');
    }

    const normalizedPrompt = prompt || 'Describe this image in detail';
    const temperature = options.temperature || 0.4;
    const maxTokens = options.maxTokens || 1024;

    let imageBase64;
    if (typeof image === 'string') {
      // Assume it's a file path
      if (!fs.existsSync(image)) {
        throw new Error(`Image file not found: ${image}`);
      }
      imageBase64 = fs.readFileSync(image).toString('base64');
    } else if (Buffer.isBuffer(image)) {
      // It's already a buffer
      imageBase64 = image.toString('base64');
    } else if (typeof image === 'object' && image.buffer && Buffer.isBuffer(image.buffer)) {
      // It's a buffer-like object
      imageBase64 = image.buffer.toString('base64');
    } else {
      throw new Error('Image must be a file path, buffer, or buffer-like object');
    }

    const response = await axios.post(`${LANGCHAIN_SERVICE_URL}/api/gemini/vision`, {
      image: imageBase64,
      prompt: normalizedPrompt,
      temperature,
      maxTokens
    });

    return response.data;
  } catch (error) {
    console.error('Error in processImageWithGemini:', error.message);
    
    if (error.response && error.response.data) {
      throw new Error(`Gemini Vision API error: ${JSON.stringify(error.response.data)}`);
    } else {
      throw error;
    }
  }
}

/**
 * Convert audio to text using Gemini (via transcription)
 * @param {string|Buffer} audio - Audio file path or buffer
 * @param {Object} options - Optional parameters
 * @returns {Promise<string>} - Transcribed text
 */
async function audioToTextWithGemini(audio, options = {}) {
  try {
    if (!audio) {
      throw new Error('Audio is required');
    }

    const language = options.language || 'en-US';
    const formData = new FormData();

    if (typeof audio === 'string') {
      // It's a file path
      if (!fs.existsSync(audio)) {
        throw new Error(`Audio file not found: ${audio}`);
      }
      formData.append('audio', fs.createReadStream(audio));
    } else if (Buffer.isBuffer(audio)) {
      // It's a buffer
      const tempPath = path.join(__dirname, '_temp_audio_' + Date.now() + '.wav');
      fs.writeFileSync(tempPath, audio);
      formData.append('audio', fs.createReadStream(tempPath));
      
      // Clean up the temp file when done
      setTimeout(() => {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }, 5000);
    } else {
      throw new Error('Audio must be a file path or buffer');
    }

    formData.append('language', language);
    
    const response = await axios.post(`${LANGCHAIN_SERVICE_URL}/api/transcribe-audio`, formData, {
      headers: formData.getHeaders()
    });

    return response.data;
  } catch (error) {
    console.error('Error in audioToTextWithGemini:', error.message);
    
    if (error.response && error.response.data) {
      throw new Error(`Audio transcription error: ${JSON.stringify(error.response.data)}`);
    } else {
      throw error;
    }
  }
}

/**
 * Generate images based on text prompt using an image generation service
 * Gemini doesn't currently support image generation, but this function provides
 * a consistent interface using other models (via LangChain service)
 * @param {string} prompt - Text description of the image to generate
 * @param {Object} options - Optional parameters 
 * @returns {Promise<Object>} - Generated image data
 */
async function generateImageWithGemini(prompt, options = {}) {
  try {
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const size = options.size || '1024x1024';
    const style = options.style || 'vivid';
    const quality = options.quality || 'standard';

    const response = await axios.post(`${LANGCHAIN_SERVICE_URL}/api/generate-image`, {
      prompt,
      options: {
        size,
        style,
        quality
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error in generateImageWithGemini:', error.message);
    
    if (error.response && error.response.data) {
      throw new Error(`Image generation error: ${JSON.stringify(error.response.data)}`);
    } else {
      throw error;
    }
  }
}

/**
 * Parse structured data from Gemini response
 * @param {Object} response - Gemini API response object
 * @returns {Object} - Parsed content or error
 */
function parseGeminiResponse(response) {
  if (!response || !response.candidates || !response.candidates[0] || !response.candidates[0].content) {
    throw new Error('Invalid Gemini response format');
  }

  const content = response.candidates[0].content;
  
  // Parse structured data (JSON) if it seems to be in that format
  if (content.parts && content.parts[0] && content.parts[0].text) {
    const text = content.parts[0].text;
    if (text.startsWith('{') && text.endsWith('}')) {
      try {
        return JSON.parse(text);
      } catch (e) {
        // Not valid JSON, return as text
        return { text };
      }
    }
    return { text };
  }
  
  return response;
}

/**
 * Check if Gemini API is available and working
 * @returns {Promise<boolean>} - True if Gemini API is working
 */
async function checkGeminiAvailability() {
  try {
    const response = await axios.get(`${LANGCHAIN_SERVICE_URL}/health`);
    return response.data && 
           response.data.api_keys && 
           response.data.api_keys.gemini === true;
  } catch (error) {
    console.error('Error checking Gemini availability:', error.message);
    return false;
  }
}

module.exports = {
  askGemini,
  processImageWithGemini,
  audioToTextWithGemini,
  generateImageWithGemini,
  parseGeminiResponse,
  checkGeminiAvailability
};