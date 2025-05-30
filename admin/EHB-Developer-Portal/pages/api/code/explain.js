/**
 * Code Explanation API Proxy
 * 
 * This proxy forwards requests to the AI Integration Hub's code explanation service
 */
import axios from 'axios';

// Use the AI Integration Hub URL from siteConfig if available
// This ensures consistency with the siteConfig configuration
import siteConfig from '../../../siteConfig';
const AI_INTEGRATION_HUB_URL = process.env.AI_INTEGRATION_HUB_URL || 
  (siteConfig.services?.aiIntegrationHubUrl || 'http://localhost:5150');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { code, language, model } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }

    // Forward the request to the AI Integration Hub
    const response = await axios.post(`${AI_INTEGRATION_HUB_URL}/api/code/explain`, {
      code,
      language: language || 'javascript',
      model: model || ''
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60-second timeout for longer explanations
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error proxying code explanation request:', error);
    
    // Format the error message
    let errorMessage = 'Failed to generate code explanation';
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from code explanation service. Please try again later.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}