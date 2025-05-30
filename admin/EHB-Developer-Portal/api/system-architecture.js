/**
 * System Architecture API Route
 * 
 * This file serves system architecture data from the data directory.
 */

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'system_architecture.json');
    
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.status(200).json(data);
    } else {
      // Fallback data if file doesn't exist
      res.status(200).json({
        title: 'EHB System Architecture',
        description: 'Enterprise Hybrid Blockchain System Architecture',
        components: [
          {
            name: 'EHB-HOME',
            type: 'frontend',
            description: 'Central dashboard for EHB system',
            dependencies: ['EHB-AI-Dev-Fullstack']
          },
          {
            name: 'EHB-AI-Dev-Fullstack',
            type: 'fullstack',
            description: 'AI development hub and integration services',
            dependencies: ['Database', 'Authentication']
          }
        ],
        dataFlow: []
      });
    }
  } catch (error) {
    console.error('Error serving system architecture data:', error);
    res.status(500).json({ error: 'Failed to load system architecture data' });
  }
};
