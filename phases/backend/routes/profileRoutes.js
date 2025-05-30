const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const { getMe, uploadAvatar } = require('../controllers/profileController');

const storage = multer.diskStorage({
  destination: './public/avatars',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.get('/me', auth, getMe);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);

module.exports = router;
