const express = require('express');
const { createRental, getMyRentals } = require('../controllers/rentalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createRental)
  .get(protect, getMyRentals);

module.exports = router;