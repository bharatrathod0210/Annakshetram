const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc  Get user cart
// @route GET /api/cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.userId, isDeleted: false });
    if (!cart) cart = await Cart.create({ userId: req.user.userId, items: [] });

    // Remove any deleted products from cart items
    if (cart.items.length > 0) {
      const productIds = cart.items.map(i => i.productId);
      const activeProducts = await Product.find({ productId: { $in: productIds }, isDeleted: false }).select('productId');
      const activeIds = new Set(activeProducts.map(p => p.productId));
      const before = cart.items.length;
      cart.items = cart.items.filter(i => activeIds.has(i.productId));
      if (cart.items.length !== before) await cart.save();
    }

    res.json({ success: true, data: { cart } });
  } catch (err) {
    next(err);
  }
};

// @desc  Add item to cart
// @route POST /api/cart/add
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findOne({ productId, isDeleted: false });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.user.userId, isDeleted: false });
    if (!cart) cart = await Cart.create({ userId: req.user.userId, items: [] });

    const existingIdx = cart.items.findIndex(i => i.productId === productId);
    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        unit: product.unit,
        quantity: Number(quantity),
      });
    }
    await cart.save();
    res.json({ success: true, message: 'Added to cart', data: { cart } });
  } catch (err) {
    next(err);
  }
};

// @desc  Update item quantity
// @route PUT /api/cart/update
const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.userId, isDeleted: false });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const idx = cart.items.findIndex(i => i.productId === productId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    if (Number(quantity) <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = Number(quantity);
    }
    await cart.save();
    res.json({ success: true, data: { cart } });
  } catch (err) {
    next(err);
  }
};

// @desc  Remove item from cart
// @route DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId, isDeleted: false });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items = cart.items.filter(i => i.productId !== req.params.productId);
    await cart.save();
    res.json({ success: true, message: 'Item removed', data: { cart } });
  } catch (err) {
    next(err);
  }
};

// @desc  Clear cart
// @route DELETE /api/cart/clear
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId, isDeleted: false });
    if (cart) { cart.items = []; await cart.save(); }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
