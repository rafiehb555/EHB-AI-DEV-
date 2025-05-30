/**
 * AI Contextual Help API
 * 
 * This API endpoint uses OpenAI to generate contextual help and explanations
 * for various sections of the EHB Development Portal.
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract section and topic from request body
    const { section, topic } = req.body;

    if (!section || !topic) {
      return res.status(400).json({
        message: 'Missing required parameters: section and topic are required',
      });
    }

    // Generate context for the AI based on section and topic
    const context = generateContext(section, topic);
    
    // Call OpenAI API
    const explanation = await generateAIExplanation(context);

    // Return the explanation
    return res.status(200).json({ explanation });
  } catch (error) {
    console.error('Error in contextual-help API:', error);
    return res.status(500).json({
      message: 'An error occurred while generating the explanation',
      error: error.message,
    });
  }
}

// Generate context for the AI model based on section and topic
function generateContext(section, topic) {
  const sectionDescriptions = {
    dashboard: "The EHB Development Portal Dashboard shows overall project statistics, phase completions, and service statuses.",
    aidev: "The AI-Dev Dashboard provides an administrative interface for the EHB-AI-Dev project, with tools for managing all phases and components.",
    phases: "The Phases section displays all 31 development phases of the EHB system, with their status, dependencies, and completion percentages.",
    services: "The Services section shows all microservices in the EHB ecosystem, including GoSellr, JPS, and AI Dev services.",
    systems: "The Systems section displays core infrastructure components like the Blockchain System, SQL Department, and Franchise System.",
    admin: "The Admin section provides administrative tools for managing users, settings, and configurations."
  };

  // Get specific topic instructions based on section and topic
  const topicDetails = getTopicDetails(section, topic);

  return `
You are an AI assistant for the EHB (Enterprise Hybrid Blockchain) Development Portal.
A user is viewing the ${section} section and wants information about "${topic}".

Context about this section:
${sectionDescriptions[section] || "This is a section of the EHB Development Portal."}

Specific information about "${topic}":
${topicDetails}

Please provide a clear, concise explanation (2-3 paragraphs max) using simple language.
Include specific details relevant to the EHB system where appropriate.
`;
}

// Get detailed information about specific topics
function getTopicDetails(section, topic) {
  const topicDetailsMap = {
    dashboard: {
      overview: "The dashboard provides a comprehensive view of all EHB components, showing real-time status.",
      metrics: "Dashboard metrics include phase completion percentages, active services count, and system health indicators.",
      charts: "Dashboard charts visualize project progress, service performance, and system utilization over time.",
      status: "Status indicators show the current state of various system components using color codes (green: online/complete, blue: in progress, gray: not started)."
    },
    aidev: {
      overview: "The AI-Dev Dashboard is the central administrative interface for the EHB-AI-Dev project, showing all phases and components.",
      phase_modules: "The Phase Modules section displays all the individual components of the EHB-AI-Dev system, with detailed status information for each module.",
      management: "Management tools include options for controlling module functionality, user permissions, and system configurations.",
      integration: "Integration features allow the AI-Dev components to connect with other parts of the EHB ecosystem."
    },
    phases: {
      overview: "The phases view shows all 31 development phases of the EHB system in a structured format.",
      phase_status: "Phase statuses are categorized as Completed, In Progress, or Not Started, with visual indicators.",
      dependencies: "Dependencies show which technologies, libraries, and other phases each development phase relies upon.",
      completion: "Completion tracking indicates the percentage of work completed for each phase using progress bars."
    },
    services: {
      overview: "Services are independent microservices that provide specific functionality within the EHB ecosystem.",
      gosellr: "GoSellr is the e-commerce and franchise management platform, handling products, sales, and franchise operations.",
      jps: "JPS (Job Providing Service) handles task management and job distribution across the EHB ecosystem.",
      aidev: "AI Dev Service provides AI-powered development tools, code generation, and automation capabilities."
    },
    systems: {
      overview: "Systems are the core infrastructure components that power the EHB platform.",
      blockchain: "The Blockchain System provides secure, immutable transaction records for all operations.",
      sql: "The SQL Department handles database management, query optimization, and data storage.",
      franchise: "The Franchise System manages multi-level franchise relationships, reporting, and operations."
    },
    admin: {
      overview: "The Admin section provides tools for managing the EHB platform.",
      settings: "Admin Settings allow configuration of system-wide parameters and default behaviors.",
      user_management: "User Management handles user accounts, access control, and profile information.",
      permissions: "Permission levels determine what actions users can perform within the system."
    }
  };

  return topicDetailsMap[section]?.[topic] || "This topic provides information about a specific aspect of the EHB system.";
}

// Generate explanation using OpenAI
async function generateAIExplanation(context) {
  try {
    // For now, return a placeholder message - we'll implement actual API call below
    return "This is a placeholder for real-time AI-generated explanations. The actual implementation will connect to OpenAI's API to generate contextual help based on the current section and topic.";
    
    /* 
    Uncomment to implement actual OpenAI integration:
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: 'system', content: 'You are a helpful assistant that provides clear, concise explanations about the EHB Development Portal.' },
          { role: 'user', content: context }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(data.error.message);
    }
    
    return data.choices[0].message.content.trim();
    */
  } catch (error) {
    console.error('Error generating AI explanation:', error);
    return "I'm sorry, I couldn't generate an explanation at this time. Please try again later.";
  }
}