/**
 * Agent Controller
 * 
 * This controller handles API routes for the AI agent functionality,
 * including running agent tasks and managing agent configurations.
 */

const express = require('express');
const router = express.Router();
const { runAgent } = require('../../../agent/index');

// Middleware to validate requests
const validateRequest = (req, res, next) => {
  if (!req.body.input) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Input is required'
    });
  }
  next();
};

/**
 * @route POST /api/agent/run
 * @desc Run an AI agent with the provided input
 * @access Public
 */
router.post('/run', validateRequest, async (req, res) => {
  try {
    const { input } = req.body;
    console.log(`Running agent with input: ${input}`);
    
    const result = await runAgent(input);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Agent execution error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route GET /api/agent/status
 * @desc Get the status of the AI agent
 * @access Public
 */
router.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    version: '1.0.0',
    tools: [
      { name: 'FileReader', description: 'Read file contents' },
      { name: 'FileWriter', description: 'Write content to files' },
      { name: 'ContractAnalyzer', description: 'Analyze smart contracts' },
      { name: 'ComponentGenerator', description: 'Generate React components' }
    ]
  });
});

/**
 * @route POST /api/agent/analyze-contract
 * @desc Analyze a smart contract for security issues
 * @access Public
 */
router.post('/analyze-contract', async (req, res) => {
  try {
    const { contractPath } = req.body;
    
    if (!contractPath) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Contract path is required'
      });
    }
    
    const input = `Analyze the smart contract at ${contractPath} for security vulnerabilities`;
    const result = await runAgent(input);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Contract analysis error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/agent/generate-component
 * @desc Generate a React component
 * @access Public
 */
router.post('/generate-component', async (req, res) => {
  try {
    const { name, description, outputDir } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Component name and description are required'
      });
    }
    
    const input = `Generate a React component with the following details:
      Name: ${name}
      Description: ${description}
      Output Directory: ${outputDir || 'components'}`;
      
    const result = await runAgent(input);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Component generation error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

module.exports = router;