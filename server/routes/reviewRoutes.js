const express = require('express');
const router = express.Router();
const { submitReview, getReviews, getAllReviewsAdmin, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getReviews);
router.post('/', submitReview);

router.get('/admin', protect, adminOnly, getAllReviewsAdmin);
router.put('/:id', protect, adminOnly, updateReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
