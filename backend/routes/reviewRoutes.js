const express = require('express');
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.get('/:product_id', getProductReviews);

module.exports = router;