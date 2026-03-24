const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin', protect, admin, getAllUsers);

module.exports = router;