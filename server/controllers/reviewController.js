const crypto = require('crypto');
const Review = require('../models/Review');

// Generate a unique token
const genToken = () => crypto.randomBytes(20).toString('hex');

// @desc  Generate review link (admin only)
// @route POST /api/reviews/generate-link
const generateLink = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const token = genToken();
    // Store a placeholder review with just the token + name
    const review = await Review.create({ token, name, location: location || '', rating: 5, text: '', isApproved: false });
    const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/review/${token}`;
    res.status(201).json({ success: true, data: { link, reviewId: review.reviewId, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get review form data by token (public)
// @route GET /api/reviews/token/:token
const getByToken = async (req, res) => {
  try {
    const review = await Review.findOne({ token: req.params.token, isDeleted: false });
    if (!review) return res.status(404).json({ success: false, message: 'Invalid or expired link' });
    if (review.text) return res.status(400).json({ success: false, message: 'Review already submitted' });
    res.json({ success: true, data: { name: review.name, location: review.location } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Submit review via token (public)
// @route POST /api/reviews/submit/:token
const submitReview = async (req, res) => {
  try {
    const { rating, text, name, location } = req.body;
    if (!rating || !text) return res.status(400).json({ success: false, message: 'Rating and review text are required' });
    const review = await Review.findOne({ token: req.params.token, isDeleted: false });
    if (!review) return res.status(404).json({ success: false, message: 'Invalid or expired link' });
    if (review.text) return res.status(400).json({ success: false, message: 'Review already submitted' });
    review.rating = Number(rating);
    review.text = text.trim();
    if (name) review.name = name.trim();
    if (location) review.location = location.trim();
    review.isApproved = true;
    await review.save();
    res.json({ success: true, message: 'Thank you for your review!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all approved reviews (public)
// @route GET /api/reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true, isDeleted: false, text: { $ne: '' } })
      .sort({ createdAt: -1 })
      .select('-token -__v');
    res.json({ success: true, data: { reviews } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all reviews (admin)
// @route GET /api/reviews/admin
const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: { reviews } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update review (admin)
// @route PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({ reviewId: req.params.id });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    const { name, location, rating, text, isApproved } = req.body;
    if (name !== undefined) review.name = name;
    if (location !== undefined) review.location = location;
    if (rating !== undefined) review.rating = Number(rating);
    if (text !== undefined) review.text = text;
    if (isApproved !== undefined) review.isApproved = isApproved;
    await review.save();
    res.json({ success: true, data: { review } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete review (admin)
// @route DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({ reviewId: req.params.id });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.isDeleted = true;
    await review.save();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { generateLink, getByToken, submitReview, getReviews, getAllReviewsAdmin, updateReview, deleteReview };
