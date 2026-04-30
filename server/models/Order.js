const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  unit: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      default: () => generateId('order'),
      unique: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    userDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [orderItemSchema],
    
    // Pricing
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    
    // Delivery Address
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    
    // Shipping Info
    shippingInfo: {
      isLocal: { type: Boolean, default: false },
      appliedSlab: {
        minOrder: { type: Number },
        maxOrder: { type: Number },
        charge: { type: Number },
      },
    },
    
    // Payment Details
    paymentMethod: { 
      type: String, 
      enum: ['razorpay', 'cod'], 
      default: 'razorpay' 
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    
    // Refund Details
    refundDetails: {
      refundId: { type: String },
      amount: { type: Number },
      refundedAt: { type: Date },
      refundedBy: { type: String },
    },
    
    // Payment Logs
    paymentLogs: [{
      timestamp: { type: Date, default: Date.now },
      status: { type: String },
      message: { type: String },
      data: { type: mongoose.Schema.Types.Mixed },
    }],
    
    // Order Status
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    
    // Status History
    statusHistory: [{
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      note: { type: String, default: '' },
      updatedBy: { type: String, default: 'system' },
    }],
    
    // Additional Info
    notes: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    cancelReason: { type: String, default: '' },
    
    // Admin tracking
    isSeenByAdmin: { type: Boolean, default: false },
    seenByAdminAt: { type: Date },
    
    // Tracking
    trackingNumber: { type: String, default: '' },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add payment log method
orderSchema.methods.addPaymentLog = function(status, message, data = {}) {
  this.paymentLogs.push({
    timestamp: new Date(),
    status,
    message,
    data,
  });
};

// Add status history method
orderSchema.methods.updateOrderStatus = function(newStatus, note = '', updatedBy = 'system') {
  this.orderStatus = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy,
  });
};

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, orderStatus: 1 });
orderSchema.index({ razorpayOrderId: 1 });
orderSchema.index({ razorpayPaymentId: 1 });

module.exports = mongoose.model('Order', orderSchema);
