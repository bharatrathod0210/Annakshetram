const fs = require('fs');
const path = require('path');

class FileLogger {
  constructor() {
    // Create logs directory if it doesn't exist
    this.logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Get log file path for today
   */
  getLogFilePath(type = 'payment') {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logsDir, `${type}-${today}.log`);
  }

  /**
   * Format log entry
   */
  formatLogEntry(data) {
    const timestamp = new Date().toISOString();
    const separator = '='.repeat(80);
    
    let logEntry = `\n${separator}\n`;
    logEntry += `[${timestamp}] ${data.operation} - ${data.status}\n`;
    logEntry += `${separator}\n`;
    
    // Basic Info
    logEntry += `Order ID: ${data.orderId}\n`;
    logEntry += `User: ${data.userName} (${data.userEmail})\n`;
    logEntry += `Amount: ₹${data.amount}\n`;
    
    if (data.razorpayOrderId) {
      logEntry += `Razorpay Order ID: ${data.razorpayOrderId}\n`;
    }
    
    if (data.razorpayPaymentId) {
      logEntry += `Razorpay Payment ID: ${data.razorpayPaymentId}\n`;
    }
    
    if (data.paymentMethod) {
      logEntry += `Payment Method: ${data.paymentMethod}\n`;
    }
    
    // Status & Reason
    logEntry += `\nStatus: ${data.status}\n`;
    logEntry += `Reason: ${data.reason}\n`;
    
    // Error Details (if any)
    if (data.error || data.razorpayError) {
      logEntry += `\n--- ERROR DETAILS ---\n`;
      
      if (data.error) {
        logEntry += `Error Code: ${data.error.code || 'N/A'}\n`;
        logEntry += `Description: ${data.error.description || 'N/A'}\n`;
        logEntry += `Source: ${data.error.source || 'N/A'}\n`;
        logEntry += `Step: ${data.error.step || 'N/A'}\n`;
        
        if (data.error.metadata) {
          logEntry += `Metadata: ${JSON.stringify(data.error.metadata, null, 2)}\n`;
        }
      }
      
      if (data.razorpayError) {
        logEntry += `\nRazorpay Error:\n`;
        logEntry += JSON.stringify(data.razorpayError, null, 2) + '\n';
      }
    }
    
    // Refund Details (if any)
    if (data.refundDetails) {
      logEntry += `\n--- REFUND DETAILS ---\n`;
      logEntry += `Refund ID: ${data.refundDetails.refundId || 'N/A'}\n`;
      logEntry += `Refund Amount: ₹${data.refundDetails.refundAmount || 0}\n`;
      logEntry += `Refund Status: ${data.refundDetails.refundStatus || 'N/A'}\n`;
      logEntry += `Refund Reason: ${data.refundDetails.refundReason || 'N/A'}\n`;
    }
    
    // Request Data
    if (data.requestData) {
      logEntry += `\n--- REQUEST DATA ---\n`;
      logEntry += JSON.stringify(data.requestData, null, 2) + '\n';
    }
    
    // Response Data
    if (data.responseData) {
      logEntry += `\n--- RESPONSE DATA ---\n`;
      logEntry += JSON.stringify(data.responseData, null, 2) + '\n';
    }
    
    // System Info
    if (data.ipAddress || data.userAgent) {
      logEntry += `\n--- SYSTEM INFO ---\n`;
      if (data.ipAddress) logEntry += `IP Address: ${data.ipAddress}\n`;
      if (data.userAgent) logEntry += `User Agent: ${data.userAgent}\n`;
    }
    
    // Additional Notes
    if (data.notes) {
      logEntry += `\nNotes: ${data.notes}\n`;
    }
    
    // Metadata
    if (data.metadata) {
      logEntry += `\n--- METADATA ---\n`;
      logEntry += JSON.stringify(data.metadata, null, 2) + '\n';
    }
    
    logEntry += `${separator}\n`;
    
    return logEntry;
  }

  /**
   * Write log to file
   */
  writeLog(data, type = 'payment') {
    try {
      const logFilePath = this.getLogFilePath(type);
      const logEntry = this.formatLogEntry(data);
      
      // Append to log file
      fs.appendFileSync(logFilePath, logEntry, 'utf8');
      
      return true;
    } catch (error) {
      console.error('File Logger Error:', error);
      return false;
    }
  }

  /**
   * Read log file
   */
  readLog(date, type = 'payment') {
    try {
      const logFilePath = path.join(this.logsDir, `${type}-${date}.log`);
      
      if (!fs.existsSync(logFilePath)) {
        return null;
      }
      
      return fs.readFileSync(logFilePath, 'utf8');
    } catch (error) {
      console.error('Error reading log file:', error);
      return null;
    }
  }

  /**
   * Get all log files
   */
  getLogFiles(type = 'payment') {
    try {
      const files = fs.readdirSync(this.logsDir);
      return files
        .filter(file => file.startsWith(`${type}-`) && file.endsWith('.log'))
        .map(file => ({
          filename: file,
          date: file.replace(`${type}-`, '').replace('.log', ''),
          path: path.join(this.logsDir, file),
          size: fs.statSync(path.join(this.logsDir, file)).size
        }))
        .sort((a, b) => b.date.localeCompare(a.date));
    } catch (error) {
      console.error('Error getting log files:', error);
      return [];
    }
  }

  /**
   * Delete old log files (older than specified days)
   */
  cleanOldLogs(daysToKeep = 30, type = 'payment') {
    try {
      const files = this.getLogFiles(type);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      let deletedCount = 0;
      
      files.forEach(file => {
        const fileDate = new Date(file.date);
        if (fileDate < cutoffDate) {
          fs.unlinkSync(file.path);
          deletedCount++;
        }
      });
      
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning old logs:', error);
      return 0;
    }
  }
}

module.exports = new FileLogger();
