const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');
const Settings = require('../models/Settings');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { generateOrderPDF } = require('../utils/pdfGenerator');
const PaymentLogger = require('../utils/paymentLogger');

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
    const image = req.file ? req.file.path : '';
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
    if (req.file) updates.image = req.file.path;
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

// Update shipping configuration
const updateShippingConfig = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    
    const { localState, localCharges, otherStatesCharges } = req.body;
    
    settings.shippingConfig = {
      localState: localState || settings.shippingConfig?.localState || 'Karnataka',
      localCharges: localCharges || settings.shippingConfig?.localCharges || [],
      otherStatesCharges: otherStatesCharges || settings.shippingConfig?.otherStatesCharges || [],
    };
    
    await settings.save();
    res.json({ success: true, message: 'Shipping configuration updated', data: { settings } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- ADMIN CONTROLLERS ---
const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalCategories, featuredProducts, totalOrders, pendingOrders, completedOrders, totalRevenue] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false }),
      Category.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false, isFeatured: true }),
      Order.countDocuments({ isDeleted: false }),
      Order.countDocuments({ isDeleted: false, orderStatus: { $in: ['pending', 'confirmed', 'processing'] } }),
      Order.countDocuments({ isDeleted: false, orderStatus: 'delivered' }),
      Order.aggregate([
        { $match: { isDeleted: false, paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).then(result => result[0]?.total || 0),
    ]);

    // Recent orders
    const recentOrders = await Order.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderId userDetails total orderStatus paymentStatus createdAt');

    res.json({
      success: true,
      data: { 
        stats: { 
          totalUsers, 
          totalProducts, 
          totalCategories, 
          featuredProducts,
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue: Math.round(totalRevenue),
        },
        recentOrders,
      },
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

// --- ORDER CONTROLLERS ---
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const seenFilter = req.query.seen; // 'true', 'false', or undefined for all

    const filter = { isDeleted: false };
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    // Date filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }
    
    // Seen/Unseen filter
    if (seenFilter === 'true') filter.isSeenByAdmin = true;
    if (seenFilter === 'false') filter.isSeenByAdmin = false;

    const [orders, total, unseenCount] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
      Order.countDocuments({ isDeleted: false, isSeenByAdmin: false }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        unseenCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, isDeleted: false });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Mark as seen by admin
    if (!order.isSeenByAdmin) {
      order.isSeenByAdmin = true;
      order.seenByAdminAt = new Date();
      await order.save();
    }
    
    res.json({ success: true, data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const markOrderAsSeen = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, isDeleted: false });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    order.isSeenByAdmin = true;
    order.seenByAdminAt = new Date();
    await order.save();
    
    res.json({ success: true, message: 'Order marked as seen' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUnseenOrdersCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ isDeleted: false, isSeenByAdmin: false });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber, estimatedDelivery } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId, isDeleted: false });
    
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    order.updateOrderStatus(status, note || `Status updated to ${status}`, req.user.userId);

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (status === 'delivered') order.deliveredAt = new Date();

    await order.save();

    res.json({ success: true, message: 'Order status updated', data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateAdminNotes = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId, isDeleted: false });
    
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.adminNotes = adminNotes;
    await order.save();

    res.json({ success: true, message: 'Admin notes updated', data: { order } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    order.isDeleted = true;
    await order.save();
    
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const downloadOrderReceipt = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, isDeleted: false });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Generate and send PDF
    generateOrderPDF(order, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const refundOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, isDeleted: false });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Validate order is paid
    if (order.paymentStatus !== 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only completed payments can be refunded' 
      });
    }
    
    // Check if already refunded
    if (order.paymentStatus === 'refunded') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order has already been refunded' 
      });
    }
    
    // Validate Razorpay payment ID exists
    if (!order.razorpayPaymentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'No payment ID found for this order' 
      });
    }
    
    // Calculate refund amount (subtotal only, no delivery charge)
    const refundAmount = Math.round(order.subtotal * 100); // Convert to paise
    
    // Initialize Razorpay
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    // Process refund through Razorpay
    const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: refundAmount,
      speed: 'normal',
      notes: {
        orderId: order.orderId,
        reason: 'Admin initiated refund',
      },
    });
    
    // Update order status
    order.paymentStatus = 'refunded';
    order.refundDetails = {
      refundId: refund.id,
      amount: order.subtotal,
      refundedAt: new Date(),
      refundedBy: req.user.userId,
    };
    
    // Add payment log
    order.addPaymentLog('refunded', `Refund processed: Rs. ${order.subtotal}`, {
      refundId: refund.id,
      amount: order.subtotal,
      razorpayRefund: refund,
    });
    
    await order.save();

    // Log refund to PaymentLog collection
    await PaymentLogger.logRefund({
      orderId: order.orderId,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      amount: order.subtotal,
      userId: order.userId,
      userEmail: order.userDetails.email,
      userName: order.userDetails.name,
      success: true,
      reason: 'Admin initiated refund',
      refundId: refund.id,
      refundAmount: order.subtotal,
      refundStatus: refund.status,
      refundReason: 'Admin initiated refund',
      refundedAt: new Date(),
      responseData: refund,
    });
    
    res.json({ 
      success: true, 
      message: `Refund of Rs. ${order.subtotal} processed successfully`,
      data: { order, refund } 
    });
  } catch (err) {
    console.error('Refund error:', err);
    
    // Handle Razorpay specific errors
    if (err.error && err.error.description) {
      return res.status(400).json({ 
        success: false, 
        message: `Razorpay Error: ${err.error.description}` 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Failed to process refund' 
    });
  }
};

// @desc    Get payment logs
// @route   GET /api/admin/payment-logs
// @access  Private/Admin
const getPaymentLogs = asyncHandler(async (req, res) => {
  const PaymentLog = require('../models/PaymentLog');
  const { page = 1, limit = 50, orderId, userId, operation, status, startDate, endDate } = req.query;

  const query = {};
  
  if (orderId) query.orderId = orderId;
  if (userId) query.userId = userId;
  if (operation) query.operation = operation;
  if (status) query.status = status;
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const logs = await PaymentLog.find(query)
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await PaymentLog.countDocuments(query);

  res.json({
    success: true,
    data: {
      logs,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        total: count,
        limit: parseInt(limit)
      }
    }
  });
});

// @desc    Get payment log details
// @route   GET /api/admin/payment-logs/:id
// @access  Private/Admin
const getPaymentLogDetails = asyncHandler(async (req, res) => {
  const PaymentLog = require('../models/PaymentLog');
  const log = await PaymentLog.findById(req.params.id);

  if (!log) {
    res.status(404);
    throw new Error('Payment log not found');
  }

  res.json({
    success: true,
    data: log
  });
});

// @desc    Get payment logs by order
// @route   GET /api/admin/payment-logs/order/:orderId
// @access  Private/Admin
const getOrderPaymentLogs = asyncHandler(async (req, res) => {
  const PaymentLog = require('../models/PaymentLog');
  const logs = await PaymentLog.find({ orderId: req.params.orderId })
    .sort({ timestamp: -1 });

  res.json({
    success: true,
    data: logs
  });
});

// @desc    Get log files list
// @route   GET /api/admin/payment-logs/files
// @access  Private/Admin
const getLogFiles = asyncHandler(async (req, res) => {
  const fileLogger = require('../utils/fileLogger');
  const files = fileLogger.getLogFiles('payment');

  res.json({
    success: true,
    data: files
  });
});

// @desc    Download log file
// @route   GET /api/admin/payment-logs/files/:date
// @access  Private/Admin
const downloadLogFile = asyncHandler(async (req, res) => {
  const fileLogger = require('../utils/fileLogger');
  const { date } = req.params;
  
  const logContent = fileLogger.readLog(date, 'payment');
  
  if (!logContent) {
    res.status(404);
    throw new Error('Log file not found');
  }

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename=payment-${date}.log`);
  res.send(logContent);
});

// @desc    Get payment statistics
// @route   GET /api/admin/payment-logs/stats
// @access  Private/Admin
const getPaymentStats = asyncHandler(async (req, res) => {
  const PaymentLog = require('../models/PaymentLog');
  const { startDate, endDate } = req.query;

  const query = {};
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const stats = await PaymentLog.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          operation: '$operation',
          status: '$status'
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  const totalLogs = await PaymentLog.countDocuments(query);
  const successCount = await PaymentLog.countDocuments({ ...query, status: 'SUCCESS' });
  const failedCount = await PaymentLog.countDocuments({ ...query, status: 'FAILED' });

  res.json({
    success: true,
    data: {
      stats,
      summary: {
        total: totalLogs,
        success: successCount,
        failed: failedCount,
        successRate: totalLogs > 0 ? ((successCount / totalLogs) * 100).toFixed(2) : 0
      }
    }
  });
});

module.exports = {
  getBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner,
  getSettings, updateSettings, updateShippingConfig,
  getDashboard, getAllUsers, toggleUserStatus,
  getAllOrders, getOrderDetails, updateOrderStatus, updateAdminNotes, deleteOrder,
  markOrderAsSeen, getUnseenOrdersCount, downloadOrderReceipt, refundOrder,
  getPaymentLogs, getPaymentLogDetails, getOrderPaymentLogs, getLogFiles, downloadLogFile, getPaymentStats
};
