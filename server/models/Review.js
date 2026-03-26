const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const reviewSchema = new mongoose.Schema(
  {
    reviewId: { type: String, default: () => generateId('review'), unique: true, index: true },
    token: { type: String, unique: true, index: true }, // private link token
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, trim: true, default: '' },
    isApproved: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
