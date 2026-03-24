const express = require('express');
const router = express.Router();
const {
  getBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner,
  getSettings, updateSettings,
  getDashboard, getAllUsers, toggleUserStatus,
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

router.get('/dashboard', protect, adminOnly, getDashboard);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/toggle', protect, adminOnly, toggleUserStatus);

module.exports = router;
