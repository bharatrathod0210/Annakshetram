const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const { calculateShippingCharge, getNextFreeShippingThreshold } = require('../utils/shippingCalculator');
const { generateOrderPDF } = require('../utils/pdfGenerator');
const PaymentLogger = require('../utils/paymentLogger');
const { HttpError } = require('../utils/httpError');
const { sanitizeOrderForCustomer, sanitizeOrdersForCustomer } = require('../utils/sanitizeOrder');

// Initialize Razorpay
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/orders/create
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, discount = 0 } = req.body;
  const userId = req.user.userId;

  // Validate shipping address
  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || 
      !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || 
      !shippingAddress.pincode) {
    throw new HttpError(400, 'Complete shipping address is required');
  }

  // Get user cart
  const cart = await Cart.findOne({ userId, isDeleted: false });
  if (!cart || cart.items.length === 0) {
    throw new HttpError(400, 'Cart is empty');
  }

  // Get user details
  const user = await User.findOne({ userId });
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  // Verify products and calculate total
  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findOne({ productId: item.productId, isDeleted: false });
    
    if (!product) {
      throw new HttpError(400, `Product ${item.name} not found`);
    }

    if (product.stock < item.quantity) {
      throw new HttpError(400, `Insufficient stock for ${product.name}. Available: ${product.stock}`);
    }

    const itemSubtotal = product.price * item.quantity;
    subtotal += itemSubtotal;

    orderItems.push({
      productId: product.productId,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      unit: product.unit,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  // Get shipping configuration and calculate delivery charge
  const settings = await Settings.findOne();
  let deliveryCharge = 50; // Default fallback
  let shippingInfo = { isLocal: false, appliedSlab: null };

  if (settings && settings.shippingConfig) {
    const shippingCalc = calculateShippingCharge(
      shippingAddress.state,
      subtotal,
      settings.shippingConfig
    );
    deliveryCharge = shippingCalc.charge;
    shippingInfo = {
      isLocal: shippingCalc.isLocal,
      appliedSlab: shippingCalc.appliedSlab,
    };
  }

  const total = subtotal + deliveryCharge - discount;

  if (total <= 0) {
    throw new HttpError(400, 'Invalid order total');
  }

  // Create Razorpay order
  let razorpayOrder;
  const requestMetadata = PaymentLogger.getRequestMetadata(req);
  
  try {
    const razorpayRequest = {
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: user.userId,
        userName: user.name,
        userEmail: user.email,
      },
    };
    
    razorpayOrder = await razorpay.orders.create(razorpayRequest);
    
    // Log successful creation
    await PaymentLogger.logCreate({
      orderId: `temp_${Date.now()}`, // Will be updated after order creation
      razorpayOrderId: razorpayOrder.id,
      amount: total,
      currency: 'INR',
      userId: user.userId,
      userEmail: user.email,
      userName: user.name,
      userPhone: user.phone || shippingAddress.phone,
      success: true,
      reason: 'Razorpay order created successfully',
      requestData: razorpayRequest,
      responseData: razorpayOrder,
      ...requestMetadata,
      notes: `Order creation initiated for user ${user.name}`,
      metadata: {
        subtotal,
        deliveryCharge,
        discount,
        itemCount: orderItems.length
      }
    });
    
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    
    // Log failure
    await PaymentLogger.logCreate({
      orderId: `failed_${Date.now()}`,
      amount: total,
      currency: 'INR',
      userId: user.userId,
      userEmail: user.email,
      userName: user.name,
      userPhone: user.phone || shippingAddress.phone,
      success: false,
      reason: 'Failed to create Razorpay order',
      requestData: {
        amount: Math.round(total * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      },
      error: {
        code: error.error?.code || 'UNKNOWN_ERROR',
        description: error.error?.description || error.message,
        source: error.error?.source || 'razorpay',
        step: 'order_creation',
        metadata: error.error?.metadata || {}
      },
      razorpayError: error.error,
      ...requestMetadata,
      notes: `Failed to create order for user ${user.name}`
    });
    
    throw new HttpError(500, 'Failed to create payment order. Please try again.');
  }

  // Create order in database
  const order = await Order.create({
    userId: user.userId,
    userDetails: {
      name: user.name,
      email: user.email,
      phone: user.phone || shippingAddress.phone,
    },
    items: orderItems,
    subtotal,
    deliveryCharge,
    discount,
    total,
    shippingAddress,
    shippingInfo, // Store shipping calculation info
    paymentMethod: 'razorpay',
    paymentStatus: 'pending',
    razorpayOrderId: razorpayOrder.id,
    orderStatus: 'pending',
  });

  // Add initial payment log
  order.addPaymentLog('pending', 'Razorpay order created', {
    razorpayOrderId: razorpayOrder.id,
    amount: total,
  });

  // Add initial status history
  order.updateOrderStatus('pending', 'Order created, awaiting payment');

  await order.save();

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order: {
      orderId: order.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: total,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      deliveryCharge,
      shippingInfo,
    },
  });
});

// @desc    Verify Razorpay payment
// @desc    Verify payment
// @route   POST /api/orders/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const requestMetadata = PaymentLogger.getRequestMetadata(req);

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new HttpError(400, 'Missing payment verification details');
  }

  // Find order
  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  // Verify signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    // Payment verification failed
    order.paymentStatus = 'failed';
    order.addPaymentLog('failed', 'Payment signature verification failed', {
      razorpay_payment_id,
      razorpay_signature,
    });
    await order.save();
    
    // Log verification failure
    await PaymentLogger.logVerify({
      orderId: order.orderId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: order.total,
      userId: order.userId,
      userEmail: order.userDetails.email,
      userName: order.userDetails.name,
      userPhone: order.userDetails.phone,
      success: false,
      reason: 'Payment signature verification failed - Invalid signature',
      requestData: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      error: {
        code: 'SIGNATURE_MISMATCH',
        description: 'Generated signature does not match provided signature',
        source: 'server',
        step: 'signature_verification',
        metadata: {
          generatedSignature: generatedSignature.substring(0, 10) + '...',
          providedSignature: razorpay_signature.substring(0, 10) + '...'
        }
      },
      ...requestMetadata,
      notes: `Signature verification failed for order ${order.orderId}`
    });

    throw new HttpError(400, 'Payment verification failed');
  }

  // Fetch payment details from Razorpay
  let paymentDetails;
  try {
    paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    
    // Log fetch error but continue
    await PaymentLogger.logVerify({
      orderId: order.orderId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: order.total,
      userId: order.userId,
      userEmail: order.userDetails.email,
      userName: order.userDetails.name,
      success: false,
      reason: 'Failed to fetch payment details from Razorpay',
      error: {
        code: error.error?.code || 'FETCH_ERROR',
        description: error.error?.description || error.message,
        source: 'razorpay',
        step: 'fetch_payment_details'
      },
      razorpayError: error.error,
      ...requestMetadata
    });
  }

  // Payment verified successfully
  order.paymentStatus = 'completed';
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  order.orderStatus = 'confirmed';

  order.addPaymentLog('completed', 'Payment verified successfully', {
    razorpay_payment_id,
    method: paymentDetails?.method || 'unknown',
    bank: paymentDetails?.bank || '',
    wallet: paymentDetails?.wallet || '',
    vpa: paymentDetails?.vpa || '',
    email: paymentDetails?.email || '',
    contact: paymentDetails?.contact || '',
  });

  order.updateOrderStatus('confirmed', 'Payment received and verified');

  await order.save();
  
  // Log successful verification
  await PaymentLogger.logVerify({
    orderId: order.orderId,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    amount: order.total,
    paymentMethod: paymentDetails?.method || 'unknown',
    paymentStatus: 'completed',
    userId: order.userId,
    userEmail: order.userDetails.email,
    userName: order.userDetails.name,
    userPhone: order.userDetails.phone,
    success: true,
    reason: 'Payment verified and order confirmed successfully',
    requestData: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    responseData: paymentDetails,
    ...requestMetadata,
    notes: `Payment verified for order ${order.orderId}`,
    metadata: {
      method: paymentDetails?.method,
      bank: paymentDetails?.bank,
      wallet: paymentDetails?.wallet,
      vpa: paymentDetails?.vpa,
      itemCount: order.items.length
    }
  });

  // Update product stock
  for (const item of order.items) {
    await Product.findOneAndUpdate(
      { productId: item.productId },
      { $inc: { stock: -item.quantity } }
    );
  }

  // Clear user cart
  await Cart.findOneAndUpdate(
    { userId: order.userId },
    { items: [] }
  );

  res.json({
    success: true,
    message: 'Payment verified successfully',
    order: {
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    },
  });
});

// @desc    Handle payment failure
// @route   POST /api/orders/payment-failed
// @access  Private
const handlePaymentFailure = asyncHandler(async (req, res) => {
  const { razorpay_order_id, error } = req.body;

  if (!razorpay_order_id) {
    throw new HttpError(400, 'Order ID is required');
  }

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  order.paymentStatus = 'failed';
  order.addPaymentLog('failed', 'Payment failed', {
    error: error || {},
    reason: error?.reason || 'Payment cancelled or failed by user',
    description: error?.description || '',
  });

  await order.save();

  res.json({
    success: true,
    message: 'Payment failure recorded',
  });
});

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ userId, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ userId, isDeleted: false });

  res.json({
    success: true,
    orders: sanitizeOrdersForCustomer(orders),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single order
// @route   GET /api/orders/:orderId
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.userId;

  const order = await Order.findOne({ orderId, isDeleted: false });

  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  // Check if user owns this order or is admin
  if (order.userId !== userId && req.user.role !== 'admin') {
    throw new HttpError(403, 'Not authorized to view this order');
  }

  const payload = req.user.role === 'admin' ? order : sanitizeOrderForCustomer(order);

  res.json({
    success: true,
    order: payload,
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:orderId/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;
  const userId = req.user.userId;

  const order = await Order.findOne({ orderId, userId, isDeleted: false });

  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  // Check if order can be cancelled
  if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
    throw new HttpError(400, `Cannot cancel order with status: ${order.orderStatus}`);
  }

  order.orderStatus = 'cancelled';
  order.cancelReason = reason || 'Cancelled by user';
  order.updateOrderStatus('cancelled', reason || 'Cancelled by user', userId);

  // If payment was completed, mark for refund
  if (order.paymentStatus === 'completed') {
    order.paymentStatus = 'refunded';
    order.addPaymentLog('refunded', 'Order cancelled, refund initiated', { reason });
  }

  await order.save();

  // Restore product stock
  for (const item of order.items) {
    await Product.findOneAndUpdate(
      { productId: item.productId },
      { $inc: { stock: item.quantity } }
    );
  }

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    order: sanitizeOrderForCustomer(order),
  });
});

// @desc    Calculate shipping charges
// @route   POST /api/orders/calculate-shipping
// @access  Private
const calculateShipping = asyncHandler(async (req, res) => {
  const { state, orderTotal } = req.body;

  if (!state) {
    throw new HttpError(400, 'State is required');
  }

  const settings = await Settings.findOne();
  
  if (!settings || !settings.shippingConfig) {
    // Return default charges if no config
    return res.json({
      success: true,
      deliveryCharge: orderTotal >= 500 ? 0 : 50,
      isLocal: false,
      appliedSlab: null,
      nextFreeShippingThreshold: orderTotal < 500 ? 500 - orderTotal : null,
    });
  }

  const shippingCalc = calculateShippingCharge(
    state,
    orderTotal || 0,
    settings.shippingConfig
  );

  const nextThreshold = getNextFreeShippingThreshold(
    state,
    orderTotal || 0,
    settings.shippingConfig
  );

  res.json({
    success: true,
    deliveryCharge: shippingCalc.charge,
    isLocal: shippingCalc.isLocal,
    appliedSlab: shippingCalc.appliedSlab,
    nextFreeShippingThreshold: nextThreshold,
    localState: settings.shippingConfig.localState,
  });
});

// @desc    Download order receipt as PDF
// @route   GET /api/orders/:orderId/receipt
// @access  Private
const downloadReceipt = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.userId;

  const order = await Order.findOne({ orderId, isDeleted: false });

  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  // Check if user owns this order or is admin
  if (order.userId !== userId && req.user.role !== 'admin') {
    throw new HttpError(403, 'Not authorized to download this receipt');
  }

  // Generate and send PDF
  generateOrderPDF(order, res);
});

// @desc    Retry payment for failed/pending order
// @route   POST /api/orders/:orderId/retry-payment
// @access  Private
const retryPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.userId;

  const order = await Order.findOne({ orderId, userId, isDeleted: false });

  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  // Check if order can retry payment
  if (!['pending', 'failed'].includes(order.paymentStatus)) {
    throw new HttpError(400, `Cannot retry payment for order with payment status: ${order.paymentStatus}`);
  }

  // Check if order is not cancelled
  if (order.orderStatus === 'cancelled') {
    throw new HttpError(400, 'Cannot retry payment for cancelled order');
  }

  // Create new Razorpay order
  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100), // Amount in paise
      currency: 'INR',
      receipt: `retry_${Date.now()}`, // Shortened to fit 40 char limit
      notes: {
        orderId: order.orderId,
        userId: order.userId,
        userName: order.userDetails.name,
        userEmail: order.userDetails.email,
        retryAttempt: true,
      },
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new HttpError(500, 'Failed to create payment order. Please try again.');
  }

  // Update order with new Razorpay order ID
  order.razorpayOrderId = razorpayOrder.id;
  order.paymentStatus = 'pending';
  order.addPaymentLog('pending', 'Payment retry initiated', {
    razorpayOrderId: razorpayOrder.id,
    amount: order.total,
  });

  await order.save();

  res.json({
    success: true,
    message: 'Payment retry initiated',
    order: {
      orderId: order.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: order.total,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    },
  });
});

module.exports = {
  createOrder,
  verifyPayment,
  handlePaymentFailure,
  getMyOrders,
  getOrderById,
  cancelOrder,
  calculateShipping,
  downloadReceipt,
  retryPayment,
};
