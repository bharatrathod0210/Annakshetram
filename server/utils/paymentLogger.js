const PaymentLog = require('../models/PaymentLog');
const fileLogger = require('./fileLogger');

class PaymentLogger {
  /**
   * Log payment creation
   */
  static async logCreate(data) {
    try {
      const logData = {
        operation: 'CREATE',
        orderId: data.orderId,
        razorpayOrderId: data.razorpayOrderId,
        amount: data.amount,
        currency: data.currency || 'INR',
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        userPhone: data.userPhone,
        status: data.success ? 'SUCCESS' : 'FAILED',
        reason: data.reason || (data.success ? 'Payment order created successfully' : 'Failed to create payment order'),
        requestData: data.requestData,
        responseData: data.responseData,
        errorDetails: data.error,
        razorpayError: data.razorpayError,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        notes: data.notes,
        metadata: data.metadata,
        timestamp: new Date()
      };

      // Write to database
      const dbLog = await PaymentLog.createLog(logData);
      
      // Write to file
      fileLogger.writeLog(logData, 'payment');
      
      return dbLog;
    } catch (error) {
      console.error('Payment Logger - Create Error:', error);
      return null;
    }
  }

  /**
   * Log payment verification
   */
  static async logVerify(data) {
    try {
      const logData = {
        operation: 'VERIFY',
        orderId: data.orderId,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        userPhone: data.userPhone,
        status: data.success ? 'SUCCESS' : 'FAILED',
        reason: data.reason || (data.success ? 'Payment verified successfully' : 'Payment verification failed'),
        requestData: data.requestData,
        responseData: data.responseData,
        errorDetails: data.error,
        razorpayError: data.razorpayError,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        notes: data.notes,
        metadata: data.metadata,
        timestamp: new Date()
      };

      // Write to database
      const dbLog = await PaymentLog.createLog(logData);
      
      // Write to file
      fileLogger.writeLog(logData, 'payment');
      
      return dbLog;
    } catch (error) {
      console.error('Payment Logger - Verify Error:', error);
      return null;
    }
  }

  /**
   * Log payment update
   */
  static async logUpdate(data) {
    try {
      const logData = {
        operation: 'UPDATE',
        orderId: data.orderId,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        amount: data.amount,
        paymentStatus: data.paymentStatus,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        status: data.success ? 'SUCCESS' : 'FAILED',
        reason: data.reason || (data.success ? 'Payment updated successfully' : 'Failed to update payment'),
        requestData: data.requestData,
        responseData: data.responseData,
        errorDetails: data.error,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        notes: data.notes,
        metadata: data.metadata,
        timestamp: new Date()
      };

      const dbLog = await PaymentLog.createLog(logData);
      fileLogger.writeLog(logData, 'payment');
      return dbLog;
    } catch (error) {
      console.error('Payment Logger - Update Error:', error);
      return null;
    }
  }

  /**
   * Log payment refund
   */
  static async logRefund(data) {
    try {
      const logData = {
        operation: 'REFUND',
        orderId: data.orderId,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        amount: data.amount,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        status: data.success ? 'SUCCESS' : 'FAILED',
        reason: data.reason || (data.success ? 'Refund processed successfully' : 'Refund processing failed'),
        refundDetails: {
          refundId: data.refundId,
          refundAmount: data.refundAmount,
          refundStatus: data.refundStatus,
          refundReason: data.refundReason,
          refundedAt: data.refundedAt || new Date()
        },
        requestData: data.requestData,
        responseData: data.responseData,
        errorDetails: data.error,
        razorpayError: data.razorpayError,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        notes: data.notes,
        metadata: data.metadata,
        timestamp: new Date()
      };

      const dbLog = await PaymentLog.createLog(logData);
      fileLogger.writeLog(logData, 'payment');
      return dbLog;
    } catch (error) {
      console.error('Payment Logger - Refund Error:', error);
      return null;
    }
  }

  /**
   * Log payment retry
   */
  static async logRetry(data) {
    try {
      const logData = {
        operation: 'RETRY',
        orderId: data.orderId,
        razorpayOrderId: data.razorpayOrderId,
        amount: data.amount,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        userPhone: data.userPhone,
        status: data.success ? 'SUCCESS' : 'FAILED',
        reason: data.reason || (data.success ? 'Payment retry initiated successfully' : 'Failed to retry payment'),
        requestData: data.requestData,
        responseData: data.responseData,
        errorDetails: data.error,
        razorpayError: data.razorpayError,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        notes: data.notes,
        metadata: data.metadata,
        timestamp: new Date()
      };

      const dbLog = await PaymentLog.createLog(logData);
      fileLogger.writeLog(logData, 'payment');
      return dbLog;
    } catch (error) {
      console.error('Payment Logger - Retry Error:', error);
      return null;
    }
  }

  /**
   * Log payment failure
   */
  static async logFailure(data) {
    try {
      const logData = {
        operation: 'FAILED',
        orderId: data.orderId,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        status: 'FAILED',
        reason: data.reason || 'Payment failed',
        errorDetails: data.error,
        razorpayError: data.razorpayError,
        requestData: data.requestData,
        responseData: data.responseData,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        notes: data.notes,
        metadata: data.metadata,
        timestamp: new Date()
      };

      const dbLog = await PaymentLog.createLog(logData);
      fileLogger.writeLog(logData, 'payment');
      return dbLog;
    } catch (error) {
      console.error('Payment Logger - Failure Error:', error);
      return null;
    }
  }

  /**
   * Log payment capture
   */
  static async logCapture(data) {
    try {
      const logData = {
        operation: 'CAPTURE',
        orderId: data.orderId,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        amount: data.amount,
        userId: data.userId,
        status: data.success ? 'SUCCESS' : 'FAILED',
        reason: data.reason || (data.success ? 'Payment captured successfully' : 'Failed to capture payment'),
        requestData: data.requestData,
        responseData: data.responseData,
        errorDetails: data.error,
        razorpayError: data.razorpayError,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        notes: data.notes,
        metadata: data.metadata,
        timestamp: new Date()
      };

      const dbLog = await PaymentLog.createLog(logData);
      fileLogger.writeLog(logData, 'payment');
      return dbLog;
    } catch (error) {
      console.error('Payment Logger - Capture Error:', error);
      return null;
    }
  }

  /**
   * Get request metadata
   */
  static getRequestMetadata(req) {
    return {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      deviceInfo: req.get('user-agent')
    };
  }
}

module.exports = PaymentLogger;
