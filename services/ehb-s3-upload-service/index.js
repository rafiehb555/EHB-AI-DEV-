/**
 * EHB S3 Upload Service
 * 
 * This service provides S3 file upload capabilities for the EHB platform.
 * It handles file uploads to AWS S3 and returns public URLs for uploaded files.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();
const app = express();
const PORT = process.env.S3_SERVICE_PORT || 5400;

// Set up multer for file uploads
const upload = multer({
  dest: 'temp-uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  }
});

// Configure middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'online',
    service: 'EHB S3 Upload Service',
    timestamp: new Date().toISOString(),
    port: PORT,
    aws: {
      configured: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
      bucket: process.env.S3_BUCKET_NAME || 'not configured',
      region: process.env.AWS_REGION || 'us-east-1'
    }
  };
  
  res.json(health);
});

// Simple port-check endpoint for workflow system 
app.get('/portcheck', (req, res) => {
  res.status(200).send(`Port ${PORT} is active on the S3 Upload Service`);
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Check if AWS credentials are configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
    return res.status(503).json({ 
      success: false, 
      message: 'AWS S3 not configured',
      missingConfig: {
        accessKeyId: !process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: !process.env.AWS_SECRET_ACCESS_KEY,
        bucketName: !process.env.S3_BUCKET_NAME
      }
    });
  }

  try {
    const fileContent = fs.readFileSync(req.file.path);
    
    // Generate a unique file key using timestamp and original name
    const timestamp = Date.now();
    const originalName = req.file.originalname;
    const fileKey = `uploads/${timestamp}-${originalName}`;
    
    // Set up S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: fileContent,
      ContentType: req.file.mimetype
      // ACL parameter removed - bucket doesn't support ACLs
    };
    
    // Upload to S3
    const uploadResult = await s3.upload(params).promise();
    
    // Clean up the temporary file
    fs.unlinkSync(req.file.path);
    
    // Generate a presigned URL for access (expires in 1 hour)
    const presignedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Expires: 3600 // 1 hour
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        originalName: req.file.originalname,
        fileKey: fileKey,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: uploadResult.Location,
        presignedUrl: presignedUrl, // Add presigned URL for access
        expiresIn: '1 hour'
      }
    });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    
    // Try to clean up the temporary file if it exists
    try {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up temporary file:', cleanupError);
    }
    
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error uploading file to S3',
      error: error.message,
      awsError: {
        code: error.code,
        statusCode: error.statusCode,
        requestId: error.requestId
      }
    });
  }
});

// List files endpoint
app.get('/api/files', async (req, res) => {
  // Check if AWS credentials are configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
    return res.status(503).json({ 
      success: false, 
      message: 'AWS S3 not configured',
      missingConfig: {
        accessKeyId: !process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: !process.env.AWS_SECRET_ACCESS_KEY,
        bucketName: !process.env.S3_BUCKET_NAME
      }
    });
  }

  try {
    const prefix = req.query.prefix || 'uploads/';
    const maxKeys = parseInt(req.query.limit) || 100;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: maxKeys
    };
    
    const data = await s3.listObjectsV2(params).promise();
    
    const files = data.Contents.map(item => {
      // Create a pre-signed URL for each file that expires in 1 hour
      const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: item.Key,
        Expires: 3600 // URL expires in 1 hour
      });
      
      return {
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
        url: signedUrl,
        // Generate a public URL as well
        publicUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${item.Key}`
      };
    });
    
    res.status(200).json({
      success: true,
      files: files,
      count: files.length,
      isTruncated: data.IsTruncated,
      prefix: prefix
    });
  } catch (error) {
    console.error('Error listing files from S3:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error listing files from S3',
      error: error.message,
      awsError: {
        code: error.code,
        statusCode: error.statusCode,
        requestId: error.requestId
      }
    });
  }
});

// Delete file endpoint
app.delete('/api/files/:key', async (req, res) => {
  // Check if AWS credentials are configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
    return res.status(503).json({ 
      success: false, 
      message: 'AWS S3 not configured',
      missingConfig: {
        accessKeyId: !process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: !process.env.AWS_SECRET_ACCESS_KEY,
        bucketName: !process.env.S3_BUCKET_NAME
      }
    });
  }

  try {
    const key = req.params.key;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };
    
    await s3.deleteObject(params).promise();
    
    res.status(200).json({
      success: true,
      message: `File ${key} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error deleting file from S3',
      error: error.message,
      awsError: {
        code: error.code,
        statusCode: error.statusCode,
        requestId: error.requestId
      }
    });
  }
});

// Create a test file endpoint for checking S3 upload functionality
app.post('/api/test-upload', async (req, res) => {
  // Check if AWS credentials are configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
    return res.status(503).json({ 
      success: false, 
      message: 'AWS S3 not configured',
      missingConfig: {
        accessKeyId: !process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: !process.env.AWS_SECRET_ACCESS_KEY,
        bucketName: !process.env.S3_BUCKET_NAME
      }
    });
  }

  try {
    // Create a test file with timestamp
    const timestamp = new Date().toISOString();
    const testFileName = `test-upload-${Date.now()}.txt`;
    const testFilePath = path.join('temp-uploads', testFileName);
    
    // Ensure the temp-uploads directory exists
    if (!fs.existsSync('temp-uploads')) {
      fs.mkdirSync('temp-uploads', { recursive: true });
    }
    
    // Write test content to file
    const testContent = `This is a test file created at ${timestamp} to verify S3 upload functionality.`;
    fs.writeFileSync(testFilePath, testContent);
    
    // Set up S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `test/${testFileName}`,
      Body: fs.createReadStream(testFilePath),
      ContentType: 'text/plain'
      // ACL parameter removed - bucket doesn't support ACLs
    };
    
    // Upload to S3
    const uploadResult = await s3.upload(params).promise();
    
    // Clean up the temporary file
    fs.unlinkSync(testFilePath);
    
    // Generate a presigned URL for access (expires in 1 hour)
    const presignedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `test/${testFileName}`,
      Expires: 3600 // 1 hour
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Test file uploaded successfully',
      file: {
        fileName: testFileName,
        fileKey: `test/${testFileName}`,
        content: testContent,
        url: uploadResult.Location,
        presignedUrl: presignedUrl, // Add presigned URL for access
        expiresIn: '1 hour'
      }
    });
  } catch (error) {
    console.error('Error uploading test file to S3:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error uploading test file to S3',
      error: error.message,
      awsError: {
        code: error.code,
        statusCode: error.statusCode,
        requestId: error.requestId
      }
    });
  }
});

// Add a ready flag to help with startup detection
let serverReady = false;

// Start the server - using a more robust 2-step approach for better port detection
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`==================================================`);
  console.log(`EHB S3 Upload Service starting on port ${PORT}`);
  console.log(`==================================================`);
  
  // Log AWS configuration status
  const awsConfigured = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.S3_BUCKET_NAME);
  
  if (awsConfigured) {
    console.log('✅ AWS S3 configured:');
    console.log(`   Bucket: ${process.env.S3_BUCKET_NAME}`);
    console.log(`   Region: ${process.env.AWS_REGION || 'us-east-1'}`);
  } else {
    console.warn('⚠️ AWS S3 not fully configured:');
    console.warn(`   Access Key ID: ${process.env.AWS_ACCESS_KEY_ID ? 'Present' : 'Missing'}`);
    console.warn(`   Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? 'Present' : 'Missing'}`);
    console.warn(`   Bucket Name: ${process.env.S3_BUCKET_NAME || 'Missing'}`);
    console.warn(`   Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET_NAME environment variables`);
  }
  
  // Log server address info for debugging
  const addressInfo = server.address();
  console.log(`Server listening: ${JSON.stringify(addressInfo)}`);
  
  // Wait a brief moment to ensure services are fully initialized
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Now mark the server as fully ready
  serverReady = true;
  
  // Make these logs very visible for the workflow system
  console.log(`==================================================`);
  console.log(`⭐⭐⭐ EHB S3 UPLOAD SERVICE READY ⭐⭐⭐`);
  console.log(`API URL: http://0.0.0.0:${PORT}/api`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`Port ${PORT} is now open and accessible`);
  console.log(`==================================================`);
  console.log(`S3 Upload Service is ready to accept connections!`);
  console.log(`==================================================`);
});

// Handle health check with server ready status for better workflow detection
app.get('/ping', (req, res) => {
  if (serverReady) {
    res.status(200).send('PONG');
  } else {
    res.status(503).send('Server still starting');
  }
});