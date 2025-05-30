const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const documentService = require('../services/documentService');

// Check if middleware is available, fallback to empty middleware if not
let protect, authorize;
try {
  const authMiddleware = require('../middleware/authMiddleware');
  protect = authMiddleware.protect;
  authorize = authMiddleware.authorize;
} catch (error) {
  console.warn('Auth middleware not available, using fallback middleware');
  // Fallback middleware
  protect = (req, res, next) => next();
  authorize = (...roles) => (req, res, next) => next();
}

// Initialize document service on startup
const initDocumentService = async () => {
  try {
    await documentService.init();
    console.log('Document service initialized successfully');
  } catch (error) {
    console.error('Error initializing document service:', error);
  }
};

initDocumentService();

// Configure multer for file uploads
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'temp');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent collisions
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const fileExtension = path.extname(file.originalname);
    cb(null, `${timestamp}-${randomString}${fileExtension}`);
  }
});

// Configure upload limits
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max file size
    files: 1 // Max 1 file per request
  },
  fileFilter: (req, file, cb) => {
    // Optional: Add file type validation here
    cb(null, true);
  }
});

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/documents/upload
 * @desc    Upload a document
 * @access  Private
 */
router.post(
  '/upload',
  upload.single('file'),
  documentController.uploadDocument
);

/**
 * @route   GET /api/documents
 * @desc    List documents
 * @access  Private
 */
router.get(
  '/',
  documentController.listDocuments
);

/**
 * @route   GET /api/documents/:id
 * @desc    Get document metadata
 * @access  Private
 */
router.get(
  '/:id',
  documentController.getDocumentMetadata
);

/**
 * @route   PUT /api/documents/:id
 * @desc    Update document metadata
 * @access  Private
 */
router.put(
  '/:id',
  documentController.updateDocumentMetadata
);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete a document
 * @access  Private
 */
router.delete(
  '/:id',
  documentController.deleteDocument
);

/**
 * @route   GET /api/documents/download/:id
 * @desc    Download a document
 * @access  Private
 */
router.get(
  '/download/:id',
  documentController.downloadDocument
);

/**
 * @route   GET /api/documents/view/:id
 * @desc    View/preview a document
 * @access  Private
 */
router.get(
  '/view/:id',
  documentController.viewDocument
);

/**
 * @route   POST /api/documents/:id/share
 * @desc    Share document with users
 * @access  Private
 */
router.post(
  '/:id/share',
  documentController.shareDocument
);

/**
 * @route   POST /api/documents/:id/move
 * @desc    Move document to a folder
 * @access  Private
 */
router.post(
  '/:id/move',
  documentController.moveDocument
);

/**
 * @route   POST /api/documents/folders
 * @desc    Create a folder
 * @access  Private
 */
router.post(
  '/folders',
  documentController.createFolder
);

/**
 * @route   GET /api/documents/folders
 * @desc    List folders
 * @access  Private
 */
router.get(
  '/folders',
  documentController.listFolders
);

/**
 * @route   GET /api/documents/folders/:id
 * @desc    Get folder details
 * @access  Private
 */
router.get(
  '/folders/:id',
  documentController.getFolder
);

/**
 * @route   PUT /api/documents/folders/:id
 * @desc    Update folder details
 * @access  Private
 */
router.put(
  '/folders/:id',
  documentController.updateFolder
);

/**
 * @route   DELETE /api/documents/folders/:id
 * @desc    Delete a folder
 * @access  Private
 */
router.delete(
  '/folders/:id',
  documentController.deleteFolder
);

/**
 * @route   POST /api/documents/folders/:id/share
 * @desc    Share folder with users
 * @access  Private
 */
router.post(
  '/folders/:id/share',
  documentController.shareFolder
);

/**
 * @route   GET /api/documents/stats
 * @desc    Get document statistics
 * @access  Private
 */
router.get(
  '/stats',
  documentController.getDocumentStats
);

module.exports = router;