const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: () => generateId('product'),
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    categoryId: { type: String, ref: 'Category', required: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    unit: { type: String, default: '500g' },
    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
