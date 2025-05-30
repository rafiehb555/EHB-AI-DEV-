const { Configuration, OpenAIApi } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const openAIConfig = require('../config/openai');
const { getDomainKnowledge, getRoleInstructions } = require('../config/openai');
const { domainSpecificPrompts } = require('../config/aiKnowledgeBase');

/**
 * AI Explain Controller
 * Provides AI-powered explanations for various parts of the application
 */
const aiExplainController = {
  /**
   * Get AI-powered explanation for a specific context
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getExplanation(req, res) {
    try {
      const { context, query, format = 'standard', userRole = req.user?.role || 'buyer' } = req.body;
      
      if (!context) {
        return res.status(400).json({
          success: false,
          message: 'Context is required'
        });
      }
      
      // Determine which AI service to use based on available configuration
      let explanation;
      
      if (process.env.ANTHROPIC_API_KEY) {
        explanation = await aiExplainController.getExplanationFromAnthropic(context, query, format, userRole);
      } else if (process.env.OPENAI_API_KEY) {
        explanation = await aiExplainController.getExplanationFromOpenAI(context, query, format, userRole);
      } else {
        // Fallback explanations if no AI service is available
        explanation = aiExplainController.getFallbackExplanation(context, userRole);
      }
      
      return res.status(200).json({
        success: true,
        explanation
      });
    } catch (error) {
      console.error('Error getting AI explanation:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get AI explanation',
        error: error.message
      });
    }
  },
  
  /**
   * Get explanation from Anthropic's Claude model
   * 
   * @param {string} context - The context/area being explained
   * @param {string} query - Specific question about the context
   * @param {string} format - Response format (standard, conversational, bullet)
   * @param {string} userRole - The role of the user requesting the explanation
   * @returns {Promise<string>} - The AI-generated explanation
   */
  async getExplanationFromAnthropic(context, query, format, userRole) {
    try {
      // Initialize Anthropic client
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      
      // Get role-specific instructions
      const roleInfo = getRoleInstructions(userRole);
      
      // Get context-specific information
      const contextInfo = this.getContextInfo(context, userRole);
      
      // Prepare the prompt
      const systemPrompt = this.getSystemPrompt(format, userRole, contextInfo);
      const humanPrompt = this.getHumanPrompt(context, query, format, userRole);
      
      // Get response from Claude
      // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        system: systemPrompt,
        max_tokens: 800,
        messages: [{ role: "user", content: humanPrompt }]
      });
      
      return response.content[0].text;
    } catch (error) {
      console.error('Error with Anthropic API:', error);
      // Fallback to default explanations
      return this.getFallbackExplanation(context, userRole);
    }
  },
  
  /**
   * Get explanation from OpenAI's GPT model
   * 
   * @param {string} context - The context/area being explained
   * @param {string} query - Specific question about the context
   * @param {string} format - Response format (standard, conversational, bullet)
   * @param {string} userRole - The role of the user requesting the explanation
   * @returns {Promise<string>} - The AI-generated explanation
   */
  async getExplanationFromOpenAI(context, query, format, userRole) {
    try {
      // Use the OpenAI instance from config
      const openai = openAIConfig.openai;
      
      // Get role-specific instructions
      const roleInfo = getRoleInstructions(userRole);
      
      // Get context-specific information
      const contextInfo = this.getContextInfo(context, userRole);
      
      // Prepare the prompt
      const systemPrompt = this.getSystemPrompt(format, userRole, contextInfo);
      const userPrompt = this.getHumanPrompt(context, query, format, userRole);
      
      // Get response from GPT
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      // Fallback to default explanations
      return this.getFallbackExplanation(context, userRole);
    }
  },
  
  /**
   * Get context-specific information based on the context and user role
   * 
   * @param {string} context - The context/area being explained
   * @param {string} userRole - User role
   * @returns {Object} - Context-specific information
   */
  getContextInfo(context, userRole) {
    // Map contexts to domains for getting relevant knowledge
    const contextToDomain = {
      products: { industry: 'retail', domain: 'inventory' },
      inventory: { industry: 'retail', domain: 'inventory' },
      pricing: { industry: 'retail', domain: 'pricing' },
      customers: { industry: 'retail', domain: 'customerService' },
      marketing: { industry: 'ecommerce', domain: 'digitalMarketing' },
      website: { industry: 'ecommerce', domain: 'websiteOptimization' },
      orders: { industry: 'ecommerce', domain: 'fulfillment' },
      locations: { industry: 'franchising', domain: 'locationManagement' },
      performance: { industry: 'franchising', domain: 'performance' },
      compliance: { industry: 'franchising', domain: 'brandCompliance' },
    };
    
    // Get domain knowledge if available
    let domainKnowledge = null;
    if (contextToDomain[context]) {
      const { industry, domain } = contextToDomain[context];
      domainKnowledge = getDomainKnowledge(industry, domain);
    }
    
    // Get additional context descriptions
    const contextDescriptions = {
      dashboard: {
        description: "The main dashboard where users can view metrics and navigate to different sections",
        features: [
          "Key performance indicators relevant to the user's role",
          "Quick links to frequently used sections",
          "Recent activity and notifications",
          "Customizable widgets and layout",
          "Role-specific insights and recommendations"
        ],
        tips: [
          "Drag and drop widgets to customize your layout",
          "Use the filter options to focus on specific time periods",
          "Hover over charts for detailed information",
          "Click on metrics to drill down into detailed reports",
          "Use the search function to quickly find features"
        ]
      },
      documents: {
        description: "The document management section where users can upload, organize and share files",
        features: [
          "Secure document storage with version history",
          "Folder organization with drag-and-drop functionality",
          "Access control and permission management",
          "Document preview and inline editing",
          "Collaborative annotations and comments"
        ],
        tips: [
          "Use tags to categorize documents for easier searching",
          "Set up access permissions when uploading sensitive files",
          "Enable notifications for important document changes",
          "Use the batch upload feature for multiple files",
          "Check version history before overwriting documents"
        ]
      },
      analytics: {
        description: "The analytics section showing charts, reports and business intelligence data",
        features: [
          "Interactive data visualizations and dashboards",
          "Custom report generation with filterable parameters",
          "Data export in multiple formats (CSV, PDF, Excel)",
          "Scheduled reports with email delivery",
          "Predictive analytics and trend forecasting"
        ],
        tips: [
          "Save frequently used report configurations as templates",
          "Use comparison views to analyze period-over-period changes",
          "Export reports as PDFs for professional presentations",
          "Schedule key reports to be delivered to your inbox",
          "Use filters to focus on specific segments or time periods"
        ]
      },
      feedback: {
        description: "The feedback section where users can submit suggestions and report issues",
        features: [
          "Structured feedback forms for different types of input",
          "Status tracking for submitted feedback",
          "Upvoting system for community prioritization",
          "Response notifications and follow-up threads",
          "Feedback analytics for administrators"
        ],
        tips: [
          "Be specific when describing issues or suggestions",
          "Include screenshots or recordings when relevant",
          "Check existing feedback before submitting duplicates",
          "Follow up on your submissions to provide additional context",
          "Upvote similar feedback to help prioritize issues"
        ]
      },
      products: {
        description: "The product catalog management section for sellers to manage their inventory",
        features: [
          "Product listing with detailed attributes and images",
          "Inventory tracking and stock level alerts",
          "Bulk import/export functionality",
          "Category and tag management",
          "Pricing controls and promotional tools"
        ],
        tips: [
          "Use high-quality images from multiple angles",
          "Write detailed product descriptions with key features",
          "Set up stock alerts to avoid inventory shortages",
          "Use bulk editing for seasonal price updates",
          "Regularly review product performance metrics"
        ]
      },
      orders: {
        description: "The order management and processing section",
        features: [
          "Comprehensive order history and status tracking",
          "Order filtering and search functionality",
          "Bulk order processing and management",
          "Automated shipping and fulfillment integration",
          "Customer communication tools for order updates"
        ],
        tips: [
          "Use the batch processing for efficient order handling",
          "Set up automated status update notifications",
          "Regularly check for pending orders requiring action",
          "Use order notes for special handling instructions",
          "Review order analytics to identify sales patterns"
        ]
      }
    };
    
    return {
      domainKnowledge,
      contextInfo: contextDescriptions[context] || { 
        description: `The ${context} section of the application`,
        features: [],
        tips: []
      }
    };
  },
  
  /**
   * Get system prompt based on desired format and user role
   * 
   * @param {string} format - Response format (standard, conversational, bullet)
   * @param {string} userRole - The role of the user requesting the explanation
   * @param {Object} contextInfo - Additional context information
   * @returns {string} - The system prompt
   */
  getSystemPrompt(format, userRole, contextInfo) {
    // Get role-specific instructions
    const roleInfo = getRoleInstructions(userRole);
    
    // Base prompt with role-specific adaptations
    let basePrompt = `You are a specialized assistant providing clear explanations about features in a business dashboard application for ${userRole}s. `;
    
    // Add domain knowledge if available
    if (contextInfo.domainKnowledge) {
      basePrompt += `\n\nRelevant industry knowledge: ${contextInfo.domainKnowledge.description}\n`;
      
      // Add best practices
      if (contextInfo.domainKnowledge.bestPractices && contextInfo.domainKnowledge.bestPractices.length > 0) {
        basePrompt += `\nBest practices in this area include: `;
        basePrompt += contextInfo.domainKnowledge.bestPractices.slice(0, 3).join('; ');
      }
      
      // Add key metrics
      if (contextInfo.domainKnowledge.keyMetrics && contextInfo.domainKnowledge.keyMetrics.length > 0) {
        basePrompt += `\n\nKey metrics to focus on: `;
        basePrompt += contextInfo.domainKnowledge.keyMetrics.slice(0, 3).join('; ');
      }
    }
    
    // Add format-specific instructions
    switch (format) {
      case 'conversational':
        basePrompt += `\n\nBe friendly, conversational, and approachable, as if chatting with the user. Keep explanations under 4 sentences. Use simple language without technical jargon. Focus on how this feature specifically helps a ${userRole}.`;
        break;
      
      case 'bullet':
        basePrompt += `\n\nProvide your response in a concise bullet point format with 3-5 key points. Each point should be brief and actionable. Prioritize information most relevant to a ${userRole}.`;
        break;
        
      case 'standard':
      default:
        basePrompt += `\n\nBe clear, concise and straightforward. Keep explanations under 4 sentences. Focus on practicality and avoid technical jargon. Emphasize aspects most relevant to a ${userRole}.`;
        break;
    }
    
    return basePrompt;
  },
  
  /**
   * Get human prompt based on context and query
   * 
   * @param {string} context - The context/area being explained
   * @param {string} query - Specific question about the context
   * @param {string} format - Response format (standard, conversational, bullet)
   * @param {string} userRole - The role of the user requesting the explanation
   * @returns {string} - The human prompt
   */
  getHumanPrompt(context, query, format, userRole) {
    // Get context-specific information
    const { contextInfo } = this.getContextInfo(context, userRole);
    
    // Use detailed context description if available
    const contextDescription = contextInfo.description || `the ${context} section`;
    
    // Create a more detailed prompt with available features and tips
    let detailedPrompt = '';
    
    if (contextInfo.features && contextInfo.features.length > 0) {
      detailedPrompt += `\n\nThis section includes features such as: ${contextInfo.features.join(', ')}`;
    }
    
    if (contextInfo.tips && contextInfo.tips.length > 0) {
      detailedPrompt += `\n\nSome helpful tips for ${userRole}s include: ${contextInfo.tips.slice(0, 3).join('; ')}`;
    }
    
    // Add role context
    detailedPrompt += `\n\nPlease provide an explanation tailored for a ${userRole}.`;
    
    if (query) {
      return `Explain ${contextDescription}: ${query}${detailedPrompt}`;
    }
    
    return `Explain what ${contextDescription} is used for and how to use it effectively as a ${userRole}.${detailedPrompt}`;
  },
  
  /**
   * Get fallback explanation when AI services are unavailable
   * 
   * @param {string} context - The context/area to explain
   * @param {string} userRole - The role of the user requesting the explanation
   * @returns {string} - The fallback explanation
   */
  getFallbackExplanation(context, userRole) {
    // Base fallback explanations
    const fallbackExplanations = {
      dashboard: "The dashboard shows your key metrics and provides navigation to all sections of the application. You can view recent activity, important notifications, and access quick actions from here.",
      
      documents: "The document section allows you to upload, organize, and share files. You can create folders, move documents between them, and control access permissions. Use the upload button to add new files.",
      
      analytics: "The analytics section provides visualizations and reports of your business data. You can view trends, filter by different time periods, and export reports for further analysis.",
      
      feedback: "The feedback section lets you share your thoughts, suggestions, and report any issues. Your input helps us improve the application and address any problems you encounter.",
      
      settings: "The settings page allows you to customize your account preferences, notification settings, and security options. Changes are automatically saved as you make them.",
      
      users: "The user management section enables administrators to create accounts, assign roles, and manage permissions. You can view active users, reset passwords, and deactivate accounts when needed.",
      
      products: "The product catalog lets you manage your inventory, update product details, and adjust pricing. You can add new products, organize them into categories, and modify availability.",
      
      orders: "The order management section shows all customer orders, their status, and processing details. You can update order status, process refunds, and access customer information.",
      
      billing: "The billing section handles payment processing, subscription management, and invoice generation. You can view payment history, update payment methods, and manage subscription plans."
    };
    
    // Role-specific additions to fallback explanations
    const roleAdditions = {
      seller: {
        products: " As a seller, you can use this section to manage your product catalog, track inventory levels, and update pricing strategies to maximize sales.",
        orders: " As a seller, you can use this section to track incoming orders, manage fulfillment, and ensure customer satisfaction with timely processing.",
        analytics: " As a seller, you'll find valuable insights about your sales performance, popular products, and customer purchasing patterns to help grow your business."
      },
      buyer: {
        products: " As a buyer, you can browse available products, save favorites to your wishlist, and see detailed product information before making purchase decisions.",
        orders: " As a buyer, you can view your order history, track shipments, and manage returns or exchanges if needed.",
        billing: " As a buyer, you can manage your payment methods, view purchase history, and handle subscription payments from this convenient section."
      },
      franchise: {
        analytics: " As a franchise owner, you'll find location-specific performance metrics, comparison reports with other franchise locations, and actionable insights to improve operations.",
        products: " As a franchise owner, you can manage your location's inventory, ensure compliance with brand standards, and adapt your product mix to local market conditions.",
        dashboard: " As a franchise owner, your dashboard highlights location-specific KPIs, alerts for compliance issues, and performance rankings compared to other franchisees."
      },
      admin: {
        users: " As an administrator, you have full control over user accounts, role assignments, and permission management across the entire platform.",
        settings: " As an administrator, you can configure system-wide settings, customize the platform appearance, and manage integration with third-party services.",
        analytics: " As an administrator, you can access comprehensive reports across all users, identify platform usage patterns, and make data-driven decisions about future development."
      }
    };
    
    // Get base explanation
    let explanation = fallbackExplanations[context] || 
      "This section helps you manage your business more efficiently. Navigate through the available options to access the tools and information you need.";
    
    // Add role-specific information if available
    if (roleAdditions[userRole] && roleAdditions[userRole][context]) {
      explanation += roleAdditions[userRole][context];
    }
    
    return explanation;
  }
};

module.exports = aiExplainController;