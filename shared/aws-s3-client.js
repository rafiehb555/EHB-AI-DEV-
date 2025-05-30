/**
 * EHB Shared AWS S3 Client
 * 
 * This module provides a centralized AWS S3 client that can be used
 * across different services in the EHB ecosystem. It handles initialization,
 * file uploads, downloads, and basic bucket operations.
 * 
 * @version 1.0.0
 * @date 2025-05-13
 */

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Configuration
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const DEBUG = process.env.NODE_ENV !== 'production';

// Convert fs methods to Promise-based
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Singleton instance
let s3Instance = null;

/**
 * Get or initialize the AWS S3 client
 * @returns {Object} The AWS S3 client instance
 */
function getClient() {
  if (!s3Instance) {
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      console.warn('Missing AWS credentials. Create client with dummy values to prevent crashes.');
      // Create a non-functional client to prevent crashes
      s3Instance = {
        upload: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
        getObject: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
        listObjects: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
        deleteObject: async () => ({ error: { message: 'Not configured', code: 'NOT_CONFIGURED' } }),
        _isConnected: false,
      };
      return s3Instance;
    }

    try {
      // Configure AWS SDK
      AWS.config.update({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region: AWS_REGION
      });
      
      // Create S3 instance
      s3Instance = new AWS.S3();
      console.log('AWS S3 client initialized successfully');
    } catch (error) {
      console.error('Error initializing AWS S3 client:', error);
      throw error;
    }
  }
  
  return s3Instance;
}

/**
 * Test the AWS S3 connection
 * @returns {Promise<Object>} Connection test results
 */
async function testConnection() {
  try {
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      return {
        connected: false,
        error: 'Missing AWS credentials',
        details: 'Please configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables'
      };
    }

    const s3 = getClient();
    
    // Try to list buckets (lightweight test)
    const data = await s3.listBuckets().promise();
    
    return {
      connected: true,
      buckets: data.Buckets.map(bucket => bucket.Name),
      owner: data.Owner.DisplayName || data.Owner.ID,
    };
  } catch (error) {
    console.error('Error testing AWS S3 connection:', error);
    return {
      connected: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Connection error'
    };
  }
}

/**
 * Upload a file to S3
 * @param {Object} options Upload options
 * @param {string} options.bucket Bucket name (optional if AWS_S3_BUCKET is set)
 * @param {string} options.key Object key (path in S3)
 * @param {string|Buffer|Stream} options.body File content
 * @param {string} options.contentType Content type
 * @returns {Promise<Object>} Upload result
 */
async function uploadFile(options) {
  try {
    const { 
      bucket = AWS_S3_BUCKET, 
      key, 
      body, 
      contentType = 'application/octet-stream',
      acl = 'private',
      metadata = {} 
    } = options;
    
    if (!bucket) {
      throw new Error('Bucket name is required. Set AWS_S3_BUCKET or provide bucket option.');
    }
    
    if (!key) {
      throw new Error('Object key is required');
    }
    
    if (!body) {
      throw new Error('File content is required');
    }
    
    const s3 = getClient();
    
    const params = {
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: acl,
      Metadata: metadata
    };
    
    const result = await s3.upload(params).promise();
    
    return {
      success: true,
      location: result.Location,
      bucket: result.Bucket,
      key: result.Key,
      etag: result.ETag,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Upload error'
    };
  }
}

/**
 * Download a file from S3
 * @param {Object} options Download options
 * @param {string} options.bucket Bucket name (optional if AWS_S3_BUCKET is set)
 * @param {string} options.key Object key (path in S3)
 * @param {string} options.outputPath Local path to save the file (optional)
 * @returns {Promise<Object>} Download result with file content
 */
async function downloadFile(options) {
  try {
    const { 
      bucket = AWS_S3_BUCKET, 
      key, 
      outputPath
    } = options;
    
    if (!bucket) {
      throw new Error('Bucket name is required. Set AWS_S3_BUCKET or provide bucket option.');
    }
    
    if (!key) {
      throw new Error('Object key is required');
    }
    
    const s3 = getClient();
    
    const params = {
      Bucket: bucket,
      Key: key
    };
    
    const result = await s3.getObject(params).promise();
    
    // If outputPath is provided, save the file
    if (outputPath) {
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      await mkdirAsync(dir, { recursive: true }).catch(() => {});
      
      // Write file
      await writeFileAsync(outputPath, result.Body);
    }
    
    return {
      success: true,
      contentType: result.ContentType,
      metadata: result.Metadata,
      content: result.Body,
      contentLength: result.ContentLength,
      etag: result.ETag,
      outputPath: outputPath || null
    };
  } catch (error) {
    console.error('Error downloading file from S3:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Download error'
    };
  }
}

/**
 * List objects in an S3 bucket
 * @param {Object} options List options
 * @param {string} options.bucket Bucket name (optional if AWS_S3_BUCKET is set)
 * @param {string} options.prefix Prefix to filter objects
 * @param {number} options.maxItems Maximum number of items to return
 * @returns {Promise<Object>} List result
 */
async function listFiles(options = {}) {
  try {
    const { 
      bucket = AWS_S3_BUCKET, 
      prefix = '', 
      maxItems = 1000
    } = options;
    
    if (!bucket) {
      throw new Error('Bucket name is required. Set AWS_S3_BUCKET or provide bucket option.');
    }
    
    const s3 = getClient();
    
    const params = {
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxItems
    };
    
    const result = await s3.listObjectsV2(params).promise();
    
    return {
      success: true,
      files: result.Contents.map(item => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
        etag: item.ETag
      })),
      isTruncated: result.IsTruncated,
      count: result.KeyCount,
      bucket
    };
  } catch (error) {
    console.error('Error listing files in S3:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Listing error'
    };
  }
}

/**
 * Delete a file from S3
 * @param {Object} options Delete options
 * @param {string} options.bucket Bucket name (optional if AWS_S3_BUCKET is set)
 * @param {string} options.key Object key (path in S3)
 * @returns {Promise<Object>} Delete result
 */
async function deleteFile(options) {
  try {
    const { 
      bucket = AWS_S3_BUCKET, 
      key
    } = options;
    
    if (!bucket) {
      throw new Error('Bucket name is required. Set AWS_S3_BUCKET or provide bucket option.');
    }
    
    if (!key) {
      throw new Error('Object key is required');
    }
    
    const s3 = getClient();
    
    const params = {
      Bucket: bucket,
      Key: key
    };
    
    await s3.deleteObject(params).promise();
    
    return {
      success: true,
      bucket,
      key
    };
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Delete error'
    };
  }
}

/**
 * Get a presigned URL for direct browser upload/download
 * @param {Object} options URL options
 * @param {string} options.bucket Bucket name (optional if AWS_S3_BUCKET is set)
 * @param {string} options.key Object key (path in S3)
 * @param {string} options.operation Operation ('getObject' or 'putObject')
 * @param {number} options.expires Expiration time in seconds (default: 3600)
 * @returns {Promise<Object>} Presigned URL result
 */
function getPresignedUrl(options) {
  try {
    const { 
      bucket = AWS_S3_BUCKET, 
      key,
      operation = 'getObject',
      expires = 3600,
      contentType
    } = options;
    
    if (!bucket) {
      throw new Error('Bucket name is required. Set AWS_S3_BUCKET or provide bucket option.');
    }
    
    if (!key) {
      throw new Error('Object key is required');
    }
    
    const s3 = getClient();
    
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: expires
    };
    
    if (operation === 'putObject' && contentType) {
      params.ContentType = contentType;
    }
    
    const url = s3.getSignedUrl(operation, params);
    
    return {
      success: true,
      url,
      bucket,
      key,
      operation,
      expires: Date.now() + (expires * 1000)
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return {
      success: false,
      error: error.message,
      details: DEBUG ? error.toString() : 'Presigned URL error'
    };
  }
}

// Export the AWS S3 interface
module.exports = {
  s3: getClient(),
  getClient,
  testConnection,
  uploadFile,
  downloadFile,
  listFiles,
  deleteFile,
  getPresignedUrl
};