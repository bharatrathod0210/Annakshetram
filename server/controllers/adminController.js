const Banner = require('../models/Banner');
const Settings = require('../models/Settings');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

// --- BANNER CONTROLLERS ---
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isDeleted: false, isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: { banners } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json({ success: true, data: { banners } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, isActive, order } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const banner = await Banner.create({ title, subtitle, image, ctaText, ctaLink, isActive: isActive !== 'false', order: Number(order) || 0 });
    res.status(201).json({ success: true, data: { banner } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({ bannerId: req.params.id });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    if (updates.isActive !== undefined) updates.isActive = updates.isActive === 'true' || updates.isActive === true;
    if (updates.order !== undefined) updates.order = Number(updates.order);
    Object.assign(banner, updates);
    await banner.save();
    res.json({ success: true, data: { banner } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({ bannerId: req.params.id });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    banner.isDeleted = true;
    await banner.save();
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- SETTINGS CONTROLLERS ---
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({ success: true, data: { settings } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    Object.assign(settings, req.body);
    await settings.save();
    res.json({ success: true, data: { settings } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- ADMIN CONTROLLERS ---
const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalCategories, featuredProducts] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false }),
      Category.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false, isFeatured: true }),
    ]);
    res.json({
      success: true,
      data: { stats: { totalUsers, totalProducts, totalCategories, featuredProducts } },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { users } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isDeleted = !user.isDeleted;
    await user.save();
    res.json({ success: true, message: `User ${user.isDeleted ? 'deactivated' : 'activated'}`, data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner,
  getSettings, updateSettings,
  getDashboard, getAllUsers, toggleUserStatus,
};
