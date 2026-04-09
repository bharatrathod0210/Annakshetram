const Category = require('../models/Category');

// @desc  Get all categories
// @route GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false }).sort({ name: 1 });
    res.json({ success: true, data: { categories } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create category (admin)
// @route POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const category = await Category.create({ name, slug, description, image });
    res.status(201).json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update category (admin)
// @route PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ categoryId: req.params.id });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    const updates = { ...req.body };
    if (updates.name) updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    Object.assign(category, updates);
    await category.save();
    res.json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Soft delete category (admin)
// @route DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ categoryId: req.params.id });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    category.isDeleted = true;
    await category.save();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: { categories } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory, getAllCategoriesAdmin };
