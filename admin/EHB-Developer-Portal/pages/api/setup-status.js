import fs from 'fs';
import path from 'path';

// Path to setup-needed.json file
const setupFilePath = path.join(process.cwd(), 'setup-needed.json');

// Check if setup is needed
const isSetupNeeded = () => {
  // If the file doesn't exist, assume setup is not needed
  if (!fs.existsSync(setupFilePath)) {
    return false;
  }
  
  try {
    const data = fs.readFileSync(setupFilePath, 'utf8');
    const setupData = JSON.parse(data);
    return setupData.setupNeeded === true;
  } catch (error) {
    console.error('Error reading setup file:', error);
    return false;
  }
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const setupNeeded = isSetupNeeded();
      return res.status(200).json({ setupNeeded });
    } catch (error) {
      console.error('Error checking setup status:', error);
      return res.status(500).json({ error: 'Failed to check setup status' });
    }
  }
  
  // Handle unsupported methods
  return res.status(405).json({ message: 'Method not allowed' });
}