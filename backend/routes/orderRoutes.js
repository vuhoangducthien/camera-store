const express = require('express');
const { 
  createOrder, 
  createDirectOrder,
  getMyOrders, 
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  processPayment,   // thêm dòng này
  cancelOrder,
  returnOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin routes (Must be before dynamic :id routes)
router.get('/admin', protect, admin, getAllOrders);
router.put('/admin/:id', protect, admin, updateOrderStatus);

router.route('/')
  .post(protect, createOrder)
  .get(protect, getMyOrders);

router.post('/direct', protect, createDirectOrder);

router.get('/:id', protect, getOrderById);
router.post('/:id/pay', protect, processPayment); // thêm route thanh toán

router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/return', protect, returnOrder);

module.exports = router;
