import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const phasesData = [];
    const phasesPath = path.join(process.cwd(), '../../services/SOT-Technologies/EHB-AI-Dev/phases');
    
    // Check if directory exists
    if (!fs.existsSync(phasesPath)) {
      return res.status(200).json([]);
    }
    
    // Get all phase directories
    const phaseDirs = fs.readdirSync(phasesPath).filter(dir => 
      dir.startsWith('EHB-AI-Dev-Phase-') && 
      fs.statSync(path.join(phasesPath, dir)).isDirectory()
    );
    
    // Read config.json from each phase directory
    for (const phaseDir of phaseDirs) {
      const configPath = path.join(phasesPath, phaseDir, 'config.json');
      
      if (fs.existsSync(configPath)) {
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        // Extract phase number from directory name
        const phaseMatch = phaseDir.match(/EHB-AI-Dev-Phase-(\d+)/);
        const phaseNumber = phaseMatch ? parseInt(phaseMatch[1]) : 0;
        
        phasesData.push({
          id: phaseNumber,
          name: configData.name,
          description: configData.description,
          status: configData.status,
          dependencies: configData.dependencies,
          interfaces: configData.interfaces,
          completionPercentage: configData.completionPercentage || 0,
          lastUpdated: configData.lastUpdated,
          estimatedCompletion: configData.estimatedCompletion
        });
      }
    }
    
    // Sort phases by ID
    phasesData.sort((a, b) => a.id - b.id);
    
    res.status(200).json(phasesData);
  } catch (error) {
    console.error('Error fetching phases:', error);
    res.status(500).json({ message: 'Failed to fetch phases data' });
  }
}