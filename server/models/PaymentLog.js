const mongoose = require('mongoose');

const paymentLogSchema = new mongoose.Schema({
  // Operation Details
  operation: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'REFUND', 'RETRY', 'VERIFY', 'CAPTURE', 'FAILED']
  },
  
  // Payment Details
  orderId: {
    type: String,
    required: true,
    index: true
  },
  
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  
  amount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'INR'
  },
  
  paymentMethod: String,
  paymentStatus: String,
  
  // User Details
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  userEmail: String,
  userName: String,
  userPhone: String,
  
  // Success/Failure Details
  status: {
    type: String,
    required: true,
    enum: ['SUCCESS', 'FAILED', 'PENDING']
  },
  
  reason: String, // Success or failure reason
  
  errorDetails: {
    code: String,
    description: String,
    source: String,
    step: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  
  // Request/Response Data
  requestData: mongoose.Schema.Types.Mixed,
  responseData: mongoose.Schema.Types.Mixed,
  
  // Razorpay Specific
  razorpayError: {
    code: String,
    description: String,
    source: String,
    step: String,
    reason: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  
  // Refund Details (if applicable)
  refundDetails: {
    refundId: String,
    refundAmount: Number,
    refundStatus: String,
    refundReason: String,
    refundedAt: Date
  },
  
  // System Details
  ipAddress: String,
  userAgent: String,
  deviceInfo: String,
  
  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Additional Context
  notes: String,
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Indexes for better query performance
paymentLogSchema.index({ orderId: 1, timestamp: -1 });
paymentLogSchema.index({ userId: 1, timestamp: -1 });
paymentLogSchema.index({ operation: 1, status: 1 });
paymentLogSchema.index({ razorpayPaymentId: 1 });
paymentLogSchema.index({ timestamp: -1 });

// Static method to create log
paymentLogSchema.statics.createLog = async function(logData) {
  try {
    const log = new this(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Error creating payment log:', error);
    // Don't throw error to prevent breaking main flow
    return null;
  }
};

// Static method to get logs by order
paymentLogSchema.statics.getOrderLogs = async function(orderId) {
  return this.find({ orderId }).sort({ timestamp: -1 });
};

// Static method to get logs by user
paymentLogSchema.statics.getUserLogs = async function(userId, limit = 50) {
  return this.find({ userId }).sort({ timestamp: -1 }).limit(limit);
};

// Static method to get failed payments
paymentLogSchema.statics.getFailedPayments = async function(startDate, endDate) {
  const query = { status: 'FAILED' };
  if (startDate && endDate) {
    query.timestamp = { $gte: startDate, $lte: endDate };
  }
  return this.find(query).sort({ timestamp: -1 });
};

module.exports = mongoose.model('PaymentLog', paymentLogSchema);
