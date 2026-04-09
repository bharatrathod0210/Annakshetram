const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// @desc  Register user
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, phone, passwordHash });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, token: generateToken(user.userId) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone: email }],
      isDeleted: false,
    });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    res.json({
      success: true,
      message: 'Login successful',
      data: { user, token: generateToken(user.userId) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

// @desc  Update profile (name, phone)
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated', data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Save delivery address
// @route PUT /api/auth/address
const saveAddress = async (req, res) => {
  try {
    const { fullName, phone, line1, line2, city, state, pincode } = req.body;
    if (!fullName || !phone || !line1 || !city || !state || !pincode)
      return res.status(400).json({ success: false, message: 'All required address fields must be filled' });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { address: { fullName, phone, line1, line2: line2 || '', city, state, pincode } },
      { new: true }
    );
    res.json({ success: true, message: 'Address saved', data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Change password
// @route PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe, updateProfile, saveAddress, changePassword };
