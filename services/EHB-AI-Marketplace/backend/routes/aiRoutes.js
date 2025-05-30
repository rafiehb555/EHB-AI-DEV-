const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Chat with AI (text-based)
router.post(
  '/chat',
  protect,
  aiController.chatWithAI
);

// Transcribe audio and get AI response
router.post(
  '/transcribe',
  protect,
  aiController.transcribeAudioAndRespond
);

// Analyze data with AI
router.post(
  '/analyze',
  protect,
  aiController.analyzeData
);

// Get AI recommendations
router.post(
  '/recommendations',
  protect,
  aiController.getRecommendations
);

// Get domain-specific knowledge
router.get(
  '/knowledge',
  protect,
  aiController.getDomainKnowledge
);

// Get role-specific terminology
router.get(
  '/terminology',
  protect,
  aiController.getRoleTerminology
);

module.exports = router;
