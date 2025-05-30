/**
 * Components Controller
 * 
 * This controller handles API routes for managing React components,
 * including generating, listing, and modifying components.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { runAgent } = require('../../../agent/index');

/**
 * @route GET /api/components
 * @desc Get a list of all components
 * @access Public
 */
router.get('/', (req, res) => {
  try {
    const componentsDir = path.join(process.cwd(), 'components');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
      return res.json({ components: [] });
    }
    
    // Read the directory
    const files = fs.readdirSync(componentsDir);
    
    // Filter for JSX/TSX files
    const components = files
      .filter(file => file.endsWith('.jsx') || file.endsWith('.tsx'))
      .map(file => {
        const stats = fs.statSync(path.join(componentsDir, file));
        return {
          name: file.replace(/\.(jsx|tsx)$/, ''),
          path: `/components/${file}`,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      });
    
    res.json({ components });
  } catch (error) {
    console.error('Error listing components:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route GET /api/components/:name
 * @desc Get a specific component by name
 * @access Public
 */
router.get('/:name', (req, res) => {
  try {
    const { name } = req.params;
    const componentsDir = path.join(process.cwd(), 'components');
    
    // Try both JSX and TSX extensions
    let filePath;
    if (fs.existsSync(path.join(componentsDir, `${name}.jsx`))) {
      filePath = path.join(componentsDir, `${name}.jsx`);
    } else if (fs.existsSync(path.join(componentsDir, `${name}.tsx`))) {
      filePath = path.join(componentsDir, `${name}.tsx`);
    } else {
      return res.status(404).json({
        error: 'Not Found',
        message: `Component ${name} not found`
      });
    }
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    
    res.json({
      name,
      content,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      extension: path.extname(filePath).slice(1)
    });
  } catch (error) {
    console.error(`Error retrieving component ${req.params.name}:`, error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/components
 * @desc Generate a new component
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, outputDir = 'components' } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Component name and description are required'
      });
    }
    
    // Use the AI agent to generate the component
    const input = JSON.stringify({
      name,
      description,
      outputDir
    });
    
    const result = await runAgent(`Generate a React component using the ComponentGenerator tool with the following specifications: ${input}`);
    
    // Check if the component was created
    const componentsDir = path.join(process.cwd(), outputDir);
    const componentPath = path.join(componentsDir, `${name}.jsx`);
    
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');
      const stats = fs.statSync(componentPath);
      
      res.status(201).json({
        success: true,
        component: {
          name,
          path: `/${outputDir}/${name}.jsx`,
          content,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        },
        message: `Component ${name} created successfully`
      });
    } else {
      res.status(500).json({
        error: 'Component Creation Failed',
        message: 'The component file was not created',
        agentResult: result
      });
    }
  } catch (error) {
    console.error('Error creating component:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route PUT /api/components/:name
 * @desc Update an existing component
 * @access Public
 */
router.put('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Component content is required'
      });
    }
    
    const componentsDir = path.join(process.cwd(), 'components');
    
    // Try both JSX and TSX extensions
    let filePath;
    if (fs.existsSync(path.join(componentsDir, `${name}.jsx`))) {
      filePath = path.join(componentsDir, `${name}.jsx`);
    } else if (fs.existsSync(path.join(componentsDir, `${name}.tsx`))) {
      filePath = path.join(componentsDir, `${name}.tsx`);
    } else {
      return res.status(404).json({
        error: 'Not Found',
        message: `Component ${name} not found`
      });
    }
    
    // Write the updated content
    fs.writeFileSync(filePath, content);
    const stats = fs.statSync(filePath);
    
    res.json({
      success: true,
      component: {
        name,
        path: `/components/${path.basename(filePath)}`,
        content,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      },
      message: `Component ${name} updated successfully`
    });
  } catch (error) {
    console.error(`Error updating component ${req.params.name}:`, error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route DELETE /api/components/:name
 * @desc Delete a component
 * @access Public
 */
router.delete('/:name', (req, res) => {
  try {
    const { name } = req.params;
    const componentsDir = path.join(process.cwd(), 'components');
    
    // Try both JSX and TSX extensions
    let filePath;
    if (fs.existsSync(path.join(componentsDir, `${name}.jsx`))) {
      filePath = path.join(componentsDir, `${name}.jsx`);
    } else if (fs.existsSync(path.join(componentsDir, `${name}.tsx`))) {
      filePath = path.join(componentsDir, `${name}.tsx`);
    } else {
      return res.status(404).json({
        error: 'Not Found',
        message: `Component ${name} not found`
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: `Component ${name} deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting component ${req.params.name}:`, error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

module.exports = router;