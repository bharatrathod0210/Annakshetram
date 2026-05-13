const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { register, login, getMe, updateProfile, saveAddress, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const authWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

router.post('/register', authWriteLimiter, register);
router.post('/login', authWriteLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/address', protect, saveAddress);
router.put('/change-password', protect, changePassword);

module.exports = router;
