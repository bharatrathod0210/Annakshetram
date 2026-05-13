const { HttpError } = require('../utils/httpError');
const { logger } = require('../utils/logger');

const GENERIC_500 = 'Something went wrong. Please try again later.';
const GENERIC_400 = 'Invalid request data';
const GENERIC_409 = 'This record already exists';

/**
 * Express error handler — never exposes stack or raw DB/driver messages for server errors.
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode =
    err.statusCode ||
    err.status ||
    (err.name === 'ValidationError' ? 400 : null) ||
    (err.name === 'CastError' ? 400 : null) ||
    (err.code === 11000 ? 409 : null);

  if (!statusCode || statusCode < 400) {
    statusCode = 500;
  }

  const isOperational = err instanceof HttpError || err.isOperational === true;

  let message;
  if (statusCode >= 500) {
    message = GENERIC_500;
  } else if (isOperational && typeof err.message === 'string' && err.message.length > 0 && err.message.length < 400) {
    message = err.message;
  } else if (statusCode === 400 && err.name === 'ValidationError') {
    message = GENERIC_400;
  } else if (statusCode === 409 || err.code === 11000) {
    message = GENERIC_409;
  } else {
    message = 'Request could not be completed';
  }

  if (statusCode >= 500) {
    logger.error('Server error response', {
      category: 'error',
      success: false,
      statusCode,
      meta: {
        method: req.method,
        url: req.originalUrl,
        name: err.name,
        code: err.code,
        message: err.message,
      },
      stack: err.stack,
    });
  } else {
    logger.warn('Client error response', {
      category: 'error',
      success: false,
      statusCode,
      meta: { method: req.method, url: req.originalUrl, name: err.name },
    });
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = { errorHandler, GENERIC_500 };
