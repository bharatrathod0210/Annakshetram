const Review = require('../models/Review');

// @desc  Submit review (public)
// @route POST /api/reviews
const submitReview = async (req, res) => {
  try {
    const { name, location, rating, text } = req.body;
    if (!name || !rating || !text)
      return res.status(400).json({ success: false, message: 'Name, rating and review text are required' });
    const review = await Review.create({ name, location: location || '', rating: Number(rating), text });
    res.status(201).json({ success: true, message: 'Thank you for your review!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all approved reviews (public)
// @route GET /api/reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true, isDeleted: false })
      .sort({ createdAt: -1 })
      .select('-__v');
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

module.exports = { submitReview, getReviews, getAllReviewsAdmin, updateReview, deleteReview };
