const { OpenAI } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

// Track which AI services are available
const availableServices = {};

// OpenAI Configuration
let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
    availableServices.openai = true;
    console.log('OpenAI client initialized successfully');
  } else {
    console.log('OpenAI API key not found, related services will not be available');
  }
} catch (error) {
  console.error('Error initializing OpenAI client:', error.message);
}

// Anthropic Configuration
let anthropic = null;
try {
  if (process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    availableServices.anthropic = true;
    console.log('Anthropic client initialized successfully');
  } else {
    console.log('Anthropic API key not found, related services will not be available');
  }
} catch (error) {
  console.error('Error initializing Anthropic client:', error.message);
}

// Text-based chat completion with OpenAI
const getOpenAIResponse = async (message, userRole = 'user') => {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    // Create a system message based on user role
    let systemPrompt = 'You are an AI assistant for a business dashboard system.';
    
    switch (userRole) {
      case 'admin':
        systemPrompt = 'You are an AI assistant for system administrators. You can help with user management, system configuration, and technical issues.';
        break;
      case 'seller':
        systemPrompt = 'You are an AI assistant for sellers. You can help with product management, order tracking, inventory, and sales analytics.';
        break;
      case 'buyer':
        systemPrompt = 'You are an AI assistant for buyers. You can help with finding products, tracking orders, and managing purchase history.';
        break;
      case 'franchise':
        systemPrompt = 'You are an AI assistant for franchise owners. You can help with location management, performance metrics, and franchise operations.';
        break;
      default:
        // Default system prompt is used
    }
    
    // Append common capabilities
    systemPrompt += ' Provide concise, helpful responses and actionable insights. Avoid placeholder data or making up information.';

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get AI response. Please try again later.');
  }
};

// Text-based chat completion with Anthropic
const getAnthropicResponse = async (message, userRole = 'user') => {
  if (!anthropic) {
    throw new Error('Anthropic client not initialized');
  }

  try {
    // Create a system message based on user role
    let systemPrompt = 'You are an AI assistant for a business dashboard system.';
    
    switch (userRole) {
      case 'admin':
        systemPrompt = 'You are an AI assistant for system administrators. You can help with user management, system configuration, and technical issues.';
        break;
      case 'seller':
        systemPrompt = 'You are an AI assistant for sellers. You can help with product management, order tracking, inventory, and sales analytics.';
        break;
      case 'buyer':
        systemPrompt = 'You are an AI assistant for buyers. You can help with finding products, tracking orders, and managing purchase history.';
        break;
      case 'franchise':
        systemPrompt = 'You are an AI assistant for franchise owners. You can help with location management, performance metrics, and franchise operations.';
        break;
      default:
        // Default system prompt is used
    }
    
    // Append common capabilities
    systemPrompt += ' Provide concise, helpful responses and actionable insights. Avoid placeholder data or making up information.';

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      system: systemPrompt,
      messages: [
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw new Error('Failed to get AI response. Please try again later.');
  }
};

// Generate analytics insights from data with OpenAI
const generateAnalyticsInsights = async (data, context) => {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    const prompt = `
      Analyze the following business data and provide key insights, trends, and actionable recommendations:
      
      Context: ${context}
      
      Data: ${JSON.stringify(data, null, 2)}
      
      Please format your response as JSON with the following structure:
      {
        "summary": "Brief overview of the analysis",
        "keyInsights": ["Insight 1", "Insight 2", ...],
        "trends": ["Trend 1", "Trend 2", ...],
        "recommendations": ["Recommendation 1", "Recommendation 2", ...]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { role: "system", content: "You are an AI business analyst that provides data-driven insights." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating analytics insights:', error);
    throw new Error('Failed to generate insights. Please try again later.');
  }
};

// Log available services
console.log('Available AI services:', Object.keys(availableServices).join(', ') || 'None');

module.exports = {
  openai,
  anthropic,
  getOpenAIResponse,
  getAnthropicResponse,
  generateAnalyticsInsights,
  availableServices
};