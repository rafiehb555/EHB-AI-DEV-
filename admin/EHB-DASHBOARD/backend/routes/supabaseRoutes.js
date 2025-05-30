/**
 * Supabase Integration Routes
 * 
 * This file defines the API endpoints for Supabase integration in the EHB Dashboard.
 */

const express = require('express');
const router = express.Router();
const supabaseService = require('../services/supabaseService');

/**
 * @route GET /api/supabase/status
 * @desc Get Supabase connection status
 * @access Private
 */
router.get('/status', async (req, res) => {
  try {
    const status = await supabaseService.testConnection();
    return res.json(status);
  } catch (error) {
    console.error('Supabase status route error:', error);
    return res.status(500).json({ 
      connected: false, 
      error: 'Internal server error checking Supabase connection' 
    });
  }
});

/**
 * @route GET /api/supabase/data/:table
 * @desc Get data from a Supabase table
 * @access Private
 */
router.get('/data/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const options = {
      select: req.query.select,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
    };
    
    // Parse where conditions if present
    if (req.query.where) {
      try {
        options.where = JSON.parse(req.query.where);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid where parameter format' });
      }
    }
    
    // Parse order if present
    if (req.query.order) {
      try {
        options.order = JSON.parse(req.query.order);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid order parameter format' });
      }
    }
    
    const { data, error } = await supabaseService.getData(table, options);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.json({ data });
  } catch (error) {
    console.error('Supabase getData route error:', error);
    return res.status(500).json({ error: 'Internal server error fetching data' });
  }
});

/**
 * @route POST /api/supabase/data/:table
 * @desc Insert data into a Supabase table
 * @access Private
 */
router.post('/data/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { data: insertData, options } = req.body;
    
    if (!insertData) {
      return res.status(400).json({ error: 'No data provided for insertion' });
    }
    
    const { data, error } = await supabaseService.insertData(table, insertData, options || {});
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.json({ data });
  } catch (error) {
    console.error('Supabase insertData route error:', error);
    return res.status(500).json({ error: 'Internal server error inserting data' });
  }
});

/**
 * @route PUT /api/supabase/data/:table
 * @desc Update data in a Supabase table
 * @access Private
 */
router.put('/data/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { data: updateData, match, options } = req.body;
    
    if (!updateData) {
      return res.status(400).json({ error: 'No data provided for update' });
    }
    
    if (!match) {
      return res.status(400).json({ error: 'No match criteria provided for update' });
    }
    
    const { data, error } = await supabaseService.updateData(table, updateData, match, options || {});
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.json({ data });
  } catch (error) {
    console.error('Supabase updateData route error:', error);
    return res.status(500).json({ error: 'Internal server error updating data' });
  }
});

/**
 * @route DELETE /api/supabase/data/:table
 * @desc Delete data from a Supabase table
 * @access Private
 */
router.delete('/data/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { match, options } = req.body;
    
    if (!match) {
      return res.status(400).json({ error: 'No match criteria provided for deletion' });
    }
    
    const { data, error } = await supabaseService.deleteData(table, match, options || {});
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.json({ data });
  } catch (error) {
    console.error('Supabase deleteData route error:', error);
    return res.status(500).json({ error: 'Internal server error deleting data' });
  }
});

/**
 * @route POST /api/supabase/storage/:bucket/:filename
 * @desc Upload a file to Supabase storage
 * @access Private
 */
router.post('/storage/:bucket/:filename', async (req, res) => {
  try {
    const { bucket, filename } = req.params;
    const file = req.files?.file;
    const options = req.body.options || {};
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided for upload' });
    }
    
    const { data, error } = await supabaseService.storage.upload(
      bucket, 
      filename, 
      file.data, 
      {
        contentType: file.mimetype,
        ...options
      }
    );
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.json({ data });
  } catch (error) {
    console.error('Supabase storage upload route error:', error);
    return res.status(500).json({ error: 'Internal server error uploading file' });
  }
});

/**
 * @route GET /api/supabase/storage/:bucket/:filename
 * @desc Get a file's public URL from Supabase storage
 * @access Private
 */
router.get('/storage/:bucket/:filename', (req, res) => {
  try {
    const { bucket, filename } = req.params;
    const publicUrl = supabaseService.storage.getPublicUrl(bucket, filename);
    
    return res.json({ url: publicUrl });
  } catch (error) {
    console.error('Supabase storage getUrl route error:', error);
    return res.status(500).json({ error: 'Internal server error getting file URL' });
  }
});

/**
 * @route DELETE /api/supabase/storage/:bucket/:filename
 * @desc Delete a file from Supabase storage
 * @access Private
 */
router.delete('/storage/:bucket/:filename', async (req, res) => {
  try {
    const { bucket, filename } = req.params;
    
    const { data, error } = await supabaseService.storage.delete(bucket, filename);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Supabase storage delete route error:', error);
    return res.status(500).json({ error: 'Internal server error deleting file' });
  }
});

/**
 * @route GET /api/supabase/storage/:bucket/list
 * @desc List files in a Supabase storage bucket/folder
 * @access Private
 */
router.get('/storage/:bucket/list', async (req, res) => {
  try {
    const { bucket, folder } = req.params;
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
      sortBy: req.query.sortBy,
    };
    
    const { data, error } = await supabaseService.storage.list(bucket, folder || '', options);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.json({ data });
  } catch (error) {
    console.error('Supabase storage list route error:', error);
    return res.status(500).json({ error: 'Internal server error listing files' });
  }
});

module.exports = router;