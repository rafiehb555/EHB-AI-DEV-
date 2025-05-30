/**
 * Contextual Help Service
 * 
 * This service provides AI-powered contextual help for different topics in the system,
 * using OpenAI to generate helpful explanations based on the user's context.
 */

const OpenAI = require('openai');
const pool = require('../db/db');
const { v4: uuidv4 } = require('uuid');

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Contextual Help Service
 */
class ContextualHelpService {
  /**
   * Get help content for a specific topic
   * @param {string} topic - The topic to generate help for
   * @param {Object} contextData - Additional context data
   * @returns {Promise<Object>} - The generated help content
   */
  async getHelpForTopic(topic, contextData = {}) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY is not set, using fallback help content');
        return this.getFallbackHelpContent(topic);
      }

      // Generate contextual help using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: this.buildHelpPrompt(topic, contextData) }],
        max_tokens: 500,
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      // Parse the response
      const response = JSON.parse(completion.choices[0].message.content);
      
      // Log the help request for analytics
      await this.logHelpRequest(topic, response);
      
      return response;
    } catch (error) {
      console.error('Error generating help content:', error);
      return this.getFallbackHelpContent(topic);
    }
  }

  /**
   * Answer a custom question from the user
   * @param {string} question - The question to answer
   * @param {Object} contextData - Additional context data
   * @returns {Promise<Object>} - The generated answer
   */
  async answerQuestion(question, contextData = {}) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY is not set, using fallback answer');
        return this.getFallbackAnswer(question);
      }
      
      // Generate answer using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: this.buildQuestionPrompt(question, contextData) }],
        max_tokens: 750,
        temperature: 0.7,
        response_format: { type: "json_object" },
      });
      
      // Parse the response
      const response = JSON.parse(completion.choices[0].message.content);
      
      // Log the question for analytics
      await this.logHelpQuestion(question, response);
      
      return response;
    } catch (error) {
      console.error('Error answering question:', error);
      return this.getFallbackAnswer(question);
    }
  }
  
  /**
   * Build the prompt for generating contextual help
   * @param {string} topic - The topic to generate help for
   * @param {Object} contextData - Additional context data
   * @returns {string} - The prompt for OpenAI
   */
  buildHelpPrompt(topic, contextData) {
    return `Generate concise, helpful information about "${topic}" in the context of an enterprise blockchain system.

The user is currently using a feature related to this topic and needs a quick explanation.

Include the following sections in your response:
1. A brief explanation of what "${topic}" is
2. Why it's important in the system
3. How to use it effectively
4. Common mistakes to avoid
5. Related features or concepts the user might want to explore

Consider the following domain-specific knowledge for blockchain systems:
- Wallet Security: Involves hierarchical deterministic architectures, seed phrase management, private key protection, and multi-signature approaches
- Smart Contracts: Self-executing code on blockchain, requiring thorough security audits, optimization for gas efficiency, and adherence to established design patterns
- Blockchain Basics: Distributed ledger technology with decentralization, consensus mechanisms, and immutable record-keeping properties
- Tokenomics: Economic design principles for cryptocurrency systems including utility models, governance structures, and supply management
- Blockchain Security: Protection mechanisms including role-based access, time locks for sensitive operations, and transaction monitoring systems

Additional context: ${JSON.stringify(contextData)}

Return the response as a JSON object with the following structure:
{
  "title": "A clear, concise title for this help content",
  "description": "A brief overview of the topic",
  "sections": [
    {
      "heading": "What is ${topic}?",
      "content": "Explanation..."
    },
    {
      "heading": "Why it's important",
      "content": "Explanation..."
    },
    {
      "heading": "How to use it",
      "content": "Explanation with tips..."
    },
    {
      "heading": "Common pitfalls",
      "content": "Mistakes to avoid..."
    },
    {
      "heading": "Related concepts",
      "content": "Other features to explore..."
    }
  ],
  "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"],
  "quickLinks": [
    {
      "text": "Learn more about X",
      "url": "#x-documentation"
    },
    {
      "text": "Related feature Y",
      "url": "#y-feature"
    }
  ]
}`;
  }
  
  /**
   * Build the prompt for answering a custom question
   * @param {string} question - The question to answer
   * @param {Object} contextData - Additional context data
   * @returns {string} - The prompt for OpenAI
   */
  buildQuestionPrompt(question, contextData) {
    return `Answer the following question about the EHB Enterprise System:

Question: "${question}"

Additional context: ${JSON.stringify(contextData)}

As you answer, incorporate this specialized knowledge about enterprise blockchain systems:

BLOCKCHAIN & CRYPTOCURRENCY KNOWLEDGE:
- Wallet Types: Standard wallets offer basic account management, Trusty wallets add validator locking mechanisms, and Crypto wallets support ERC20/BEP20 token standards with blockchain validation.
- Security Best Practices: Implement hierarchical deterministic (HD) key derivation, private key isolation, multi-signature authorization, and robust backup mechanisms.
- Blockchain Integration: Supporting multiple blockchain networks requires address format validation, transaction signing methodologies, and cross-chain compatibility considerations.
- Tokenomics: Effective token systems balance utility, distribution mechanisms, governance frameworks, and economic incentives.
- Regulatory Landscape: Consider jurisdiction-specific compliance requirements, KYC/AML policies, and evolving regulatory frameworks.
- Technical Implementation: Wallet implementations should prioritize secure key management, transaction validation, fee optimization, and robust error handling.

Provide a helpful, accurate, and concise answer based on your knowledge of enterprise blockchain systems. Focus on practical information that would be most useful to a user of the system.

Return the response as a JSON object with the following structure:
{
  "question": "The original question",
  "answer": "Your detailed answer...",
  "additionalInfo": "Any additional information that might be helpful",
  "relatedTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "usefulLinks": [
    {
      "text": "Learn more about X",
      "url": "#x-documentation"
    }
  ]
}`;
  }
  
  /**
   * Get fallback help content when AI is unavailable
   * @param {string} topic - The topic to get help for
   * @returns {Object} - Fallback help content
   */
  getFallbackHelpContent(topic) {
    return {
      title: `Help for ${topic}`,
      description: `Information about ${topic} in the EHB Enterprise System.`,
      sections: [
        {
          heading: `What is ${topic}?`,
          content: `${topic} is a feature in the EHB Enterprise System. For more detailed information, please try again later when AI assistance is available.`
        },
        {
          heading: "How to use it",
          content: "Basic usage instructions will be provided when AI assistance is available."
        }
      ],
      tips: ["Try exploring the user interface", "Check the documentation for more information"],
      quickLinks: [
        {
          text: "Documentation",
          url: "#documentation"
        }
      ]
    };
  }
  
  /**
   * Get fallback answer when AI is unavailable
   * @param {string} question - The question asked
   * @returns {Object} - Fallback answer
   */
  getFallbackAnswer(question) {
    return {
      question: question,
      answer: "We're unable to provide an AI-generated answer at this time. Please try again later or consult the documentation for information.",
      additionalInfo: "AI assistance is temporarily unavailable.",
      relatedTopics: ["Documentation", "User Guide", "FAQ"],
      usefulLinks: [
        {
          text: "Documentation",
          url: "#documentation"
        }
      ]
    };
  }
  
  /**
   * Log a help request to the database
   * @param {string} topic - The topic requested
   * @param {Object} response - The response provided
   * @returns {Promise<void>}
   */
  async logHelpRequest(topic, response) {
    try {
      // Create table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS contextual_help_logs (
          id UUID PRIMARY KEY,
          topic VARCHAR(255) NOT NULL,
          response JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      
      // Insert the log
      await pool.query(
        'INSERT INTO contextual_help_logs (id, topic, response) VALUES ($1, $2, $3)',
        [uuidv4(), topic, JSON.stringify(response)]
      );
    } catch (error) {
      console.error('Error logging help request:', error);
    }
  }
  
  /**
   * Log a question to the database
   * @param {string} question - The question asked
   * @param {Object} response - The response provided
   * @returns {Promise<void>}
   */
  async logHelpQuestion(question, response) {
    try {
      // Create table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS help_question_logs (
          id UUID PRIMARY KEY,
          question TEXT NOT NULL,
          response JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      
      // Insert the log
      await pool.query(
        'INSERT INTO help_question_logs (id, question, response) VALUES ($1, $2, $3)',
        [uuidv4(), question, JSON.stringify(response)]
      );
    } catch (error) {
      console.error('Error logging question:', error);
    }
  }
  
  /**
   * Get the most frequently accessed help topics
   * @param {number} limit - The maximum number of topics to return
   * @returns {Promise<Array>} - The most popular topics
   */
  async getPopularHelpTopics(limit = 5) {
    try {
      const result = await pool.query(`
        SELECT topic, COUNT(*) as access_count
        FROM contextual_help_logs
        GROUP BY topic
        ORDER BY access_count DESC
        LIMIT $1
      `, [limit]);
      
      return result.rows;
    } catch (error) {
      console.error('Error getting popular help topics:', error);
      return [];
    }
  }
}

module.exports = new ContextualHelpService();