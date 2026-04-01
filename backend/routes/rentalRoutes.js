const express = require('express');
const { createRental, getMyRentals, getRentalById, getAllRentals, updateRentalStatus, getProductBookings, processRentalPayment } = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin routes
router.get('/admin', protect, admin, getAllRentals);
router.put('/admin/:id', protect, admin, updateRentalStatus);
router.put('/:id', protect, admin, updateRentalStatus);

router.get('/product/:product_id', getProductBookings);
router.post('/:id/pay', protect, processRentalPayment);
router.get('/:id', protect, getRentalById);

router.route('/')
  .post(protect, createRental)
  .get(protect, getMyRentals);

module.exports = router;
