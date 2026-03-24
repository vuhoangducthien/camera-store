const express = require('express');
const { upload, uploadImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), uploadImage);

module.exports = router;