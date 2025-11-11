const redisClient = require("./redisClient");

/**
 * Rate Limiter with dynamic config
 * @param {string} key - Unique identifier (userId, API key, IP)
 * @returns {Promise<{allowed: boolean, remaining: number, reset: number}>}
 */
async function rateLimiter(key) {
  // 1. Fetch client config
  const configKey = `ratelimit:config:${key}`;
  let config = await redisClient.hGetAll(configKey);

  if (!config || !config.maxRequests) {
    // Default values if no config found
    config = { maxRequests: 5, windowSeconds: 60 };
  } else {
    // Convert from strings (Redis stores values as strings)
    config.maxRequests = parseInt(config.maxRequests);
    config.windowSeconds = parseInt(config.windowSeconds);
  }

  const redisKey = `ratelimit:counter:${key}`;

  const tx = redisClient.multi();
  tx.incr(redisKey);
  tx.expire(redisKey, config.windowSeconds);

  const [current, _] = await tx.exec();

  const allowed = current <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - current);
  const reset = config.windowSeconds;

  return { allowed, remaining, reset };
}

module.exports = rateLimiter;
