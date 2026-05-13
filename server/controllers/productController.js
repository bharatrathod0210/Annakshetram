const Product = require('../models/Product');

// @desc  Get all products (public, with filters)
// @route GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured, page = 1, limit = 12 } = req.query;
    const query = { isDeleted: false };

    if (category) query.categoryId = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single product
// @route GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      $or: [{ productId: req.params.id }, { slug: req.params.id }],
      isDeleted: false,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, longDescription, categoryId, price, mrp, unit, stock, isFeatured, tags } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const images = req.files ? req.files.map(f => f.path) : [];

    const product = await Product.create({
      name, slug, description, longDescription, categoryId,
      images, price: Number(price), mrp: Number(mrp), unit,
      stock: Number(stock), isFeatured: isFeatured === 'true',
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
    });
    res.status(201).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);
    if (updates.mrp) updates.mrp = Number(updates.mrp);
    if (updates.stock) updates.stock = Number(updates.stock);
    if (updates.isFeatured !== undefined) updates.isFeatured = updates.isFeatured === 'true' || updates.isFeatured === true;
    if (updates.tags && typeof updates.tags === 'string') updates.tags = updates.tags.split(',').map(t => t.trim());
    if (req.files && req.files.length > 0) updates.images = req.files.map(f => f.path);
    if (updates.name) updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    Object.assign(product, updates);
    await product.save();
    res.json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

// @desc  Soft delete product (admin)
// @route DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.isDeleted = true;
    await product.save();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all products including deleted (admin)
// @route GET /api/products/admin/all
const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: { products } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getAllProductsAdmin };
