/**
 * Contextual Help Routes
 * 
 * API routes for the contextual help system
 */

const express = require('express');
const router = express.Router();
const contextualHelpService = require('../services/contextualHelpService');

/**
 * Get help content for a specific topic
 * @route GET /api/contextual-help
 */
router.get('/', async (req, res) => {
  try {
    const { topic } = req.query;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    // Extract any additional context from the query string
    const contextData = {};
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'topic') {
        contextData[key] = value;
      }
    });
    
    // Get help content for the topic
    const helpContent = await contextualHelpService.getHelpForTopic(topic, contextData);
    
    res.json(helpContent);
  } catch (error) {
    console.error('Error getting contextual help:', error);
    res.status(500).json({ error: 'Failed to get help content' });
  }
});

/**
 * Answer a user question
 * @route POST /api/contextual-help/ask
 */
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // Extract any additional context from the request body
    const contextData = {};
    Object.entries(req.body).forEach(([key, value]) => {
      if (key !== 'question') {
        contextData[key] = value;
      }
    });
    
    // Get answer for the question
    const answer = await contextualHelpService.answerQuestion(question, contextData);
    
    res.json(answer);
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

/**
 * Get popular help topics
 * @route GET /api/contextual-help/popular
 */
router.get('/popular', async (req, res) => {
  try {
    const { limit } = req.query;
    const popularTopics = await contextualHelpService.getPopularHelpTopics(limit || 5);
    
    res.json(popularTopics);
  } catch (error) {
    console.error('Error getting popular topics:', error);
    res.status(500).json({ error: 'Failed to get popular topics' });
  }
});

module.exports = router;