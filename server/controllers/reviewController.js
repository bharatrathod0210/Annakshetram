const Review = require('../models/Review');
const { logger } = require('../utils/logger');

// @desc  Submit review (public)
// @route POST /api/reviews
const submitReview = async (req, res, next) => {
  try {
    const { name, location, rating, text } = req.body;
    if (!name || !rating || !text)
      return res.status(400).json({ success: false, message: 'Name, rating and review text are required' });
    const review = await Review.create({ name, location: location || '', rating: Number(rating), text });
    logger.info('Review submitted', { category: 'review', success: true, meta: { reviewId: review.reviewId } });
    res.status(201).json({ success: true, message: 'Thank you for your review!' });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all approved reviews (public)
// @route GET /api/reviews
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: true, isDeleted: false })
      .sort({ createdAt: -1 })
      .select('-__v -replyLikedBy -reviewLikedByAdmins');
    res.json({ success: true, data: { reviews } });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all reviews (admin)
// @route GET /api/reviews/admin
const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .select('-replyLikedBy');
    res.json({ success: true, data: { reviews } });
  } catch (err) {
    next(err);
  }
};

// @desc  Update review (admin)
// @route PUT /api/reviews/:id
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ reviewId: req.params.id });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    const { name, location, rating, text, isApproved, adminReply } = req.body;
    if (name !== undefined) review.name = name;
    if (location !== undefined) review.location = location;
    if (rating !== undefined) review.rating = Number(rating);
    if (text !== undefined) review.text = text;
    if (isApproved !== undefined) review.isApproved = isApproved;
    if (adminReply !== undefined) {
      const next = String(adminReply).trim();
      review.adminReply = next;
      if (!next) {
        review.replyLikes = 0;
        review.replyLikedBy = [];
      }
    }
    await review.save();
    res.json({ success: true, data: { review } });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete review (admin)
// @route DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ reviewId: req.params.id });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.isDeleted = true;
    await review.save();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc  Like admin reply on a review (public, one per browser via anonId)
// @route POST /api/reviews/:id/reply-like
const likeAdminReply = async (req, res, next) => {
  try {
    const review = await Review.findOne({ reviewId: req.params.id, isDeleted: false, isApproved: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (!review.adminReply) return res.status(400).json({ success: false, message: 'No reply to like' });

    let anonId = (req.body?.anonId || '').trim().slice(0, 128);
    if (!anonId) anonId = `ip:${req.ip || 'unknown'}`;

    if (!Array.isArray(review.replyLikedBy)) review.replyLikedBy = [];

    if (review.replyLikedBy.includes(anonId)) {
      return res.json({ success: true, data: { replyLikes: review.replyLikes, alreadyLiked: true } });
    }

    review.replyLikedBy.push(anonId);
    review.replyLikes = (review.replyLikes || 0) + 1;
    await review.save();
    res.json({ success: true, data: { replyLikes: review.replyLikes, alreadyLiked: false } });
  } catch (err) {
    next(err);
  }
};

// @desc  Admin toggles a "team like" on the customer's review text
// @route POST /api/reviews/:id/team-review-like
const toggleTeamReviewLike = async (req, res, next) => {
  try {
    const review = await Review.findOne({ reviewId: req.params.id, isDeleted: false });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const adminUserId = req.user.userId;
    if (!Array.isArray(review.reviewLikedByAdmins)) review.reviewLikedByAdmins = [];

    const idx = review.reviewLikedByAdmins.indexOf(adminUserId);
    if (idx >= 0) {
      review.reviewLikedByAdmins.splice(idx, 1);
      review.reviewTeamLikes = Math.max(0, (review.reviewTeamLikes || 0) - 1);
    } else {
      review.reviewLikedByAdmins.push(adminUserId);
      review.reviewTeamLikes = (review.reviewTeamLikes || 0) + 1;
    }

    await review.save();

    logger.info('Admin toggled review team-like', {
      category: 'review',
      success: true,
      meta: { reviewId: review.reviewId, liked: review.reviewLikedByAdmins.includes(adminUserId), count: review.reviewTeamLikes },
    });

    res.json({
      success: true,
      data: {
        reviewTeamLikes: review.reviewTeamLikes,
        likedByMe: review.reviewLikedByAdmins.includes(adminUserId),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitReview,
  getReviews,
  getAllReviewsAdmin,
  updateReview,
  deleteReview,
  likeAdminReply,
  toggleTeamReviewLike,
};
