const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      default: () => generateId('category'),
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
