const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const reviewSchema = new mongoose.Schema(
  {
    reviewId: { type: String, default: () => generateId('review'), unique: true, index: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    adminReply: { type: String, trim: true, default: '' },
    replyLikes: { type: Number, default: 0, min: 0 },
    replyLikedBy: { type: [String], default: [] },
    /** Admins appreciating the customer's review (count + who, for toggle) */
    reviewTeamLikes: { type: Number, default: 0, min: 0 },
    reviewLikedByAdmins: { type: [String], default: [] },
    isApproved: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.replyLikedBy;
    // reviewLikedByAdmins kept for admin JSON; public GET uses .select('-reviewLikedByAdmins')
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Review', reviewSchema);
