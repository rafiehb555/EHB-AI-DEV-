/**
 * Onboarding API Routes
 * 
 * Endpoints for the AI-powered onboarding wizard functionality
 */

const express = require('express');
const router = express.Router();
const aiOnboardingService = require('../services/aiOnboardingService');

/**
 * @route   GET /api/onboarding/status/:userId
 * @desc    Check if a user has completed onboarding
 * @access  Private
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const hasCompleted = await aiOnboardingService.hasCompletedOnboarding(userId);
    
    return res.status(200).json({
      completed: hasCompleted
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/onboarding/flow
 * @desc    Generate personalized onboarding flow for a user
 * @access  Private
 */
router.post('/flow', async (req, res) => {
  try {
    const userInfo = req.body;
    
    if (!userInfo || !userInfo.userId) {
      return res.status(400).json({ error: 'User information is required' });
    }
    
    const onboardingFlow = await aiOnboardingService.generateOnboardingFlow(userInfo);
    
    return res.status(200).json({
      steps: onboardingFlow
    });
  } catch (error) {
    console.error('Error generating onboarding flow:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/onboarding/flow/:userId
 * @desc    Get the current onboarding flow for a user
 * @access  Private
 */
router.get('/flow/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const onboardingFlow = await aiOnboardingService.getUserOnboardingFlow(userId);
    
    if (!onboardingFlow) {
      // Generate a new flow if none exists
      const newFlow = await aiOnboardingService.generateOnboardingFlow({ userId });
      return res.status(200).json({
        steps: newFlow,
        isNewFlow: true
      });
    }
    
    return res.status(200).json({
      steps: onboardingFlow,
      isNewFlow: false
    });
  } catch (error) {
    console.error('Error getting onboarding flow:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/onboarding/step/:userId/:stepId
 * @desc    Process user response to an onboarding step
 * @access  Private
 */
router.post('/step/:userId/:stepId', async (req, res) => {
  try {
    const { userId, stepId } = req.params;
    const userResponse = req.body;
    
    if (!userId || !stepId) {
      return res.status(400).json({ error: 'User ID and step ID are required' });
    }
    
    const guidance = await aiOnboardingService.processStepResponse(userId, stepId, userResponse);
    
    return res.status(200).json(guidance);
  } catch (error) {
    console.error('Error processing step response:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/onboarding/complete/:userId
 * @desc    Mark onboarding as completed for a user
 * @access  Private
 */
router.post('/complete/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const success = await aiOnboardingService.completeOnboarding(userId);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to complete onboarding' });
    }
    
    return res.status(200).json({
      completed: true,
      message: 'Onboarding completed successfully'
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/onboarding/generate-demo
 * @desc    Generate a demo onboarding flow for testing
 * @access  Public (for testing only)
 */
router.post('/generate-demo', async (req, res) => {
  try {
    // Demo user info with specific role
    const demoUserInfo = {
      userId: 'demo-user-' + Math.floor(Math.random() * 1000),
      role: req.body.role || 'seller',
      skillLevel: req.body.skillLevel || 'beginner',
      preferences: req.body.preferences || {}
    };
    
    // Generate a new onboarding flow
    const onboardingFlow = await aiOnboardingService.generateOnboardingFlow(demoUserInfo);
    
    return res.status(200).json({
      userId: demoUserInfo.userId,
      steps: onboardingFlow
    });
  } catch (error) {
    console.error('Error generating demo onboarding flow:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;