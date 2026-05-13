const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`, { category: 'database', success: true });
  } catch (error) {
    logger.error('MongoDB connection failed', {
      category: 'database',
      success: false,
      meta: { message: error.message },
      stack: error.stack,
    });
    process.exit(1);
  }
};

module.exports = connectDB;
