/** Operational HTTP error — safe message may be sent to clients for 4xx (not for 5xx bodies). */
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = Number(statusCode) || 500;
    this.isOperational = true;
  }
}

module.exports = { HttpError };
