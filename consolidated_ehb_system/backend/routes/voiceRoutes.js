const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { processVoice } = require('../controllers/voiceController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/audio');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });
router.post('/process', auth, upload.single('audio'), processVoice);

module.exports = router;
