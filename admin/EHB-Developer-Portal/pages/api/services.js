import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Define service structure
    const services = [
      {
        id: 'gosellr',
        name: 'GoSellr',
        description: 'E-commerce and franchise management solution',
        status: 'online',
        completionPercentage: 90,
        icon: 'box',
        color: 'purple',
        path: '/gosellr',
        lastUpdated: '2025-05-10T15:30:00Z'
      },
      {
        id: 'ai-playground',
        name: 'AI Playground',
        description: 'Interactive AI code generation and testing environment',
        status: 'online',
        completionPercentage: 85,
        icon: 'code',
        color: 'blue',
        path: '/playground',
        lastUpdated: '2025-05-09T10:15:00Z'
      },
      {
        id: 'jps',
        name: 'JPS Service',
        description: 'Job Providing Service for enterprise task management',
        status: 'online',
        completionPercentage: 70,
        icon: 'database',
        color: 'orange',
        path: '/jps',
        lastUpdated: '2025-05-08T14:45:00Z'
      },
      {
        id: 'ehb-ai-dev',
        name: 'EHB-AI-Dev Service',
        description: 'AI-powered development automation platform',
        status: 'online',
        completionPercentage: 65,
        icon: 'activity',
        color: 'red',
        path: '/ai-dev',
        lastUpdated: '2025-05-11T09:20:00Z'
      },
      {
        id: 'smartaccesscontrol',
        name: 'Smart Access Control',
        description: 'Role-based access control system with AI-powered security',
        status: 'online',
        completionPercentage: 80,
        icon: 'lock',
        color: 'teal',
        path: '/access-control',
        lastUpdated: '2025-05-07T11:35:00Z'
      },
      {
        id: 'voice-gpt',
        name: 'Voice GPT AI Agent',
        description: 'Voice-driven AI assistant for natural language interactions',
        status: 'online',
        completionPercentage: 75,
        icon: 'mic',
        color: 'cyan',
        path: '/voice-gpt',
        lastUpdated: '2025-05-06T16:50:00Z'
      }
    ];
    
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services data' });
  }
}