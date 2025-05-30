const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const { uploadKYC, getAllKYC, updateKYCStatus } = require('../controllers/kycController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('document'), uploadKYC);
router.get('/admin/all', getAllKYC);
router.post('/admin/update', updateKYCStatus);

module.exports = router;
