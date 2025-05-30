import fs from 'fs';
import path from 'path';

// Path to setup-needed.json file
const setupFilePath = path.join(process.cwd(), 'setup-needed.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Check if file exists
      if (fs.existsSync(setupFilePath)) {
        // Remove the file or update its content
        fs.writeFileSync(
          setupFilePath,
          JSON.stringify({ setupNeeded: false }, null, 2),
          'utf8'
        );
      } else {
        // Create the file with setupNeeded: false
        fs.writeFileSync(
          setupFilePath,
          JSON.stringify({ setupNeeded: false }, null, 2),
          'utf8'
        );
      }
      
      return res.status(200).json({
        success: true,
        message: 'Setup completed successfully'
      });
    } catch (error) {
      console.error('Error completing setup:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to complete setup'
      });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({ message: 'Method not allowed' });
}