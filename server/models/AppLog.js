const mongoose = require('mongoose');
const generateId = require('../utils/generateId');

const appLogSchema = new mongoose.Schema(
  {
    logId: { type: String, default: () => generateId('log'), unique: true, index: true },
    level: { type: String, required: true, index: true },
    message: { type: String, required: true },
    category: { type: String, default: 'general', index: true },
    success: { type: Boolean, default: true, index: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    method: { type: String },
    url: { type: String },
    statusCode: { type: Number },
    durationMs: { type: Number },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

appLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AppLog', appLogSchema);
