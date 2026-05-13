const { logHttp } = require('../utils/logger');

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Logs completed mutating requests only (POST/PUT/PATCH/DELETE) — not GET/HEAD/OPTIONS.
 */
function requestLogger(req, res, next) {
  const method = req.method.toUpperCase();
  if (!MUTATING_METHODS.has(method)) {
    return next();
  }

  const start = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const ok = res.statusCode < 400;
    logHttp({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip,
      userAgent: (req.headers['user-agent'] || '').slice(0, 512),
      ok,
      meta: { ok },
    });
  });
  next();
}

module.exports = { requestLogger };
