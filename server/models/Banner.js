const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const bannerSchema = new mongoose.Schema(
  {
    bannerId: {
      type: String,
      default: () => generateId('banner'),
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    image: { type: String, required: true },
    ctaText: { type: String, default: 'Shop Now' },
    ctaLink: { type: String, default: '/products' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
