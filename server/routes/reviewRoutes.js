const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  submitReview,
  getReviews,
  getAllReviewsAdmin,
  updateReview,
  deleteReview,
  likeAdminReply,
  toggleTeamReviewLike,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const submitReviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many reviews submitted. Please try again later.' },
});

const replyLikeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

router.get('/', getReviews);
router.post('/', submitReviewLimiter, submitReview);
router.post('/:id/reply-like', replyLikeLimiter, likeAdminReply);

router.get('/admin', protect, adminOnly, getAllReviewsAdmin);
router.post('/:id/team-review-like', protect, adminOnly, toggleTeamReviewLike);
router.put('/:id', protect, adminOnly, updateReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
