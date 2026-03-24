const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  unit: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      default: () => generateId('cart'),
      unique: true,
      index: true,
    },
    userId: { type: String, required: true, unique: true, index: true },
    items: [cartItemSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
