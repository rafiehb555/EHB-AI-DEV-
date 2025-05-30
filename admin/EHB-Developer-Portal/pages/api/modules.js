import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Read modules.json file
    const modulesPath = path.join(process.cwd(), 'modules.json');
    
    if (fs.existsSync(modulesPath)) {
      const modulesData = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
      res.status(200).json(modulesData);
    } else {
      res.status(200).json({ modules: [] });
    }
  } catch (error) {
    console.error('Error reading modules file:', error);
    res.status(500).json({ error: 'Failed to load modules data' });
  }
}