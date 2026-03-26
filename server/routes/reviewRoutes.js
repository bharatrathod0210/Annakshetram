const express = require('express');
const router = express.Router();
const {
  generateLink, getByToken, submitReview,
  getReviews, getAllReviewsAdmin, updateReview, deleteReview,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public
router.get('/', getReviews);
router.get('/token/:token', getByToken);
router.post('/submit/:token', submitReview);

// Admin only
router.post('/generate-link', protect, adminOnly, generateLink);
router.get('/admin', protect, adminOnly, getAllReviewsAdmin);
router.put('/:id', protect, adminOnly, updateReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
