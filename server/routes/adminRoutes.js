const express = require('express');
const router = express.Router();
const {
  getBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner,
  getSettings, updateSettings, updateShippingConfig,
  getDashboard, getAllUsers, toggleUserStatus,
  getAllOrders, getOrderDetails, updateOrderStatus, updateAdminNotes, deleteOrder,
  markOrderAsSeen, getUnseenOrdersCount, downloadOrderReceipt, refundOrder,
  getPaymentLogs, getPaymentLogDetails, getOrderPaymentLogs, getLogFiles, downloadLogFile, getPaymentStats
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/banners', getBanners);
router.get('/settings', getSettings);

// Admin only
router.get('/banners/all', protect, adminOnly, getAllBannersAdmin);
router.post('/banners', protect, adminOnly, upload.single('image'), createBanner);
router.put('/banners/:id', protect, adminOnly, upload.single('image'), updateBanner);
router.delete('/banners/:id', protect, adminOnly, deleteBanner);

router.put('/settings', protect, adminOnly, updateSettings);
router.put('/settings/shipping', protect, adminOnly, updateShippingConfig);

router.get('/dashboard', protect, adminOnly, getDashboard);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/toggle', protect, adminOnly, toggleUserStatus);

// Order management
router.get('/orders', protect, adminOnly, getAllOrders);
router.get('/orders/unseen/count', protect, adminOnly, getUnseenOrdersCount);
router.get('/orders/:orderId/receipt', protect, adminOnly, downloadOrderReceipt); // Must come BEFORE /:orderId
router.get('/orders/:orderId', protect, adminOnly, getOrderDetails);
router.put('/orders/:orderId/status', protect, adminOnly, updateOrderStatus);
router.put('/orders/:orderId/notes', protect, adminOnly, updateAdminNotes);
router.put('/orders/:orderId/seen', protect, adminOnly, markOrderAsSeen);
router.post('/orders/:orderId/refund', protect, adminOnly, refundOrder);
router.delete('/orders/:orderId', protect, adminOnly, deleteOrder);

// Payment logs — specific routes MUST come before /:id to avoid param conflicts
router.get('/payment-logs/stats', protect, adminOnly, getPaymentStats);
router.get('/payment-logs/files', protect, adminOnly, getLogFiles);
router.get('/payment-logs/files/:date', protect, adminOnly, downloadLogFile);
router.get('/payment-logs/order/:orderId', protect, adminOnly, getOrderPaymentLogs);
router.get('/payment-logs', protect, adminOnly, getPaymentLogs);
router.get('/payment-logs/:id', protect, adminOnly, getPaymentLogDetails);

module.exports = router;
