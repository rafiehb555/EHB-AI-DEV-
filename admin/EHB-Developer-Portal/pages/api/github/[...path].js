/**
 * GitHub API Proxy
 * 
 * This proxy forwards requests from the client-side to the AI Integration Hub's GitHub API endpoints.
 * It helps avoid CORS issues and provides a unified API interface for the Developer Portal.
 */

export default async function handler(req, res) {
  try {
    const { path } = req.query;
    
    // Construct the base URL for the AI Integration Hub
    const aiHubBaseUrl = process.env.AI_HUB_URL || 'http://localhost:5150';
    
    // Construct the target URL
    const targetUrl = `${aiHubBaseUrl}/api/github/${path.join('/')}`;
    
    // Forward the request to the AI Integration Hub
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    // Get the response data
    const data = await response.json();
    
    // Forward the response status and data back to the client
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error forwarding GitHub API request:', error);
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to communicate with the GitHub API service'
    });
  }
}