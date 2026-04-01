const express = require('express');
const { getAllUsers, getMe, updateMe } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);


router.get('/admin', protect, admin, getAllUsers);

module.exports = router;

