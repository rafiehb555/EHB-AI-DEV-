/**
 * AI Onboarding Service
 * 
 * This service provides AI-powered onboarding functionality for new users,
 * including personalized recommendations, contextual help,
 * and dynamic onboarding flow based on user responses.
 */

const OpenAI = require('openai');
const pool = require('../db/db');
const { v4: uuidv4 } = require('uuid');

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AI Onboarding Service
 */
class AIOnboardingService {
  /**
   * Generate personalized onboarding steps based on user information
   * @param {Object} userInfo - User information including preferences and role
   * @returns {Promise<Array>} - List of personalized onboarding steps
   */
  async generateOnboardingFlow(userInfo) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY is not set, using fallback onboarding flow');
        return this.getFallbackOnboardingFlow(userInfo);
      }

      const userRole = userInfo.role || 'general';
      const userPreferences = userInfo.preferences || {};
      const userSkillLevel = userInfo.skillLevel || 'beginner';

      // Generate dynamic onboarding flow using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: this.buildOnboardingPrompt(userInfo) }],
        max_tokens: 1000,
        temperature: 0.5,
        response_format: { type: "json_object" },
      });

      // Parse the response
      const response = JSON.parse(completion.choices[0].message.content);
      const steps = response.onboardingSteps;

      // Save the generated flow in the database for reference
      await this.saveOnboardingFlow(userInfo.userId, steps);

      return steps;
    } catch (error) {
      console.error('Error generating onboarding flow:', error);
      // Return fallback flow in case of API errors
      return this.getFallbackOnboardingFlow(userInfo);
    }
  }

  /**
   * Build the prompt for OpenAI to generate the onboarding flow
   * @param {Object} userInfo - User information
   * @returns {String} - Formatted prompt
   */
  buildOnboardingPrompt(userInfo) {
    const { role, preferences, skillLevel } = userInfo;
    
    return `Create a personalized onboarding flow for a new user of the EHB Enterprise System.
    
User Information:
- Role: ${role || 'general'}
- Skill Level: ${skillLevel || 'beginner'}
- Preferences: ${JSON.stringify(preferences || {})}

Design an onboarding flow with 5-7 steps that introduces the system's features most relevant to this type of user.
Each step should have a title, description, associated UI component, and any action the user needs to take.

Return the response as a JSON object with the following structure:
{
  "onboardingSteps": [
    {
      "id": "step1",
      "title": "Step title",
      "description": "Detailed description of this step",
      "component": "ComponentName",
      "action": "Action to take or null if no action required",
      "importance": "high/medium/low",
      "recommendedTimeSpent": "1-2 minutes"
    }
  ]
}`;
  }

  /**
   * Process user response to an onboarding step and provide guidance
   * @param {String} userId - User ID
   * @param {String} stepId - Current step ID
   * @param {Object} response - User's response to the current step
   * @returns {Promise<Object>} - AI-powered guidance for the next step
   */
  async processStepResponse(userId, stepId, response) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return {
          guidance: "Continue to the next step of the onboarding process.",
          nextStepId: null
        };
      }

      // Get the current onboarding flow for the user
      const userFlow = await this.getUserOnboardingFlow(userId);
      if (!userFlow || !userFlow.length) {
        throw new Error('Onboarding flow not found for user');
      }

      // Find current step
      const currentStep = userFlow.find(step => step.id === stepId);
      if (!currentStep) {
        throw new Error('Step not found in onboarding flow');
      }

      // Use OpenAI to analyze the user's response and provide guidance
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: this.buildStepResponsePrompt(currentStep, response, userFlow) }],
        max_tokens: 500,
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      // Parse the response
      const aiResponse = JSON.parse(completion.choices[0].message.content);
      
      // Log the interaction
      await this.logOnboardingInteraction(userId, stepId, response, aiResponse);

      return {
        guidance: aiResponse.guidance,
        nextStepId: aiResponse.nextStepId,
        additionalInfo: aiResponse.additionalInfo || null
      };
    } catch (error) {
      console.error('Error processing step response:', error);
      return {
        guidance: "I couldn't analyze your response, but feel free to continue with the onboarding process.",
        nextStepId: null
      };
    }
  }

  /**
   * Build the prompt for OpenAI to analyze user response to a step
   * @param {Object} currentStep - Current onboarding step
   * @param {Object} userResponse - User's response
   * @param {Array} fullFlow - Complete onboarding flow
   * @returns {String} - Formatted prompt
   */
  buildStepResponsePrompt(currentStep, userResponse, fullFlow) {
    return `Analyze the user's response to the current onboarding step and provide guidance.

Current Step:
${JSON.stringify(currentStep)}

User Response:
${JSON.stringify(userResponse)}

Full Onboarding Flow:
${JSON.stringify(fullFlow)}

Based on the user's response, provide guidance on how to proceed.
Return your response as a JSON object with the following structure:
{
  "guidance": "Clear guidance based on the user's response",
  "nextStepId": "ID of the next recommended step or null for default progression",
  "additionalInfo": "Any additional information that might be helpful (optional)"
}`;
  }

  /**
   * Get a fallback onboarding flow when AI is unavailable
   * @param {Object} userInfo - User information
   * @returns {Array} - Default onboarding steps
   */
  getFallbackOnboardingFlow(userInfo) {
    const role = userInfo.role || 'general';
    let steps = [];

    // Base steps for all users
    const baseSteps = [
      {
        id: "welcome",
        title: "Welcome to EHB Enterprise System",
        description: "We're excited to have you on board! This wizard will guide you through the key features of our platform.",
        component: "WelcomeScreen",
        action: null,
        importance: "high",
        recommendedTimeSpent: "1 minute"
      },
      {
        id: "profile",
        title: "Complete Your Profile",
        description: "Take a moment to set up your profile so we can customize your experience.",
        component: "ProfileSetup",
        action: "updateProfile",
        importance: "high",
        recommendedTimeSpent: "2-3 minutes"
      },
      {
        id: "dashboard",
        title: "Explore Your Dashboard",
        description: "Your dashboard is the command center of the EHB system. Let's explore what you can do here.",
        component: "DashboardTour",
        action: null,
        importance: "high",
        recommendedTimeSpent: "2 minutes"
      },
      {
        id: "notifications",
        title: "Notification Settings",
        description: "Configure how and when you want to receive notifications from the system.",
        component: "NotificationSettings",
        action: "updateNotificationPreferences",
        importance: "medium",
        recommendedTimeSpent: "1-2 minutes"
      },
      {
        id: "completion",
        title: "Onboarding Complete!",
        description: "Congratulations! You're now ready to use the EHB Enterprise System. Let's get started.",
        component: "OnboardingCompletion",
        action: "finishOnboarding",
        importance: "high",
        recommendedTimeSpent: "1 minute"
      }
    ];
    
    steps = [...baseSteps];
    
    // Add role-specific steps
    if (role === 'seller') {
      steps.splice(3, 0, {
        id: "product_management",
        title: "Manage Your Products",
        description: "Learn how to add, edit, and manage your product catalog effectively.",
        component: "ProductManagementTutorial",
        action: null,
        importance: "high",
        recommendedTimeSpent: "3-4 minutes"
      });
    } else if (role === 'franchise') {
      steps.splice(3, 0, {
        id: "zone_management",
        title: "Zone Management",
        description: "Understand how to monitor and manage performance across your franchise zones.",
        component: "ZoneManagementTutorial",
        action: null,
        importance: "high",
        recommendedTimeSpent: "3-4 minutes"
      });
    } else if (role === 'admin') {
      steps.splice(3, 0, {
        id: "admin_controls",
        title: "Administrative Controls",
        description: "Explore the powerful administrative features available to you.",
        component: "AdminControlsTutorial",
        action: null,
        importance: "high",
        recommendedTimeSpent: "4-5 minutes"
      });
    }
    
    return steps;
  }

  /**
   * Save the generated onboarding flow in the database
   * @param {String} userId - User ID
   * @param {Array} steps - Onboarding steps
   * @returns {Promise<void>}
   */
  async saveOnboardingFlow(userId, steps) {
    try {
      // Check if table exists, create if it doesn't
      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_onboarding_flows (
          id UUID PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          flow_data JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      
      // Delete any existing flow for this user
      await pool.query(
        'DELETE FROM user_onboarding_flows WHERE user_id = $1',
        [userId]
      );
      
      // Insert the new flow
      await pool.query(
        'INSERT INTO user_onboarding_flows (id, user_id, flow_data) VALUES ($1, $2, $3)',
        [uuidv4(), userId, JSON.stringify(steps)]
      );
    } catch (error) {
      console.error('Error saving onboarding flow:', error);
    }
  }

  /**
   * Get the onboarding flow for a user
   * @param {String} userId - User ID
   * @returns {Promise<Array>} - Onboarding steps
   */
  async getUserOnboardingFlow(userId) {
    try {
      const result = await pool.query(
        'SELECT flow_data FROM user_onboarding_flows WHERE user_id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0].flow_data;
    } catch (error) {
      console.error('Error getting onboarding flow:', error);
      return null;
    }
  }

  /**
   * Log an onboarding interaction
   * @param {String} userId - User ID
   * @param {String} stepId - Step ID
   * @param {Object} userResponse - User's response
   * @param {Object} aiResponse - AI's response
   * @returns {Promise<void>}
   */
  async logOnboardingInteraction(userId, stepId, userResponse, aiResponse) {
    try {
      // Check if table exists, create if it doesn't
      await pool.query(`
        CREATE TABLE IF NOT EXISTS onboarding_interactions (
          id UUID PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          step_id VARCHAR(255) NOT NULL,
          user_response JSONB NOT NULL,
          ai_response JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      
      // Insert the interaction
      await pool.query(
        'INSERT INTO onboarding_interactions (id, user_id, step_id, user_response, ai_response) VALUES ($1, $2, $3, $4, $5)',
        [uuidv4(), userId, stepId, JSON.stringify(userResponse), JSON.stringify(aiResponse)]
      );
    } catch (error) {
      console.error('Error logging onboarding interaction:', error);
    }
  }

  /**
   * Mark the onboarding process as completed for a user
   * @param {String} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  async completeOnboarding(userId) {
    try {
      // Check if table exists, create if it doesn't
      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_onboarding_status (
          user_id VARCHAR(255) PRIMARY KEY,
          completed BOOLEAN NOT NULL DEFAULT TRUE,
          completed_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      
      // Insert or update the status
      await pool.query(
        `INSERT INTO user_onboarding_status (user_id, completed, completed_at) 
         VALUES ($1, TRUE, NOW())
         ON CONFLICT (user_id) 
         DO UPDATE SET completed = TRUE, completed_at = NOW()`,
        [userId]
      );
      
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }

  /**
   * Check if a user has completed onboarding
   * @param {String} userId - User ID
   * @returns {Promise<boolean>} - Completion status
   */
  async hasCompletedOnboarding(userId) {
    try {
      const result = await pool.query(
        'SELECT completed FROM user_onboarding_status WHERE user_id = $1',
        [userId]
      );
      
      return result.rows.length > 0 && result.rows[0].completed;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }
}

module.exports = new AIOnboardingService();