/**
 * AI Helper Library
 * 
 * This library provides functions for working with AI-powered contextual help
 * and explanations in the EHB Development Portal.
 */

/**
 * Get help topics for a specific section
 * @param {string} section - Section name (dashboard, phases, services, systems, admin)
 * @returns {Array} Array of topic objects with id and label
 */
export function getHelpTopics(section) {
  const topicsMap = {
    dashboard: [
      { id: 'overview', label: 'Overview' },
      { id: 'metrics', label: 'Metrics' },
      { id: 'charts', label: 'Charts' },
      { id: 'status', label: 'Status Indicators' }
    ],
    aidev: [
      { id: 'overview', label: 'Overview' },
      { id: 'phase_modules', label: 'Phase Modules' },
      { id: 'management', label: 'Management Tools' },
      { id: 'integration', label: 'System Integration' }
    ],
    phases: [
      { id: 'overview', label: 'Overview' },
      { id: 'phase_status', label: 'Phase Status' },
      { id: 'dependencies', label: 'Dependencies' },
      { id: 'completion', label: 'Completion Tracking' }
    ],
    services: [
      { id: 'overview', label: 'Overview' },
      { id: 'gosellr', label: 'GoSellr' },
      { id: 'jps', label: 'JPS' },
      { id: 'aidev', label: 'AI Dev Service' }
    ],
    systems: [
      { id: 'overview', label: 'Overview' },
      { id: 'blockchain', label: 'Blockchain System' },
      { id: 'sql', label: 'SQL Department' },
      { id: 'franchise', label: 'Franchise System' }
    ],
    admin: [
      { id: 'overview', label: 'Overview' },
      { id: 'settings', label: 'Settings' },
      { id: 'user_management', label: 'User Management' },
      { id: 'permissions', label: 'Permissions' }
    ]
  };
  
  return topicsMap[section] || topicsMap.dashboard;
}

/**
 * Get sample explanation for a topic (used while waiting for API response)
 * @param {string} section - Section name
 * @param {string} topic - Topic ID
 * @returns {string} Sample explanation text
 */
export function getSampleExplanation(section, topic) {
  // Simple mapping to provide fallback explanations before API call
  const explanations = {
    dashboard: {
      overview: "The Dashboard provides a comprehensive view of the entire EHB ecosystem at a glance. It shows key metrics, service status, and system health indicators.",
      metrics: "Dashboard metrics show important numbers like phase completion percentages, active services count, and system health indicators to give you a quick overview of the project status.",
      charts: "Charts visualize data over time, helping you understand trends in project progress, service performance, and system utilization.",
      status: "Status indicators use color coding (green, blue, yellow, gray) to show the current state of various components, making it easy to identify what needs attention."
    },
    aidev: {
      overview: "The AI-Dev Dashboard is the administrative interface for the EHB-AI-Dev project. It provides tools for managing all phases and components of the EHB AI Development system.",
      phase_modules: "Phase Modules display all the different components of the EHB-AI-Dev system. Each module represents a specific functionality or development phase with its own status and configuration.",
      management: "Management Tools in the AI-Dev Dashboard allow administrators to control, monitor, and update various aspects of the EHB-AI-Dev system, including user permissions and feature flags.",
      integration: "System Integration features help connect the EHB-AI-Dev components with other parts of the EHB ecosystem, ensuring data flows smoothly between different services."
    },
    phases: {
      overview: "The Phases section displays all 31 development phases of the EHB system. Each phase represents a specific component or functionality being developed.",
      phase_status: "Phase status indicators show whether a phase is 'Completed', 'In Progress', or 'Not Started', helping track overall project progress.",
      dependencies: "The dependencies view shows what technologies, libraries, and other phases each development phase relies on, helping manage the development sequence.",
      completion: "Completion tracking uses progress bars to visually display how much of each phase has been completed, giving a precise measure of progress."
    },
    services: {
      overview: "The Services section displays all microservices in the EHB ecosystem. Each service is responsible for specific functionality and can be deployed independently.",
      gosellr: "The GoSellr service is the e-commerce and franchise management platform that handles products, sales, franchisees, and retail operations.",
      jps: "The JPS (Job Providing Service) handles task management, distributes jobs to workers, and tracks completion and quality metrics.",
      aidev: "The AI Dev Service provides AI-powered development tools, code generation, and automation capabilities for internal development teams."
    },
    systems: {
      overview: "The Systems section shows core infrastructure components that power the EHB platform, providing the foundation for all services and applications.",
      blockchain: "The Blockchain System provides secure, immutable transaction records and smart contracts to ensure trust and traceability in business operations.",
      sql: "The SQL Department handles all database management, query optimization, data storage, and retrieval operations across the platform.",
      franchise: "The Franchise System manages multi-level franchise relationships, reporting structures, commission calculations, and operational guidelines."
    },
    admin: {
      overview: "The Admin section provides tools for managing the EHB platform, including user accounts, system settings, and configuration options.",
      settings: "Admin Settings allow configuration of system-wide parameters like notification preferences, security policies, and integration endpoints.",
      user_management: "User Management handles user accounts, roles, access control, and profile information for all platform users.",
      permissions: "Permission levels determine what actions users can perform within the system, with granular control over specific features and data."
    }
  };
  
  // Return explanation if it exists, or a generic one
  return explanations[section]?.[topic] || 
    "This section provides information about the EHB Development Portal. Click on a topic in the sidebar to learn more about specific features.";
}

/**
 * Get contextual help explanation from the AI service
 * @param {string} section - Section name
 * @param {string} topic - Topic ID
 * @returns {Promise<string>} AI-generated explanation
 */
export async function getContextualHelp(section, topic) {
  try {
    // Make an API call to get contextual help
    const response = await fetch('/api/ai/contextual-help', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ section, topic }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch contextual help');
    }
    
    const data = await response.json();
    return data.explanation;
  } catch (error) {
    console.error('Error fetching contextual help:', error);
    return null;
  }
}

/**
 * Generate AI explanation using OpenAI (for direct client-side use if needed)
 * @param {string} prompt - The prompt to send to OpenAI
 * @returns {Promise<string>} AI-generated explanation
 */
export async function generateAIExplanation(prompt) {
  try {
    // This function is just a placeholder - we'll use the API endpoint instead
    // for security and to avoid exposing the API key
    
    return "This functionality is available through the backend API endpoint.";
    
    /* Actual implementation would look like this server-side:
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: 'system', content: 'You are a helpful assistant that provides clear, concise explanations about the EHB Development Portal.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
    */
  } catch (error) {
    console.error('Error generating AI explanation:', error);
    return "I'm sorry, I couldn't generate an explanation at this time. Please try again later.";
  }
}