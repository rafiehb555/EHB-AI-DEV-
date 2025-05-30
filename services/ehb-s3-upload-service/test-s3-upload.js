/**
 * Test S3 Upload Script
 * 
 * This script tests the AWS S3 upload functionality
 * using the credentials from the .env file.
 */

require('dotenv').config();
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

// Check if AWS credentials exist
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
  console.error("❌ Missing AWS credentials or bucket name in environment variables");
  console.error("Please set the following environment variables:");
  console.error("- AWS_ACCESS_KEY_ID");
  console.error("- AWS_SECRET_ACCESS_KEY");
  console.error("- AWS_REGION (optional, defaults to us-east-1)");
  console.error("- S3_BUCKET_NAME");
  process.exit(1);
}

// Load AWS credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const s3 = new AWS.S3();

// Log AWS configuration
console.log("=======================================================");
console.log("Test S3 Upload Script");
console.log("=======================================================");
console.log("AWS Configuration:");
console.log(`Access Key ID: ${process.env.AWS_ACCESS_KEY_ID.substring(0, 5)}...`);
console.log(`Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? "Configured" : "Missing"}`);
console.log(`Region: ${process.env.AWS_REGION || "us-east-1"}`);
console.log(`Bucket: ${process.env.S3_BUCKET_NAME}`);
console.log("=======================================================");

// 📁 File to upload
const filePath = path.resolve(__dirname, "test-upload.txt");
const fileName = path.basename(filePath);

// Verify file exists
if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

console.log(`📂 Uploading file: ${fileName}`);
console.log(`📄 File path: ${filePath}`);
console.log(`📊 File size: ${fs.statSync(filePath).size} bytes`);

const uploadParams = {
  Bucket: process.env.S3_BUCKET_NAME,
  Key: `test/${fileName}`,
  Body: fs.createReadStream(filePath),
  // ACL parameter removed - bucket doesn't support ACLs
};

console.log("⏳ Starting upload...");

s3.upload(uploadParams, (err, data) => {
  if (err) {
    console.error("❌ Upload failed:", err.message);
    if (err.code) {
      console.error(`Error code: ${err.code}`);
    }
    
    // Common S3 errors and solutions
    if (err.code === "NoSuchBucket") {
      console.error(`The bucket '${process.env.S3_BUCKET_NAME}' does not exist or you don't have permission to access it.`);
    } else if (err.code === "AccessDenied") {
      console.error("Access denied. Check your AWS credentials and bucket permissions.");
    } else if (err.code === "InvalidAccessKeyId") {
      console.error("Invalid AWS Access Key ID. Please check your credentials.");
    } else if (err.code === "SignatureDoesNotMatch") {
      console.error("Signature doesn't match. Please check your AWS Secret Access Key.");
    }
  } else {
    console.log("✅ File uploaded successfully!");
    console.log("🔗 File URL:", data.Location);
    
    // Test that the file is accessible
    console.log("⏳ Testing file accessibility...");
    
    // Create a simple HTTP request to check if the file is accessible
    const https = require('https');
    const url = new URL(data.Location);
    
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname,
      method: 'HEAD',
    }, (res) => {
      if (res.statusCode === 200) {
        console.log("✅ File is publicly accessible!");
      } else {
        console.log(`⚠️ File exists but returned status ${res.statusCode}`);
        
        // Generate a presigned URL for the object since it's not publicly accessible
        console.log("⏳ Generating presigned URL...");
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `test/${fileName}`,
          Expires: 3600 // URL expires in 1 hour
        };
        
        const presignedUrl = s3.getSignedUrl('getObject', params);
        console.log('✅ Presigned URL generated successfully');
        console.log('🔗 Presigned URL:', presignedUrl);
        
        // Test file accessibility using presigned URL
        console.log('⏳ Testing file accessibility with presigned URL...');
        const httpTest = require('https');
        const testReq = httpTest.get(presignedUrl, (testRes) => {
          console.log(`✅ Presigned URL test status: ${testRes.statusCode}`);
          if (testRes.statusCode === 200) {
            console.log('File is accessible via presigned URL');
          }
        });
        
        testReq.on('error', (testError) => {
          console.error('❌ Error testing presigned URL:', testError.message);
        });
        
        testReq.end();
      }
    });
    
    req.on('error', (error) => {
      console.error("❌ Error checking file accessibility:", error.message);
    });
    
    req.end();
  }
});