const express = require('express');
const {
  createOrder,
  verifyPayment,
  handlePaymentFailure,
  getMyOrders,
  getOrderById,
  cancelOrder,
  calculateShipping,
  downloadReceipt,
  retryPayment,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// User routes
router.post('/calculate-shipping', protect, calculateShipping);
router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/payment-failed', protect, handlePaymentFailure);
router.get('/my-orders', protect, getMyOrders);
router.get('/:orderId/receipt', protect, downloadReceipt); // Must come BEFORE /:orderId
router.get('/:orderId', protect, getOrderById);
router.put('/:orderId/cancel', protect, cancelOrder);
router.post('/:orderId/retry-payment', protect, retryPayment);

module.exports = router;
