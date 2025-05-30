# EHB S3 Upload Service

This service provides S3 file upload capabilities for the EHB platform. It handles file uploads to AWS S3 and returns secure URLs for accessing the uploaded files.

## Features

- **File Uploads**: Upload files to AWS S3 securely
- **Presigned URLs**: Generate secure, time-limited URLs for accessing files
- **File Listing**: List files stored in S3 with filtering options
- **File Deletion**: Delete files from S3 storage
- **Test Upload**: Test S3 connectivity with a simple test file

## Configuration

The service requires the following environment variables:

- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `AWS_REGION`: The AWS region (defaults to 'us-east-1')
- `S3_BUCKET_NAME`: The name of your S3 bucket
- `S3_SERVICE_PORT`: The port to run the service on (defaults to 5400)

## API Endpoints

### Health Check

`GET /health`

Returns the service health status and configuration.

### File Upload

`POST /api/upload`

Upload a file to S3. Requires multipart/form-data with a 'file' field.

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "originalName": "filename.jpg",
    "fileKey": "uploads/1620586859123-filename.jpg",
    "mimeType": "image/jpeg",
    "size": 12345,
    "url": "https://bucket-name.s3.region.amazonaws.com/uploads/1620586859123-filename.jpg",
    "presignedUrl": "https://bucket-name.s3.region.amazonaws.com/uploads/1620586859123-filename.jpg?X-Amz-Algorithm=...",
    "expiresIn": "1 hour"
  }
}
```

### List Files

`GET /api/files?prefix=uploads/&limit=100`

List files stored in S3, optionally filtered by prefix.

**Query Parameters:**
- `prefix`: The prefix to filter by (defaults to 'uploads/')
- `limit`: Maximum number of files to return (defaults to 100)

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "key": "uploads/1620586859123-filename.jpg",
      "lastModified": "2023-05-09T12:34:56.000Z",
      "size": 12345,
      "url": "https://bucket-name.s3.region.amazonaws.com/uploads/1620586859123-filename.jpg?X-Amz-Algorithm=...",
      "publicUrl": "https://bucket-name.s3.region.amazonaws.com/uploads/1620586859123-filename.jpg"
    }
  ],
  "count": 1,
  "isTruncated": false,
  "prefix": "uploads/"
}
```

### Delete File

`DELETE /api/files/:key`

Delete a file from S3 by its key.

**Response:**
```json
{
  "success": true,
  "message": "File uploads/1620586859123-filename.jpg deleted successfully"
}
```

### Test Upload

`POST /api/test-upload`

Create and upload a test file to verify S3 connectivity.

**Response:**
```json
{
  "success": true,
  "message": "Test file uploaded successfully",
  "file": {
    "fileName": "test-upload-1620586859123.txt",
    "fileKey": "test/test-upload-1620586859123.txt",
    "content": "This is a test file created at 2023-05-09T12:34:56.000Z to verify S3 upload functionality.",
    "url": "https://bucket-name.s3.region.amazonaws.com/test/test-upload-1620586859123.txt",
    "presignedUrl": "https://bucket-name.s3.region.amazonaws.com/test/test-upload-1620586859123.txt?X-Amz-Algorithm=...",
    "expiresIn": "1 hour"
  }
}
```

## Running the Service

### Normal Mode

```bash
node index.js
```

### Monitor Mode (auto-restarts on failure)

```bash
node monitor.js
```

## Using with Workflow System

The service is configured to be detected by the workflow system on port 5400. However, if there are issues with the workflow detection, the service can be started manually using the monitoring script.

## Troubleshooting

If the service fails to start or the workflow doesn't detect it:

1. Verify AWS credentials are properly configured in environment variables
2. Check for port conflicts on port 5400
3. Run the service manually with `node index.js` to see detailed error messages
4. Use the monitor script with `node monitor.js` for automatic restarts

## Access Control

Files uploaded to S3 are not publicly accessible by default. The service generates presigned URLs that provide temporary access to the files. These URLs expire after 1 hour.

## Security Notes

- Never expose your AWS credentials in public code
- Use the provided presigned URLs for accessing files, not the direct S3 URLs
- Consider implementing user authentication before allowing file uploads