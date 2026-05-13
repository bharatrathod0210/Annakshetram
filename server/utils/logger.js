const fs = require('fs');
const path = require('path');
const winston = require('winston');
const Transport = require('winston-transport');
const mongoose = require('mongoose');

const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, '..', 'logs');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

class MongoTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
      if (mongoose.connection.readyState !== 1) {
        callback();
        return;
      }
      try {
        const AppLog = require('../models/AppLog');
        const { level, message, category, success, meta, method, url, statusCode, durationMs, ip, userAgent } = info;
        AppLog.create({
          level,
          message: String(message).slice(0, 8000),
          category: category || 'general',
          success: success !== undefined ? !!success : !['error'].includes(level),
          meta: typeof meta === 'object' && meta !== null ? meta : {},
          method,
          url,
          statusCode,
          durationMs,
          ip,
          userAgent,
        }).catch(() => {});
      } catch {
        /* avoid logging loop */
      }
      callback();
    });
  }
}

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp, stack, ...rest }) => {
    const meta = Object.keys(rest).length ? JSON.stringify(rest) : '';
    const suffix = stack ? ` ${stack}` : '';
    return `${timestamp} [${level}] ${message}${meta ? ` ${meta}` : ''}${suffix}`;
  })
);

const mainTransports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
    ),
  }),
  new winston.transports.File({
    filename: path.join(LOG_DIR, 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 5242880,
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: path.join(LOG_DIR, 'combined.log'),
    format: fileFormat,
    maxsize: 5242880,
    maxFiles: 5,
  }),
];

if (process.env.LOG_TO_MONGO !== 'false') {
  mainTransports.push(new MongoTransport({ level: process.env.LOG_MONGO_LEVEL || 'silly' }));
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp()
  ),
  transports: mainTransports,
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(LOG_DIR, 'rejections.log'), format: fileFormat }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(LOG_DIR, 'exceptions.log'), format: fileFormat }),
  ],
});

function logHttp(meta) {
  const { ok, ...rest } = meta;
  // Use 'info' so requests are logged when LOG_LEVEL defaults to info (winston skips 'http' below that)
  logger.log({
    level: 'info',
    message: `HTTP ${rest.method || ''} ${rest.url || ''} ${rest.statusCode || ''}`,
    category: 'http',
    success: ok !== false,
    ...rest,
  });
}

module.exports = { logger, logHttp };
