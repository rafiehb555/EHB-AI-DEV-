/**
 * JPS (Job Providing Service) Integration Routes
 * Connects GoSellr with the JPS system for job listings and applications
 */

const express = require('express');
const router = express.Router();
const { pool, emoConnection } = require('../config/database');
const axios = require('axios');

// Default JPS API endpoint (replace with actual endpoint in production)
const JPS_API_URL = process.env.JPS_API_URL || 'http://localhost:5003/api';

// Get all job listings related to e-commerce
router.get('/jobs', async (req, res) => {
  try {
    // In production, make an actual API call to JPS service
    // For now, use mock data
    
    // This would be the actual JPS API call:
    // const response = await axios.get(`${JPS_API_URL}/jobs?category=ecommerce`);
    // const jobs = response.data;
    
    const jobs = [
      {
        id: 1,
        title: 'E-commerce Store Manager',
        company: 'GoSellr Franchise',
        location: 'Remote',
        description: 'Manage online store operations and customer service for a GoSellr franchise.',
        salary: '$45,000 - $60,000',
        posted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: 'Digital Marketing Specialist',
        company: 'GoSellr Corporate',
        location: 'New York, NY',
        description: 'Create and manage marketing campaigns for our e-commerce platform.',
        salary: '$55,000 - $70,000',
        posted_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: 'Inventory Manager',
        company: 'GoSellr Logistics',
        location: 'Chicago, IL',
        description: 'Oversee inventory management for our e-commerce warehouses.',
        salary: '$50,000 - $65,000',
        posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching JPS jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get job details
router.get('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In production, make an actual API call to JPS service
    // For now, use mock data
    
    // This would be the actual JPS API call:
    // const response = await axios.get(`${JPS_API_URL}/jobs/${id}`);
    // const job = response.data;
    
    const jobs = [
      {
        id: 1,
        title: 'E-commerce Store Manager',
        company: 'GoSellr Franchise',
        location: 'Remote',
        description: 'Manage online store operations and customer service for a GoSellr franchise.',
        requirements: [
          'At least 2 years of e-commerce experience',
          'Customer service background',
          'Proficiency with digital marketing tools',
          'Experience with inventory management'
        ],
        benefits: [
          'Flexible work hours',
          'Health insurance',
          'Paid time off',
          'Employee discount'
        ],
        salary: '$45,000 - $60,000',
        job_type: 'Full-time',
        posted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: 'Digital Marketing Specialist',
        company: 'GoSellr Corporate',
        location: 'New York, NY',
        description: 'Create and manage marketing campaigns for our e-commerce platform.',
        requirements: [
          'Bachelor\'s degree in Marketing or related field',
          'Experience with social media marketing',
          'Knowledge of SEO/SEM',
          'Analytical skills for campaign measurement'
        ],
        benefits: [
          'Competitive salary',
          'Comprehensive benefits package',
          'Career advancement opportunities',
          'Collaborative work environment'
        ],
        salary: '$55,000 - $70,000',
        job_type: 'Full-time',
        posted_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: 'Inventory Manager',
        company: 'GoSellr Logistics',
        location: 'Chicago, IL',
        description: 'Oversee inventory management for our e-commerce warehouses.',
        requirements: [
          'Experience with inventory management systems',
          'Strong organizational skills',
          'Attention to detail',
          'Supply chain knowledge'
        ],
        benefits: [
          'Competitive salary',
          'Health and dental insurance',
          '401(k) matching',
          'Professional development opportunities'
        ],
        salary: '$50,000 - $65,000',
        job_type: 'Full-time',
        posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    const job = jobs.find(j => j.id === parseInt(id));
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Error fetching JPS job details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit job application
router.post('/jobs/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, resume, cover_letter } = req.body;
    
    // Get user data
    const userResult = await pool.query(
      'SELECT username, email FROM users WHERE id = $1',
      [user_id]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // In production, make an actual API call to JPS service
    // For now, simulate successful application
    
    // This would be the actual JPS API call:
    // const response = await axios.post(`${JPS_API_URL}/jobs/${id}/applications`, {
    //   applicant_name: user.username,
    //   applicant_email: user.email,
    //   resume,
    //   cover_letter
    // });
    
    // Connect to EMO for marketing opportunities
    emoConnection.connect();
    
    // Store the application in our database
    const result = await pool.query(
      'INSERT INTO job_applications (user_id, job_id, resume, cover_letter, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, id, resume, cover_letter, 'submitted']
    );
    
    res.status(201).json({
      message: 'Application submitted successfully',
      application_id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error submitting job application:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's job applications
router.get('/users/:userId/applications', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM job_applications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    // In production, enrich this data with JPS API data
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user job applications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Post a job listing (for franchise owners)
router.post('/jobs', async (req, res) => {
  try {
    const { 
      title, 
      company, 
      location, 
      description, 
      requirements, 
      benefits, 
      salary, 
      job_type, 
      franchise_id 
    } = req.body;
    
    // Check if franchise exists and is active
    if (franchise_id) {
      const franchiseCheck = await pool.query(
        'SELECT * FROM franchises WHERE id = $1 AND status = $2',
        [franchise_id, 'active']
      );
      
      if (franchiseCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Invalid or inactive franchise' });
      }
    }
    
    // In production, make an actual API call to JPS service
    // For now, simulate successful posting
    
    // This would be the actual JPS API call:
    // const response = await axios.post(`${JPS_API_URL}/jobs`, {
    //   title,
    //   company,
    //   location,
    //   description,
    //   requirements,
    //   benefits,
    //   salary,
    //   job_type,
    //   franchise_id
    // });
    
    res.status(201).json({
      message: 'Job posted successfully',
      job_id: Math.floor(Math.random() * 1000) + 100, // Mock ID
      posted_date: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;