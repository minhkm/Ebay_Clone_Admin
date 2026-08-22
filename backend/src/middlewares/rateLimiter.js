import rateLimit from 'express-rate-limit';

// Live Telemetry Store
const telemetry = {
  totalRequests: 0,
  blockedRequests: 0,
  activeIps: new Map(),
  startedAt: Date.now(),
};

/**
 * Clean up expired IP trackers periodically
 */
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  for (const [ip, lastSeen] of telemetry.activeIps.entries()) {
    if (now - lastSeen > windowMs) {
      telemetry.activeIps.delete(ip);
    }
  }
}, 60000);

/**
 * Global Rate Limiter for all incoming requests
 * Prevents DDoS, brute-force, and abusive traffic by client IP.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    telemetry.blockedRequests += 1;
    res.status(options.statusCode).json({
      success: false,
      message: 'Quá nhiều yêu cầu từ địa chỉ IP này. Vui lòng thử lại sau 15 phút.',
      retryAfter: Math.ceil(options.windowMs / 1000),
    });
  },
  requestWasSuccessful: () => true,
  skip: (req) => {
    telemetry.totalRequests += 1;
    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    telemetry.activeIps.set(clientIp, Date.now());
    return false;
  },
});

/**
 * Strict Rate Limiter for sensitive actions
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    telemetry.blockedRequests += 1;
    res.status(options.statusCode).json({
      success: false,
      message: 'Quá nhiều thao tác từ địa chỉ IP này. Vui lòng thử lại sau.',
      retryAfter: Math.ceil(options.windowMs / 1000),
    });
  },
});

/**
 * Retrieve real-time dynamic telemetry from the rate limiter
 */
export const getRateLimiterTelemetry = () => {
  const activeClientsCount = telemetry.activeIps.size || 1;
  const isHealthy = telemetry.blockedRequests < 50;

  return {
    status: isHealthy ? 'healthy' : 'warning',
    activeClientsCount,
    totalRequests: telemetry.totalRequests,
    blockedRequests: telemetry.blockedRequests,
    windowLimit: 300,
    windowMinutes: 15,
    detail: `${activeClientsCount} active client IP(s) • ${telemetry.totalRequests} reqs tracked (${telemetry.blockedRequests} blocked)`,
  };
};

export default {
  generalLimiter,
  strictLimiter,
  getRateLimiterTelemetry,
};
