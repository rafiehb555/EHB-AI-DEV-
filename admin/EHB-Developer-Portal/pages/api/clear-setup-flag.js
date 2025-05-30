/**
 * API route to clear the setup flag
 * 
 * This route clears the setup flag after the user has viewed the setup page.
 */

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const setupFlagPath = path.join(process.cwd(), '..', '..', 'admin', 'Developer-Portal-UI', 'setup-needed.json');
    
    if (fs.existsSync(setupFlagPath)) {
      // Update the flag to indicate setup is no longer needed
      fs.writeFileSync(setupFlagPath, JSON.stringify({ 
        setupNeeded: false, 
        timestamp: new Date().toISOString() 
      }));
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error clearing setup flag:', error);
    res.status(500).json({ error: 'Failed to clear setup flag' });
  }
}