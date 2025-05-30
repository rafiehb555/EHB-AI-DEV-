/**
 * Code Explanation Status API Proxy
 * 
 * This proxy forwards status requests to the AI Integration Hub's code explanation service
 */
import axios from 'axios';

// Use the AI Integration Hub URL from siteConfig if available
// This ensures consistency with the siteConfig configuration
import siteConfig from '../../../siteConfig';
const AI_INTEGRATION_HUB_URL = process.env.AI_INTEGRATION_HUB_URL || 
  (siteConfig.services?.aiIntegrationHubUrl || 'http://localhost:5150');

export default async function handler(req, res) {
  try {
    // Forward the request to the AI Integration Hub
    const response = await axios.get(`${AI_INTEGRATION_HUB_URL}/api/code/status`, {
      timeout: 5000, // 5-second timeout for status checks
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error checking code explanation service status:', error);
    
    let errorMessage = 'Failed to check code explanation service status';
    let providers = {};
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Code explanation service is not available';
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
    }

    return res.status(200).json({
      success: false,
      message: errorMessage,
      activeProvider: null,
      providers: providers
    });
  }
}